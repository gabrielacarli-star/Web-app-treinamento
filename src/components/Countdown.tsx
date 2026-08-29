"use client";

import { useEffect, useState } from "react";

/** Counts down from `minutes` after `startedAt`; reports when it hits zero. */
export function useCountdown(startedAt: number | null, minutes: number) {
  const total = minutes * 60_000;
  const [remaining, setRemaining] = useState(total);

  useEffect(() => {
    if (!startedAt) return;
    const tick = () =>
      setRemaining(Math.max(0, startedAt + total - Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [startedAt, total]);

  const seconds = Math.floor(remaining / 1000);
  return {
    expired: startedAt !== null && remaining <= 0,
    label: `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60,
    ).padStart(2, "0")}`,
  };
}

export function TimerBar({ text, value }: { text: string; value: string }) {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-center gap-3 bg-coral-500 px-4 py-2.5 text-white">
      <span className="text-[13px] font-semibold">{text}</span>
      <span className="rounded-md bg-white/20 px-2 py-0.5 font-mono text-[15px] font-bold tabular-nums">
        {value}
      </span>
    </div>
  );
}
