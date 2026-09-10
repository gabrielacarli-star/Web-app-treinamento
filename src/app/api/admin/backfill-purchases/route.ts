import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractHotmartAmount } from "@/lib/hotmartPayload";
import { campaignRef, parseAttributionBlob, resolveAttribution } from "@/lib/attribution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATCH_SIZE = 500;

/**
 * One-time backfill for purchases recorded before amount_cents/campaign_id
 * existed (see migration 0003). Needs no new credentials: every purchase
 * already has its full webhook payload in `raw` (Hotmart) or the Stripe
 * Event object (Stripe) -- this just re-runs the same extraction the live
 * webhook now does going forward, against what's already stored.
 *
 * Idempotent and safe to call repeatedly: each call picks up whatever
 * purchases still have amount_cents null, so there is no cursor to track.
 * `done: false` means there's likely more than one batch's worth left.
 *
 *   GET /api/admin/backfill-purchases
 */
export async function GET(request: Request) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });
  }
  const provided = request.headers.get("x-admin-secret") ?? "";
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ error: "supabase not configured" }, { status: 500 });
  }

  const { data: rows, error } = await supabase
    .from("purchases")
    .select("id, email, raw")
    .is("amount_cents", null)
    .not("raw", "is", null)
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) {
    console.error("backfill-purchases: query failed", error.message);
    return NextResponse.json({ error: "could not read purchases" }, { status: 500 });
  }
  if (!rows?.length) {
    return NextResponse.json({ ok: true, done: true, updated: 0, skipped: 0 });
  }

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const raw = row.raw as Record<string, unknown>;
    let amountCents: number | null = null;
    let currency: string | null = null;
    let trackingBlob: string | null = null;

    if (raw?.data && typeof raw.data === "object" && "purchase" in (raw.data as object)) {
      // Hotmart-shaped payload.
      const extracted = extractHotmartAmount(raw);
      amountCents = extracted.amountCents;
      currency = extracted.currency;
      trackingBlob = extracted.trackingSrc;
    } else if (raw?.type && raw?.data && typeof raw.data === "object" && "object" in (raw.data as object)) {
      // Stripe Event object (invoice.payment_succeeded).
      const invoice = (raw.data as Record<string, unknown>).object as
        | { amount_paid?: number; currency?: string }
        | undefined;
      amountCents = typeof invoice?.amount_paid === "number" ? invoice.amount_paid : null;
      currency = invoice?.currency ?? null;
    }

    if (amountCents == null) {
      // Malformed or unrecognized raw shape -- leave for manual inspection
      // rather than guess; harmless to retry on the next call.
      skipped++;
      continue;
    }

    const attribution = row.email
      ? await resolveAttribution(supabase, row.email, parseAttributionBlob(trackingBlob))
      : {};
    const { campaignId, adId } = campaignRef(attribution);

    const { error: updateError } = await supabase
      .from("purchases")
      .update({
        amount_cents: amountCents,
        currency,
        utm_source: attribution.utm_source ?? null,
        utm_campaign: attribution.utm_campaign ?? null,
        utm_content: attribution.utm_content ?? null,
        fbclid: attribution.fbclid ?? null,
        campaign_id: campaignId,
        ad_id: adId,
      })
      .eq("id", row.id);

    if (updateError) {
      console.error("backfill-purchases: update failed for", row.id, updateError.message);
      skipped++;
      continue;
    }
    updated++;
  }

  return NextResponse.json({ ok: true, done: rows.length < BATCH_SIZE, updated, skipped, batch: rows.length });
}
