import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Spend x revenue x ROAS by campaign, for the /admin/trafego panel.
 * Protected by ADMIN_SECRET (header `x-admin-secret`) -- purchases and ad
 * spend are exactly the data this app is most careful not to expose.
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

  const url = new URL(request.url);
  const days = Math.max(1, Math.min(180, Number(url.searchParams.get("days")) || 14));
  const since = new Date(Date.now() - days * 86_400_000);
  const sinceDate = since.toISOString().slice(0, 10);

  const [{ data: insights, error: insightsError }, { data: purchases, error: purchasesError }] =
    await Promise.all([
      supabase
        .from("ad_insights")
        .select("date, campaign_id, campaign_name, spend_cents, impressions, clicks")
        .gte("date", sinceDate),
      supabase
        .from("purchases")
        .select("purchased_at, campaign_id, status, amount_cents")
        .gte("purchased_at", since.toISOString()),
    ]);

  if (insightsError || purchasesError) {
    console.error("metrics/summary: query failed", insightsError, purchasesError);
    return NextResponse.json({ error: "could not read metrics" }, { status: 500 });
  }

  type Bucket = {
    campaignId: string;
    campaignName: string | null;
    date: string;
    spendCents: number;
    impressions: number;
    clicks: number;
    revenueCents: number;
    refundedCents: number;
    orders: number;
  };

  const buckets = new Map<string, Bucket>();
  const keyOf = (campaignId: string, date: string) => `${campaignId}|${date}`;

  const bucketFor = (campaignId: string | null, date: string) => {
    const id = campaignId ?? "none";
    const key = keyOf(id, date);
    let b = buckets.get(key);
    if (!b) {
      b = {
        campaignId: id,
        campaignName: null,
        date,
        spendCents: 0,
        impressions: 0,
        clicks: 0,
        revenueCents: 0,
        refundedCents: 0,
        orders: 0,
      };
      buckets.set(key, b);
    }
    return b;
  };

  for (const r of insights ?? []) {
    const b = bucketFor(r.campaign_id, r.date);
    b.campaignName = r.campaign_name ?? b.campaignName;
    b.spendCents += r.spend_cents ?? 0;
    b.impressions += r.impressions ?? 0;
    b.clicks += r.clicks ?? 0;
  }

  for (const p of purchases ?? []) {
    const date = String(p.purchased_at).slice(0, 10);
    const b = bucketFor(p.campaign_id, date);
    const amount = p.amount_cents ?? 0;
    if (p.status === "active") {
      b.revenueCents += amount;
      b.orders += 1;
    } else if (p.status === "refunded" || p.status === "chargeback") {
      b.refundedCents += amount;
    }
  }

  const rows = [...buckets.values()]
    .map((b) => ({
      ...b,
      profitCents: b.revenueCents - b.refundedCents - b.spendCents,
      roas: b.spendCents > 0 ? b.revenueCents / b.spendCents : null,
    }))
    .sort((a, b) => (a.date === b.date ? b.spendCents - a.spendCents : b.date.localeCompare(a.date)));

  const totals = rows.reduce(
    (acc, r) => ({
      spendCents: acc.spendCents + r.spendCents,
      revenueCents: acc.revenueCents + r.revenueCents,
      refundedCents: acc.refundedCents + r.refundedCents,
      orders: acc.orders + r.orders,
    }),
    { spendCents: 0, revenueCents: 0, refundedCents: 0, orders: 0 },
  );

  return NextResponse.json({
    since: sinceDate,
    rows,
    totals: {
      ...totals,
      profitCents: totals.revenueCents - totals.refundedCents - totals.spendCents,
      roas: totals.spendCents > 0 ? totals.revenueCents / totals.spendCents : null,
    },
  });
}
