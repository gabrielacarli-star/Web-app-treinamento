"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  /** Percentage to reveal underneath. */
  percent: number;
  offLabel: string;
  hint: string;
  onRevealed: () => void;
};

/** Share of the foil that has to be scratched before it clears itself. */
const REVEAL_AT = 0.42;

export function ScratchCard({ percent, offLabel, hint, onRevealed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const revealed = useRef(false);
  const [done, setDone] = useState(false);

  const paintFoil = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: w, height: h } = canvas;

    const gold = ctx.createLinearGradient(0, 0, w, h);
    gold.addColorStop(0, "#FFE47A");
    gold.addColorStop(0.5, "#FFC419");
    gold.addColorStop(1, "#EBAA00");
    ctx.fillStyle = gold;
    ctx.fillRect(0, 0, w, h);

    // A little sheen so the surface reads as foil worth scratching.
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = Math.max(8, w * 0.04);
    for (let i = -h; i < w + h; i += Math.max(40, w * 0.18)) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    paintFoil(canvas);
  }, [paintFoil]);

  const scratchedShare = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    // Every 16th pixel is plenty to estimate coverage and keeps this cheap.
    for (let i = 3; i < data.length; i += 4 * 16) {
      if (data[i] === 0) clear += 1;
    }
    return clear / (data.length / (4 * 16));
  };

  const finish = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    setDone(true);
    onRevealed();
  }, [onRevealed]);

  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealed.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, canvas.width * 0.11, 0, Math.PI * 2);
    ctx.fill();

    if (scratchedShare(canvas) > REVEAL_AT) finish();
  };

  return (
    <div className="mx-auto w-full max-w-[260px]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl2 border-4 border-gold-500 shadow-card">
        {/* prize underneath */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-500 to-violet-700">
          <span className="text-[54px] font-black leading-none text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.18)]">
            {percent}%
          </span>
          <span className="mt-2 rounded-md bg-coral-500 px-3 py-1 text-[13px] font-bold uppercase tracking-wide text-white">
            {offLabel}
          </span>
        </div>

        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            drawing.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratch(e);
          }}
          onPointerMove={scratch}
          onPointerUp={() => (drawing.current = false)}
          onPointerLeave={() => (drawing.current = false)}
          className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-500 ${
            done ? "pointer-events-none opacity-0" : "cursor-grab active:cursor-grabbing"
          }`}
        />
      </div>

      {!done && (
        <p className="mt-4 animate-pulse-soft text-center text-[14px] font-medium text-ink-soft">
          👆 {hint}
        </p>
      )}
    </div>
  );
}
