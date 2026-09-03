import type { Locale } from "./types";

export const LOCALES: Locale[] = ["es", "pt", "en"];
export const DEFAULT_LOCALE: Locale = "es";

export const isLocale = (value: string): value is Locale =>
  (LOCALES as string[]).includes(value);

export const BRAND = {
  name: "DogFlow",
  legal: "DogFlow Digital Ltda.",
  supportEmail: "oi@dogflow.app",
};

/** The real, live domain — used to build absolute links from server code
 *  (e-mails, redirects) and from client code (share links) alike. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://web-app-treinamento.vercel.app";

/** Welcome discount handed out by the scratch-card step. */
export const DISCOUNT = 0.6;

/** Minutes the paywall countdown runs for. */
export const OFFER_MINUTES = 10;

export type Plan = {
  id: "p7" | "p4" | "p12";
  weeks: number;
  /** Full price per week before the welcome discount. */
  basePerWeek: number;
  popular?: boolean;
};

export const PLANS: Plan[] = [
  { id: "p7", weeks: 1, basePerWeek: 4.97 },
  { id: "p4", weeks: 4, basePerWeek: 4.07, popular: true },
  { id: "p12", weeks: 12, basePerWeek: 2.9 },
];

/** How long each plan grants access for — shared by every checkout provider's webhook. */
export const TERM_DAYS: Record<Plan["id"], number> = { p7: 7, p4: 28, p12: 84 };

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "USD";

export const priceOf = (plan: Plan, discount = DISCOUNT) => {
  const perWeek = plan.basePerWeek * (1 - discount);
  return {
    basePerWeek: plan.basePerWeek,
    perWeek,
    // Truncated, not rounded: the headline daily price must never read higher
    // than what the weekly charge actually works out to.
    perDay: Math.floor((perWeek / 7) * 100) / 100,
    total: perWeek * plan.weeks,
  };
};

export const money = (value: number) => value.toFixed(2);

/**
 * External checkout, one URL per plan.
 *
 * These are the live links, kept in the code rather than only in environment
 * variables: they are public URLs, not secrets, and leaving them to config
 * meant a missing variable silently dropped every buyer on the success page
 * instead of the payment page. An environment variable still wins, so they
 * can be repointed without a code change.
 */
const CHECKOUT_URLS: Record<Plan["id"], string | undefined> = {
  p7:
    process.env.NEXT_PUBLIC_CHECKOUT_P7 ||
    "https://pay.hotmart.com/E107384687R?off=oclgtyj3",
  p4:
    process.env.NEXT_PUBLIC_CHECKOUT_P4 ||
    "https://pay.hotmart.com/E107384687R?off=18ebtmsk",
  p12:
    process.env.NEXT_PUBLIC_CHECKOUT_P12 ||
    "https://pay.hotmart.com/E107384687R?off=6l1op398",
};

/** True when a buy button leads to a real payment page. */
export const CHECKOUT_CONFIGURED = Object.values(CHECKOUT_URLS).some(Boolean);

/**
 * Maps a checkout offer code back to a plan id, so the webhook knows which
 * term to grant. Same reasoning as the URLs above: public, and useless as a
 * secret.
 */
export const OFFER_TO_PLAN: Record<string, Plan["id"]> = {
  [process.env.HOTMART_OFFER_P7 || "oclgtyj3"]: "p7",
  [process.env.HOTMART_OFFER_P4 || "18ebtmsk"]: "p4",
  [process.env.HOTMART_OFFER_P12 || "6l1op398"]: "p12",
};

export const checkoutUrl = (
  planId: Plan["id"],
  locale: Locale,
  params: Record<string, string> = {},
) => {
  const base = CHECKOUT_URLS[planId];
  if (!base) return `/${locale}/success?plan=${planId}`;

  try {
    const url = new URL(base);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return base;
  }
};

/** Optional webhook that receives the captured e-mail + quiz answers. */
export const LEAD_WEBHOOK = process.env.NEXT_PUBLIC_LEAD_WEBHOOK ?? "";
