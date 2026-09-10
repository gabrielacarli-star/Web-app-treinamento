import type { SupabaseClient } from "@supabase/supabase-js";

const VERSION = process.env.META_API_VERSION || "v21.0";
const GRAPH = `https://graph.facebook.com/${VERSION}`;

type InsightRow = {
  date_start: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  ad_id?: string;
  ad_name?: string;
};

async function graph<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`Meta API: ${json?.error?.message || res.status}`);
  }
  return json as T;
}

/**
 * Pulls ad spend by ad and by day from the Meta Marketing API and upserts
 * it into ad_insights. time_increment=1 lets any period be sliced later
 * without asking the API again.
 */
export async function syncMetaInsights(
  supabase: SupabaseClient,
  opts: { accountId: string; accessToken: string; since: string; until: string },
) {
  const { accountId, accessToken, since, until } = opts;

  const fields = ["spend", "impressions", "clicks", "campaign_id", "campaign_name", "adset_id", "ad_id", "ad_name"].join(
    ",",
  );

  let url =
    `${GRAPH}/act_${accountId}/insights?level=ad&fields=${fields}` +
    `&time_range=${encodeURIComponent(JSON.stringify({ since, until }))}` +
    `&time_increment=1&limit=500&access_token=${encodeURIComponent(accessToken)}`;

  let rows: Array<Record<string, unknown>> = [];

  while (url) {
    const page = await graph<{ data: InsightRow[]; paging?: { next?: string } }>(url);

    for (const r of page.data || []) {
      if (!r.ad_id) continue;
      rows.push({
        platform: "meta",
        date: r.date_start,
        account_id: accountId,
        campaign_id: r.campaign_id ?? null,
        campaign_name: r.campaign_name ?? null,
        adset_id: r.adset_id ?? null,
        ad_id: r.ad_id,
        ad_name: r.ad_name ?? null,
        spend_cents: Math.round(parseFloat(r.spend || "0") * 100),
        impressions: Number(r.impressions || 0),
        clicks: Number(r.clicks || 0),
        updated_at: new Date().toISOString(),
      });
    }

    url = page.paging?.next || "";
  }

  // Supabase upsert caps out well above what one sync window returns, but
  // batch anyway so a very wide `days` range can't build one oversized request.
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    const { error } = await supabase
      .from("ad_insights")
      .upsert(batch, { onConflict: "platform,ad_id,date" });
    if (error) throw new Error(`ad_insights upsert failed: ${error.message}`);
  }

  return { insightRows: rows.length };
}
