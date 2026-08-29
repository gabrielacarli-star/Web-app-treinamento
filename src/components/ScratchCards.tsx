"use client";

import { useState } from "react";

type Props = {
  offLabel: string;
  onReveal: (value: number) => void;
};

const CARDS = [10, 20, 30, 60];

/**
 * Four welcome-discount cards. Whichever one the visitor picks reveals the
 * 60% prize — the choice is what makes the discount feel earned.
 */
export function ScratchCards({ offLabel, onReveal }: Props) {
  const [flipped, setFlipped] = useState<number | null>(null);

  const pick = (index: number) => {
    if (flipped !== null) return;
    setFlipped(index);
    window.setTimeout(() => onReveal(60), 900);
  };

  return (
    <div className="mx-auto grid max-w-[280px] grid-cols-2 gap-3">
      {CARDS.map((value, index) => {
        const isFlipped = flipped === index;
        const dimmed = flipped !== null && !isFlipped;

        return (
          <button
            key={value}
            type="button"
            onClick={() => pick(index)}
            disabled={flipped !== null}
            className={`relative aspect-[3/4] overflow-hidden rounded-xl2 border-4 border-gold-500 bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 shadow-card transition duration-300 ${
              dimmed ? "scale-95 opacity-40" : ""
            } ${isFlipped ? "scale-105 ring-4 ring-violet-400" : "hover:scale-[1.03]"}`}
          >
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[30px] font-black leading-none text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]">
                {isFlipped ? 60 : value}%
              </span>
              <span className="mt-1 rounded-md bg-coral-500 px-2 py-0.5 text-[11px] font-bold uppercase text-white">
                {offLabel}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
