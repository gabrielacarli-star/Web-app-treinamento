import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * UTM/click-id attribution -- what campaign a lead or buyer came from.
 * Shared between the client-side capture (Landing.tsx, Offer.tsx) and the
 * server-side webhooks that need to attach it to a purchase.
 */
export type Attribution = {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  fbclid?: string | null;
  gclid?: string | null;
};

export const ATTRIBUTION_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export function hasAttribution(a: Attribution): boolean {
  return ATTRIBUTION_FIELDS.some((f) => !!a[f]);
}

/**
 * "Campanha Fria 01|120210987654320123" -> { name, id }. This is the
 * convention Meta's ad "URL Parameters" field is set up to produce
 * (utm_campaign={{campaign.name}}|{{campaign.id}}) -- see README. Without
 * it configured on the ad, campaignId/adId stay null and the sale is still
 * attributed to "meta" traffic (via fbclid) but not to a specific campaign.
 */
export function splitNameId(value?: string | null): { name: string | null; id: string | null } {
  if (!value) return { name: null, id: null };
  const raw = decodeURIComponent(String(value).replace(/\+/g, " ")).trim();
  if (!raw) return { name: null, id: null };

  const cut = raw.lastIndexOf("|");
  if (cut === -1) {
    return /^\d{6,}$/.test(raw) ? { name: null, id: raw } : { name: raw, id: null };
  }
  const name = raw.slice(0, cut).trim() || null;
  const tail = raw.slice(cut + 1).trim();
  return { name, id: /^\d{6,}$/.test(tail) ? tail : null };
}

export function campaignRef(a: Attribution) {
  const campaign = splitNameId(a.utm_campaign);
  const ad = splitNameId(a.utm_content);
  return { campaignId: campaign.id, campaignName: campaign.name, adId: ad.id, adName: ad.name };
}

/**
 * Some gateways only round-trip one free-text field, so the funnel packs
 * the whole querystring into it (see getDecoratedCheckoutUrl-equivalent in
 * Offer.tsx, which sets `src` this way). Unpacks it back into individual
 * utm_ and click-id fields.
 */
export function parseAttributionBlob(blob?: string | null): Attribution {
  if (!blob || !blob.includes("utm_")) return {};
  const qs = new URLSearchParams(blob.replace(/^\?/, ""));
  const out: Attribution = {};
  for (const f of ATTRIBUTION_FIELDS) {
    const v = qs.get(f);
    if (v) out[f] = v;
  }
  return out;
}

/**
 * Fallback for when the gateway payload carries no attribution at all
 * (happens with Stripe, whose Checkout Session we don't currently pass UTMs
 * into): looks up the most recent quiz_leads row for this e-mail, so a
 * buyer who left their address in the quiz is still attributed to the
 * campaign that brought them, even though the payment itself is silent.
 */
export async function lookupAttributionByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<Attribution> {
  const { data } = await supabase
    .from("quiz_leads")
    .select("utm_source,utm_medium,utm_campaign,utm_content,utm_term,fbclid,gclid")
    .eq("email", email.toLowerCase())
    .order("last_seen_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Attribution | null) ?? {};
}

/** Resolves attribution for a purchase: gateway payload first, quiz_leads by e-mail as fallback. */
export async function resolveAttribution(
  supabase: SupabaseClient,
  email: string,
  fromGateway: Attribution,
): Promise<Attribution> {
  if (hasAttribution(fromGateway)) return fromGateway;
  return lookupAttributionByEmail(supabase, email);
}
