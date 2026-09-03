"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe, type Stripe as StripeJs } from "@stripe/stripe-js";
import type { Plan } from "@/lib/config";
import type { Locale } from "@/lib/types";

let stripePromise: Promise<StripeJs | null> | null = null;
function getStripeJs() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}

/**
 * Stripe's embedded Checkout, mounted inline in a modal on top of the offer
 * page — the buyer never leaves this page or gets redirected to a
 * different domain. Access is granted by the Stripe webhook once payment
 * succeeds, not by anything that happens in this component.
 */
export function StripeCheckoutModal({
  planId,
  locale,
  email,
  errorMessage,
  onClose,
}: {
  planId: Plan["id"];
  locale: Locale;
  email?: string;
  errorMessage: string;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let checkout: Awaited<ReturnType<StripeJs["createEmbeddedCheckoutPage"]>> | undefined;

    (async () => {
      const stripe = await getStripeJs();
      if (!stripe || cancelled) return;

      checkout = await stripe.createEmbeddedCheckoutPage({
        fetchClientSecret: async () => {
          const res = await fetch("/api/checkout/create-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: planId, locale, email }),
          });
          if (!res.ok) throw new Error("could not start checkout");
          const data = (await res.json()) as { clientSecret: string };
          return data.clientSecret;
        },
      });

      if (cancelled) {
        checkout.destroy();
        return;
      }
      if (containerRef.current) checkout.mount(containerRef.current);
    })().catch(() => setFailed(true));

    return () => {
      cancelled = true;
      checkout?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, locale, email]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-surface sm:rounded-2xl">
        <div className="flex items-center justify-end p-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint hover:bg-cream"
          >
            ✕
          </button>
        </div>
        <div className="min-h-[300px] flex-1 overflow-y-auto px-4 pb-4">
          {failed ? (
            <p className="py-10 text-center text-[14px] text-coral-600">{errorMessage}</p>
          ) : (
            <div ref={containerRef} />
          )}
        </div>
      </div>
    </div>
  );
}
