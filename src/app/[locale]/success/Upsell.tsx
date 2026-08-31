"use client";

import { useState } from "react";
import { UPSELL_OFFERS } from "@/lib/upsell";
import { track } from "@/lib/pixel";
import { useFunnel } from "@/lib/store";
import type { Locale } from "@/lib/types";

/**
 * Cross-sell shown once, right after a real DogFlow purchase. Each offer
 * sends the buyer through *that* product's own quiz funnel rather than
 * straight to its checkout — with the dog's name and e-mail already
 * collected here carried over by query param, so that funnel never asks
 * for them again. Purely additive: it never blocks the buyer's own
 * purchase confirmation above it, so "skip" just dismisses this block
 * rather than gating navigation.
 */
export function Upsell({
  locale,
  heading,
  skipLabel,
}: {
  locale: Locale;
  heading: string;
  skipLabel: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  const { answers, email } = useFunnel();
  const dogName = (answers.dog_name as string) || "";
  if (!UPSELL_OFFERS.length || dismissed) return null;

  return (
    <div className="mt-8 rounded-xl2 border border-line bg-white p-5">
      <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">
        {heading}
      </p>
      <div className="mt-4 space-y-4">
        {UPSELL_OFFERS.map((offer) => {
          const copy = offer.copy[locale] ?? offer.copy.es;
          const url = new URL(`/${locale}`, offer.quizUrl);
          if (dogName) url.searchParams.set("pet", dogName);
          if (email) url.searchParams.set("email", email);
          return (
            <div
              key={offer.id}
              className="flex flex-col gap-3 rounded-xl2 bg-cream px-4 py-4"
            >
              <div>
                <p className="text-[15px] font-bold text-ink">
                  {offer.productName}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  {copy.tagline}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-action-600">
                  {offer.priceLabel}
                </p>
              </div>
              <a
                href={url.toString()}
                onClick={() =>
                  track("ViewContent", {
                    content_ids: [offer.id],
                    content_name: offer.productName,
                    content_type: "product",
                  })
                }
                className="rounded-pill bg-action-500 px-4 py-2.5 text-center text-[14px] font-bold text-white"
              >
                {copy.cta}
              </a>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="mt-4 w-full text-center text-[13px] text-ink-faint underline"
      >
        {skipLabel}
      </button>
    </div>
  );
}
