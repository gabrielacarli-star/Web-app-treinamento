"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Cta, CtaDock } from "@/components/Cta";
import { ScratchCard } from "@/components/ScratchCard";
import { fill, type Dict } from "@/content";
import { DISCOUNT } from "@/lib/config";
import { useFunnel } from "@/lib/store";
import type { Locale } from "@/lib/types";

export function Discount({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const { answers, patch } = useFunnel();
  const [won, setWon] = useState(false);

  const dog = (answers.dog_name as string) || dict.common.yourDog;

  const goToOffer = () => {
    // The countdown starts here so every visitor gets the full window.
    patch({ discount: DISCOUNT, offerStartedAt: Date.now() });
    router.push(`/${locale}/offer`);
  };

  if (won) {
    return (
      <Shell showBack={false}>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h2 className="headline">{dict.discount.wonHeadline}</h2>
          <p className="mt-2 text-[16px] text-ink-soft">
            {dict.discount.wonSubhead}
          </p>
          <div className="my-8 flex h-40 w-32 flex-col items-center justify-center rounded-xl2 border-4 border-gold-500 bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 shadow-card">
            <span className="text-[40px] font-black leading-none text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]">
              60%
            </span>
            <span className="mt-1 rounded-md bg-coral-500 px-2 py-0.5 text-[12px] font-bold uppercase text-white">
              {dict.discount.off}
            </span>
          </div>
        </div>
        <CtaDock>
          <Cta onClick={goToOffer}>{dict.discount.wonCta}</Cta>
        </CtaDock>
      </Shell>
    );
  }

  return (
    <Shell showBack={false}>
      <h2 className="headline mt-4 text-center text-[22px]">
        {dict.discount.headline}
      </h2>
      <p className="mt-3 text-center text-[15px] leading-relaxed text-ink-soft">
        {fill(dict.discount.subhead, { dog })}
      </p>

      <div className="my-8">
        <ScratchCard
          percent={Math.round(DISCOUNT * 100)}
          offLabel={dict.discount.off}
          hint={dict.discount.scratchHint}
          onRevealed={() => window.setTimeout(() => setWon(true), 900)}
        />
      </div>

      <CtaDock>
        <Cta disabled>{dict.discount.cta}</Cta>
      </CtaDock>
    </Shell>
  );
}
