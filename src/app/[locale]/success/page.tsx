import { notFound } from "next/navigation";
import Link from "next/link";
import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { Logo } from "@/components/Logo";

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

  return (
    <div className="funnel-shell">
      <header className="flex h-14 items-center justify-center">
        <Logo />
      </header>

      <main className="flex flex-1 flex-col px-5 pb-10">
        <div className="mt-10 flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-[28px]">
            🎉
          </span>
          <h1 className="headline mt-5">{t.success.headline}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {t.success.body}
          </p>
          {plan && (
            <span className="mt-4 rounded-pill bg-violet-100 px-3 py-1 font-mono text-[12px] text-violet-700">
              {t.offer.planNames[plan] ?? plan}
            </span>
          )}
        </div>

        <p className="mt-8 rounded-xl2 border border-dashed border-coral-300 bg-coral-100 px-4 py-3 text-center text-[12px] leading-relaxed text-ink-soft">
          {t.success.placeholderNote}
        </p>

        <div className="mt-auto pt-8">
          <Link href={`/${locale}/app`} className="cta">
            {t.success.cta}
          </Link>
        </div>
      </main>
    </div>
  );
}
