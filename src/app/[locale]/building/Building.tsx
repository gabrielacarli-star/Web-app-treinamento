"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/Shell";
import { Cta, CtaDock } from "@/components/Cta";
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
  const [stalled, setStalled] = useState(false);
  const navigated = useRef(false);

  const tasks = dict.building.tasks;
  const totalMs = tasks.length * TASK_MS;

  useEffect(() => {
    // The interval has to stop at the end. Left running, it kept ticking past
    // completion and re-fired the navigation below every frame, each push
    // cancelling the last one, and the visitor sat on four full bars forever.
    const timer = window.setInterval(() => {
      setElapsed((value) => {
        const next = value + TICK_MS;
        if (next >= totalMs) window.clearInterval(timer);
        return Math.min(next, totalMs);
      });
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [totalMs]);

  useEffect(() => {
    if (elapsed < totalMs || navigated.current) return;
    navigated.current = true;
    router.push(`/${locale}/plan`);

    // Last resort: if the route has not taken over shortly after, offer a
    // manual way on. Nobody should be trapped one step from the offer.
    const escape = window.setTimeout(() => setStalled(true), 2500);
    return () => window.clearTimeout(escape);
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

      {stalled && (
        <CtaDock>
          <Cta onClick={() => router.push(`/${locale}/plan`)}>
            {dict.common.continue}
          </Cta>
        </CtaDock>
      )}

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
