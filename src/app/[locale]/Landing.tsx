"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Dict } from "@/content";
import { Cta } from "@/components/Cta";
import { Art } from "@/components/Art";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Logo } from "@/components/Logo";
import { useFunnel } from "@/lib/store";
import { trackProgress } from "@/lib/track";
import type { Locale } from "@/lib/types";

export function Landing({
  locale,
  dict,
  variantId,
}: {
  locale: Locale;
  dict: Dict;
  variantId: string;
}) {
  const router = useRouter();
  const { patch, reset } = useFunnel();
  const variant =
    dict.landing.variants.find((item) => item.id === variantId) ??
    dict.landing.variants[0];

  // Each landing hit starts a clean run so a returning visitor is not stuck
  // with stale answers from a previous session.
  useEffect(() => {
    reset();
    patch({ variant: variantId });
    trackProgress({ locale, variant: variantId, lastStep: "landing", stepCount: 0 });
    // Runs once per landing hit; reset/patch are stable setters and do not
    // need to be in the dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantId]);

  return (
    <div className="funnel-shell">
      <header className="flex h-14 items-center justify-center">
        <Logo />
      </header>

      <main className="flex flex-1 flex-col px-5 pb-6">
        <h1 className="headline mt-2 text-center text-[28px]">
          {variant.pre}{" "}
          <span className="text-violet-600">{variant.highlight}</span>
        </h1>

        <div className="my-6">
          <Art id={`hero-${variant.id}`} priority />
        </div>

        <div className="mt-auto">
          <p className="mb-4 px-2 text-center text-[11px] leading-relaxed text-ink-faint">
            {dict.landing.consent}
          </p>
          <Cta onClick={() => router.push(`/${locale}/quiz`)}>
            {dict.landing.cta}
          </Cta>
          <LocaleSwitcher current={locale} />
        </div>
      </main>
    </div>
  );
}
