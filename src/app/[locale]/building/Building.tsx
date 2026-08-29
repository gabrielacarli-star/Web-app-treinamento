"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { fill, type Dict } from "@/content";
import { useFunnel } from "@/lib/store";
import type { Locale } from "@/lib/types";

/** Each task fills in sequence; the whole screen lasts ~8s. */
const TASK_MS = 2000;
const TICK_MS = 40;

export function Building({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const { answers } = useFunnel();
  const [elapsed, setElapsed] = useState(0);

  const tasks = dict.building.tasks;
  const totalMs = tasks.length * TASK_MS;

  useEffect(() => {
    const timer = window.setInterval(
      () => setElapsed((value) => value + TICK_MS),
      TICK_MS,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (elapsed >= totalMs) router.push(`/${locale}/plan`);
  }, [elapsed, totalMs, router, locale]);

  const vars = {
    dog: (answers.dog_name as string) || dict.common.yourDog,
    breed: (answers.dog_breed as string) || dict.breeds.list[0],
  };

  return (
    <Shell showBack={false}>
      <h2 className="headline mt-4 text-center text-[22px]">
        {fill(dict.building.headline, vars)}
      </h2>

      <ul className="mt-8 space-y-6">
        {tasks.map((task, index) => {
          const start = index * TASK_MS;
          const pct = Math.min(
            100,
            Math.max(0, ((elapsed - start) / TASK_MS) * 100),
          );

          return (
            <li key={task}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="text-[14px] font-medium leading-snug text-ink">
                  {fill(task, vars)}
                </span>
                <span className="shrink-0 text-[13px] font-semibold tabular-nums text-ink-soft">
                  {Math.round(pct)}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-pill bg-line">
                <div
                  className="h-full rounded-pill bg-violet-400 transition-[width] duration-100"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <figure className="mt-10 rounded-xl2 bg-cream p-4">
        <figcaption className="text-[13px] font-semibold text-violet-600">
          {dict.building.testimonial.handle}
        </figcaption>
        <p className="mt-1 text-[15px] font-bold text-ink">
          {dict.building.testimonial.title}
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
          {dict.building.testimonial.body}
        </p>
      </figure>
    </Shell>
  );
}
