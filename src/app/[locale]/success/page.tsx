import { notFound } from "next/navigation";
import Link from "next/link";
import { getDict } from "@/content";
import { CHECKOUT_CONFIGURED, isLocale } from "@/lib/config";
import { authConfigured } from "@/lib/access";
import { Logo } from "@/components/Logo";
import { PurchaseTracker } from "./PurchaseTracker";

/**
 * Two audiences reach this page.
 *
 * A real buyer, redirected here by the checkout platform's thank-you page:
 * they have paid and need to know how to get in.
 *
 * Us, walking the funnel before any checkout URL is configured: the buy
 * button falls back here, and the page says so.
 */
const checkoutLive = CHECKOUT_CONFIGURED;

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string }>;
}) {
  const { locale } = await params;
  const { plan } = await searchParams;
  if (!isLocale(locale)) notFound();

  const t = getDict(locale);
  // Signing in is only possible once auth exists; otherwise send them straight
  // into the open member area.
  const next = authConfigured ? `/${locale}/login` : `/${locale}/app`;

  return (
    <div className="funnel-shell">
      {/* Only a page reached through a live checkout represents a real sale. */}
      {checkoutLive && <PurchaseTracker plan={plan} />}

      <header className="flex h-14 items-center justify-center">
        <Logo />
      </header>

      <main className="flex flex-1 flex-col px-5 pb-10">
        <div className="mt-10 flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-[28px]">
            🎉
          </span>
          <h1 className="headline mt-5">
            {checkoutLive ? t.success.paidHeadline : t.success.headline}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {checkoutLive ? t.success.paidBody : t.success.body}
          </p>
          {plan && (
            <span className="mt-4 rounded-pill bg-violet-100 px-3 py-1 text-[12px] font-medium text-violet-700">
              {t.offer.planNames[plan] ?? plan}
            </span>
          )}
        </div>

        {checkoutLive ? (
          <ol className="mt-9 space-y-4">
            {t.success.paidSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-400 text-[13px] font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-[15px] leading-snug text-ink">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-8 rounded-xl2 border border-dashed border-coral-300 bg-coral-100 px-4 py-3 text-center text-[12px] leading-relaxed text-ink-soft">
            {t.success.placeholderNote}
          </p>
        )}

        <div className="mt-auto pt-10">
          <Link href={next} className="cta">
            {checkoutLive ? t.success.paidCta : t.success.cta}
          </Link>
          {checkoutLive && (
            <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-faint">
              {t.success.paidHint}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
