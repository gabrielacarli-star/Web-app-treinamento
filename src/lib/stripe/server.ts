import Stripe from "stripe";
import type { Plan } from "@/lib/config";

let client: Stripe | null = null;

/** Lazily constructed so importing this module never throws before the key is set. */
export function getStripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  client = new Stripe(key);
  return client;
}

/**
 * One Stripe Price (one-time, USD) per plan — created in the Stripe
 * Dashboard under Products, matching the amounts `priceOf()` in
 * lib/config.ts already computes. These IDs are the source of truth for
 * what a buyer is actually charged; if the plan's price ever changes, the
 * Stripe Price must be updated (or a new one created) to match.
 */
export const STRIPE_PRICE_IDS: Record<Plan["id"], string | undefined> = {
  p7: process.env.STRIPE_PRICE_P7,
  p4: process.env.STRIPE_PRICE_P4,
  p12: process.env.STRIPE_PRICE_P12,
};

/** True once every plan has a Stripe Price wired up. */
export const STRIPE_CHECKOUT_CONFIGURED = Object.values(STRIPE_PRICE_IDS).every(Boolean);

/** The reverse of STRIPE_PRICE_IDS — recovers which plan a renewal invoice
 *  belongs to, since invoice line items carry the Price id, not our own. */
export const PRICE_TO_PLAN: Record<string, Plan["id"]> = Object.fromEntries(
  (Object.entries(STRIPE_PRICE_IDS) as [Plan["id"], string | undefined][])
    .filter((entry): entry is [Plan["id"], string] => Boolean(entry[1]))
    .map(([planId, priceId]) => [priceId, planId]),
);
