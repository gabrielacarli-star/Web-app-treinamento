/**
 * Reads which other products (Pet Saudável / SOS Pet, sold under the same
 * seller but built as a separate app with its own Supabase project) a
 * signed-in DogFlow buyer also owns, so the member area can show — and
 * gate — them without duplicating that app's purchase data here.
 *
 * Calls a purpose-built Edge Function (`check-access`) in the Pet Saudável
 * Supabase project rather than reading its database directly: that project
 * never hands out its service_role key, and this route never needs one.
 */

const CHECK_ACCESS_URL =
  "https://iqbrncszbkrmlgkmcixp.functions.supabase.co/check-access";

export const PET_SAUDAVEL_APP_URL = "https://app.medveteduardosebastiao.com";

export type OtherProduct = {
  productId: string;
  title: string | null;
  description: string | null;
  coverUrl: string | null;
  checkoutUrl: string | null;
};

/** Never throws: a lookup failure just means an empty "other products" list. */
export async function getOtherProducts(email: string): Promise<OtherProduct[]> {
  const secret = process.env.PET_SAUDAVEL_CROSS_SECRET;
  if (!secret) return [];

  try {
    const res = await fetch(CHECK_ACCESS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cross-app-secret": secret,
      },
      body: JSON.stringify({ email }),
      // This is a live purchase check, never a cached one.
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { products?: OtherProduct[] };
    return data.products ?? [];
  } catch {
    return [];
  }
}
