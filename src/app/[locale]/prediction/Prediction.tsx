"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Shell } from "@/components/Shell";
import { Cta, CtaDock } from "@/components/Cta";
import { PredictionChart } from "@/components/PredictionChart";
import { fill, type Dict } from "@/content";
import { useFunnel } from "@/lib/store";
import type { Locale } from "@/lib/types";

/** Training horizon promised on the chart. */
const HORIZON_DAYS = 21;

export function Prediction({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const { answers } = useFunnel();

  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + HORIZON_DAYS);
    return new Intl.DateTimeFormat(dict.htmlLang, {
      day: "numeric",
      month: "long",
    }).format(date);
  }, [dict.htmlLang]);

  const vars = {
    dog: (answers.dog_name as string) || dict.common.yourDog,
    breed: (answers.dog_breed as string) || "",
    date: targetDate,
  };

  return (
    <Shell onBack={() => router.push(`/${locale}/quiz`)}>
      <p className="eyebrow mt-2">{dict.prediction.eyebrow}</p>

      <h2 className="headline mt-3 text-center">
        {fill(dict.prediction.headlinePre, vars)}{" "}
        <span className="text-violet-600">
          {fill(dict.prediction.headlineHighlight, vars)}
        </span>{" "}
        {fill(dict.prediction.headlinePost, vars)}
      </h2>

      <div className="mt-6">
        <PredictionChart
          nowLabel={dict.prediction.now}
          nowItems={dict.prediction.nowItems}
          goalLabel={dict.prediction.goal}
          goalItems={dict.prediction.goalItems}
        />
      </div>

      <CtaDock>
        <Cta onClick={() => router.push(`/${locale}/building`)}>
          {dict.common.continue}
        </Cta>
      </CtaDock>
    </Shell>
  );
}
