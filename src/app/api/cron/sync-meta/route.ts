import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncMetaInsights } from "@/lib/metaSync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Syncs Meta Ads spend.
 *
 * Cron mode (default): `?days=3` syncs the last N days, to catch late
 * attribution adjustments. Same auth pattern as recover-leads: Vercel Cron
 * sends `Authorization: Bearer <CRON_SECRET>` automatically once a variable
 * named exactly CRON_SECRET exists.
 *
 * Backfill mode: `?since=2020-01-01&until=2026-09-10` syncs a specific
 * historical window, to pull spend back to the start of the account.
 * Processes at most 31 days per call (function-timeout safety); the
 * response carries `nextSince` when there's more left -- call again with
 * `since=<nextSince>` (same `until`) until `done: true`.
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
  const explicitSince = url.searchParams.get("since");
  const explicitUntil = url.searchParams.get("until");

  let since: string;
  let until: string;
  let nextSince: string | null = null;

  if (explicitSince) {
    since = explicitSince;
    const requestedUntil = explicitUntil || new Date().toISOString().slice(0, 10);
    const sliceEnd = new Date(Date.parse(`${since}T00:00:00Z`) + 30 * 86_400_000);
    const requestedUntilDate = new Date(`${requestedUntil}T00:00:00Z`);
    if (sliceEnd < requestedUntilDate) {
      until = sliceEnd.toISOString().slice(0, 10);
      nextSince = new Date(sliceEnd.getTime() + 86_400_000).toISOString().slice(0, 10);
    } else {
      until = requestedUntil;
    }
  } else {
    const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days")) || 3));
    until = new Date().toISOString().slice(0, 10);
    since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  }

  try {
    const result = await syncMetaInsights(supabase, { accountId, accessToken, since, until });
    return NextResponse.json({
      ok: true,
      since,
      until,
      done: nextSince == null,
      ...(nextSince ? { nextSince } : {}),
      ...result,
    });
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
