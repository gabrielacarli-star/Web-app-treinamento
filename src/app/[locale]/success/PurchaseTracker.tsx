"use client";

import { useEffect } from "react";
import { CURRENCY, DISCOUNT, PLANS, priceOf } from "@/lib/config";
import { trackOnce } from "@/lib/pixel";

/**
 * Reports the sale to the ad platform. The value sent is what the buyer was
 * actually charged for the whole term, not the weekly rate shown on the
 * paywall — reporting the weekly figure would teach the platform to optimise
 * against a number three to twelve times too small.
 */
export function PurchaseTracker({ plan }: { plan?: string }) {
  useEffect(() => {
    const found = PLANS.find((p) => p.id === plan);
    const value = found ? Number(priceOf(found, DISCOUNT).total.toFixed(2)) : undefined;

    trackOnce(`purchase:${plan ?? "unknown"}`, "Purchase", {
      value,
      currency: CURRENCY,
      content_ids: plan ? [plan] : undefined,
      content_type: "product",
    });
  }, [plan]);

  return null;
}
