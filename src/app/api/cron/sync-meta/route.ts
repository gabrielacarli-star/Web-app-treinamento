import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncMetaInsights } from "@/lib/metaSync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Syncs Meta Ads spend for the last N days (default 3, to catch late
 * attribution adjustments). Same auth pattern as recover-leads: Vercel Cron
 * sends `Authorization: Bearer <CRON_SECRET>` automatically once a variable
 * named exactly CRON_SECRET exists.
 */
async function handle(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const accessToken = process.env.META_ACCESS_TOKEN;
  const accountId = process.env.META_AD_ACCOUNT_ID;
  if (!accessToken || !accountId) {
    return NextResponse.json({ ok: true, skipped: "META_ACCESS_TOKEN/META_AD_ACCOUNT_ID not set" });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ ok: true, skipped: "supabase not configured" });
  }

  const url = new URL(request.url);
  const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days")) || 3));
  const until = new Date().toISOString().slice(0, 10);
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

  try {
    const result = await syncMetaInsights(supabase, { accountId, accessToken, since, until });
    return NextResponse.json({ ok: true, since, until, ...result });
  } catch (error) {
    console.error("sync-meta: failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "sync failed" },
      { status: 502 },
    );
  }
}

export const GET = handle;
export const POST = handle;
