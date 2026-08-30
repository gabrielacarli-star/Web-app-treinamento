"use client";

import { useRouter } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Cta, CtaDock } from "@/components/Cta";
import { Art } from "@/components/Art";
import { fill, type Dict } from "@/content";
import { useFunnel } from "@/lib/store";
import type { Locale } from "@/lib/types";

export function PlanReady({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const { answers } = useFunnel();

  const dog = (answers.dog_name as string) || dict.common.yourDog;
  const breed = (answers.dog_breed as string) || "—";
  const age = answers.dog_age
    ? dict.steps.dog_age.options?.[answers.dog_age as string]
    : "—";

  return (
    <Shell showBack={false}>
      <h2 className="headline mt-4 text-center">
        {fill(dict.planReady.headline, { dog })}
      </h2>

      <div className="mt-6">
        <Art id="plan-ready" />
      </div>

      <section className="mt-6 rounded-xl2 border border-line bg-surface p-4 shadow-card">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">
          {dict.planReady.profile}
        </h3>
        <dl className="mt-3 space-y-2 text-[14px]">
          {[
            [dict.planReady.labels.name, dog],
            [dict.planReady.labels.breed, breed],
            [dict.planReady.labels.age, age ?? "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-ink-soft">{label}</dt>
              <dd className="text-right font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaDock>
        <Cta onClick={() => router.push(`/${locale}/email`)}>
          {dict.planReady.cta}
        </Cta>
      </CtaDock>
    </Shell>
  );
}
