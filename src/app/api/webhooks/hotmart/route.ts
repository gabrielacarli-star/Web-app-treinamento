import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { OFFER_TO_PLAN, TERM_DAYS, type Plan } from "@/lib/config";
import { provisionPasswordSetup } from "@/lib/auth/provisionPasswordSetup";
import { campaignRef, parseAttributionBlob, resolveAttribution } from "@/lib/attribution";
import { extractHotmartAmount, pick } from "@/lib/hotmartPayload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Events that grant access, and those that take it away. */
const GRANTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const REVOKES: Record<string, string> = {
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
  PURCHASE_PROTEST: "chargeback",
  PURCHASE_CANCELED: "cancelled",
  PURCHASE_EXPIRED: "expired",
  SUBSCRIPTION_CANCELLATION: "cancelled",
  SWITCH_PLAN: "cancelled",
};

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export async function POST(request: Request) {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected) {
    console.error("hotmart webhook: HOTMART_HOTTOK is not set");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const bodyText = await request.text();
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(bodyText) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // The token travels in a header on current versions and in the body on
  // older ones; accept either rather than silently rejecting live sales.
  const provided =
    request.headers.get("x-hotmart-hottok") ??
    request.headers.get("hottok") ??
    pick(payload, [["hottok"]]) ??
    "";

  if (!safeEqual(provided, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // The payload shape varies by version and event, so the raw body is stored
  // before anything is interpreted. A delivery we fail to parse is still
  // recoverable from this row.
  const event = pick(payload, [["event"], ["data", "event"]]);
  const email = pick(payload, [
    ["data", "buyer", "email"],
    ["data", "subscriber", "email"],
    ["buyer", "email"],
    ["email"],
  ]);
  const transaction = pick(payload, [
    ["data", "purchase", "transaction"],
    ["data", "transaction"],
    ["purchase", "transaction"],
    ["transaction"],
  ]);
  const productId = pick(payload, [
    ["data", "product", "id"],
    ["product", "id"],
    ["prod"],
  ]);
  const offer = pick(payload, [
    ["data", "purchase", "offer", "code"],
    ["data", "offer", "code"],
    ["offer", "code"],
  ]);
  // Hotmart only round-trips `src`/`sck` on the webhook, not arbitrary
  // custom params -- Offer.tsx packs the buyer's ad UTMs/click-ids as a
  // querystring blob into `src` for exactly this reason.
  const { amountCents, currency, trackingSrc } = extractHotmartAmount(payload);

  const { data: logged } = await supabase
    .from("webhook_events")
    .insert({ event, email, transaction, payload })
    .select("id")
    .single();

  const finish = async (handled: boolean, error?: string) => {
    if (logged?.id) {
      await supabase
        .from("webhook_events")
        .update({ handled, error: error ?? null })
        .eq("id", logged.id);
    }
  };

  if (!event) {
    await finish(false, "no event field in payload");
    return NextResponse.json({ error: "missing event" }, { status: 400 });
  }

  if (!email) {
    await finish(false, "no buyer e-mail found in payload");
    return NextResponse.json({ error: "missing buyer email" }, { status: 400 });
  }

  const plan = (offer && OFFER_TO_PLAN[offer]) ?? offer ?? null;
  const planId = plan && plan in TERM_DAYS ? (plan as Plan["id"]) : null;

  if (GRANTS.has(event)) {
    const days = planId ? TERM_DAYS[planId] : undefined;
    const expiresAt = days
      ? new Date(Date.now() + days * 86_400_000).toISOString()
      : null;

    const attribution = await resolveAttribution(
      supabase,
      email,
      parseAttributionBlob(trackingSrc),
    );
    const { campaignId, adId } = campaignRef(attribution);

    // onConflict on transaction makes retries idempotent.
    const { error } = await supabase.from("purchases").upsert(
      {
        email,
        plan,
        status: "active",
        transaction,
        product_id: productId,
        expires_at: expiresAt,
        amount_cents: amountCents,
        currency,
        utm_source: attribution.utm_source ?? null,
        utm_campaign: attribution.utm_campaign ?? null,
        utm_content: attribution.utm_content ?? null,
        fbclid: attribution.fbclid ?? null,
        campaign_id: campaignId,
        ad_id: adId,
        raw: payload,
      },
      { onConflict: "transaction", ignoreDuplicates: false },
    );

    if (error) {
      await finish(false, error.message);
      return NextResponse.json({ error: "could not record purchase" }, { status: 500 });
    }

    await provisionPasswordSetup(supabase, email, "hotmart webhook");

    await finish(true);
    return NextResponse.json({ ok: true, granted: email });
  }

  const revokedStatus = REVOKES[event];
  if (revokedStatus) {
    // Match on the transaction when we have one, so a refund on one purchase
    // does not revoke a different, still-valid one for the same buyer.
    const query = supabase.from("purchases").update({ status: revokedStatus });
    const { error } = transaction
      ? await query.eq("transaction", transaction)
      : await query.eq("email", email.toLowerCase()).eq("status", "active");

    if (error) {
      await finish(false, error.message);
      return NextResponse.json({ error: "could not revoke" }, { status: 500 });
    }

    await finish(true);
    return NextResponse.json({ ok: true, revoked: email });
  }

  // Everything else (billet printed, delayed, abandoned cart) is acknowledged
  // and kept in the log without touching access.
  await finish(true);
  return NextResponse.json({ ok: true, ignored: event });
}
