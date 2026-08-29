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
 * External checkout (Hotmart / Kiwify). Set one URL per plan in Vercel;
 * anything unset falls back to the success page so the funnel stays walkable
 * while the offer is still being validated.
 */
const CHECKOUT_URLS: Record<Plan["id"], string | undefined> = {
  p7: process.env.NEXT_PUBLIC_CHECKOUT_P7,
  p4: process.env.NEXT_PUBLIC_CHECKOUT_P4,
  p12: process.env.NEXT_PUBLIC_CHECKOUT_P12,
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
