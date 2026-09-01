"use client";

import { useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { Cta } from "@/components/Cta";
import { TimerBar, useCountdown } from "@/components/Countdown";
import { fill, type Dict } from "@/content";
import {
  BRAND,
  CURRENCY,
  DISCOUNT,
  OFFER_MINUTES,
  PLANS,
  checkoutUrl,
  money,
  priceOf,
  type Plan,
} from "@/lib/config";
import { useFunnel } from "@/lib/store";
import { track } from "@/lib/pixel";
import { estimateLocalPrice } from "@/lib/fx";
import type { Locale } from "@/lib/types";

export function Offer({
  locale,
  dict,
  country,
}: {
  locale: Locale;
  dict: Dict;
  /** ISO country code from Vercel's edge geolocation, or null off-Vercel. */
  country?: string | null;
}) {
  const { answers, email, offerStartedAt, variant, patch } = useFunnel();
  const [selected, setSelected] = useState<Plan["id"]>("p4");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { expired, label } = useCountdown(offerStartedAt, OFFER_MINUTES);

  // Only shown when a local-currency estimate actually renders below —
  // no point disclaiming a conversion nobody sees.
  const showsLocalEstimate = Boolean(estimateLocalPrice(1, country));

  const dog = (answers.dog_name as string) || dict.common.yourDog;

  // Personal coupon, mirroring the "{name}_{month}{year}" code the reference
  // offer stamps on the paywall.
  const coupon = useMemo(() => {
    const slug = String(dog).toLowerCase().replace(/[^a-z0-9]/g, "") || "dog";
    const now = new Date();
    const month = new Intl.DateTimeFormat("en", { month: "short" })
      .format(now)
      .toLowerCase();
    return `${slug}_${month}${String(now.getFullYear()).slice(2)}`;
  }, [dog]);

  const buy = () => {
    // Only parameters the checkout platform actually understands go on the
    // URL. `email` prefills the form and is the key the webhook later joins
    // the purchase to the login on; `sck` is the platform's own tracking
    // slot, used here to attribute the sale to a plan and ad angle.
    // The funnel's coupon code is cosmetic — the discount is already in the
    // price — so it is deliberately not sent: an unknown coupon would make
    // the checkout open on an error.
    const price = priceOf(PLANS.find((p) => p.id === selected)!, DISCOUNT);
    track("InitiateCheckout", {
      value: Number(price.total.toFixed(2)),
      currency: CURRENCY,
      content_ids: [selected],
      content_name: dict.offer.planNames[selected],
      content_type: "product",
    });

    window.location.href = checkoutUrl(selected, locale, {
      email,
      sck: [locale, selected, variant].filter(Boolean).join("-"),
    });
  };

  return (
    <div className="funnel-shell">
      {expired ? (
        <div className="sticky top-0 z-40 flex items-center justify-center gap-3 bg-ink px-4 py-2.5 text-white">
          <span className="text-[13px] font-semibold">{dict.offer.expired}</span>
          <button
            type="button"
            onClick={() => patch({ offerStartedAt: Date.now() })}
            className="rounded-md bg-white/20 px-2 py-0.5 text-[12px] font-semibold"
          >
            {dict.offer.restart}
          </button>
        </div>
      ) : (
        <TimerBar text={dict.offer.timer} value={label} />
      )}

      <header className="flex h-14 items-center justify-center">
        <Logo />
      </header>

      <main className="flex flex-col gap-8 px-5 pb-12">
        {/* Coupon */}
        <section className="rounded-xl2 bg-coral-100 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[17px] font-bold text-ink">
              🎟️ {dict.offer.promoTitle}
            </p>
            <span className="shrink-0 rounded-pill bg-violet-400 px-3 py-1 text-[12px] font-bold text-white">
              {dict.offer.promoBadge}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-[14px] font-medium text-ink">
              <span className="text-teal-600">✓</span>
              {coupon}
            </span>
            <span className="font-mono text-[20px] font-bold tabular-nums text-coral-600">
              {expired ? "00:00" : label}
            </span>
          </div>
        </section>

        {/* Plans */}
        <section className="space-y-3">
          {PLANS.map((plan) => {
            const price = priceOf(plan, DISCOUNT);
            const isSelected = selected === plan.id;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                aria-pressed={isSelected}
                className={`relative flex w-full items-center gap-3 rounded-xl2 border-2 bg-surface px-4 py-4 text-left transition ${
                  isSelected
                    ? "border-violet-400 shadow-pop"
                    : "border-line shadow-card hover:border-violet-300"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-4 rounded-pill bg-coral-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {dict.offer.popular}
                  </span>
                )}

                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-violet-500 bg-violet-500"
                      : "border-line bg-surface"
                  }`}
                >
                  {isSelected && (
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                      <path
                        d="M3.5 8.5l3 3 6-6.5"
                        stroke="#fff"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-bold text-ink">
                    {dict.offer.planNames[plan.id]}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ink-soft">
                    <s className="text-ink-faint">
                      {CURRENCY} {money(plan.basePerWeek)}
                    </s>{" "}
                    <span className="font-semibold text-ink">
                      {CURRENCY} {money(price.perWeek)}
                    </span>{" "}
                    {plan.weeks > 1 ? dict.offer.weekly : dict.offer.total}
                  </span>
                  {/* The checkout charges the whole term, so say so here
                      rather than letting the buyer discover it on the
                      payment page. */}
                  <span className="mt-0.5 block text-[11px] text-ink-faint">
                    {fill(dict.offer.billed, {
                      amount: `${CURRENCY} ${money(price.total)}`,
                    })}
                    {(() => {
                      const local = estimateLocalPrice(price.total, country);
                      return local ? ` (${fill(dict.offer.approx, { amount: local })})` : "";
                    })()}
                  </span>
                </span>

                <span className="shrink-0 text-right">
                  <span className="block text-[11px] font-semibold text-ink-faint">
                    {CURRENCY}
                  </span>
                  <span className="block text-[30px] font-black leading-none text-ink">
                    {money(price.perDay)}
                  </span>
                  <span className="block text-[11px] text-ink-faint">
                    {dict.offer.perDay}
                  </span>
                </span>
              </button>
            );
          })}
        </section>

        <div>
          <Cta onClick={buy}>{dict.offer.cta}</Cta>
          <p className="mt-3 text-center text-[12px] leading-relaxed text-ink-faint">
            {dict.offer.stat}
          </p>
          {showsLocalEstimate && (
            <p className="mt-1 text-center text-[11px] leading-relaxed text-ink-faint">
              {dict.offer.approxNote}
            </p>
          )}
        </div>

        {/* Why it works */}
        <section>
          <h2 className="headline text-center text-[22px]">
            {dict.offer.whyHeadline}
          </h2>
          <ul className="mt-4 space-y-3">
            {dict.offer.why.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-snug text-ink">
                <span className="mt-0.5 shrink-0 text-teal-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Guarantee */}
        <section className="rounded-xl2 border border-line bg-cream p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-600">
            {dict.offer.guaranteeEyebrow}
          </p>
          <h3 className="mt-1 text-[18px] font-bold text-ink">
            {dict.offer.guaranteeTitle}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            {dict.offer.guaranteeBody}
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="headline text-center text-[22px]">
            {dict.offer.faqHeadline}
          </h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {dict.offer.faq.map((item, index) => {
              const open = openFaq === index;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-3 py-4 text-left"
                  >
                    <span className="text-[15px] font-semibold text-ink">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-ink-faint transition-transform ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {open && (
                    <p className="-mt-1 pb-4 text-[14px] leading-relaxed text-ink-soft">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="headline text-center text-[22px]">
            {dict.offer.testimonialsHeadline}
          </h2>
          <div className="mt-4 space-y-3">
            {dict.offer.testimonials.map((item) => (
              <figure key={item.handle} className="rounded-xl2 bg-cream p-4">
                <figcaption className="text-[13px] font-semibold text-violet-600">
                  {item.handle}
                </figcaption>
                <p className="mt-1 text-[15px] font-bold text-ink">{item.title}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </figure>
            ))}
          </div>
        </section>

        <div className="pt-2">
          <Cta onClick={buy}>{dict.offer.cta}</Cta>
        </div>

        <footer className="pt-2 text-center text-[12px] leading-relaxed text-ink-faint">
          <p>
            {dict.offer.contact}{" "}
            <a className="underline" href={`mailto:${BRAND.supportEmail}`}>
              {BRAND.supportEmail}
            </a>
          </p>
          <p className="mt-2">{BRAND.legal}</p>
        </footer>
      </main>
    </div>
  );
}
