"use client";

import { useRouter } from "next/navigation";
import { Logo } from "./Logo";

type Props = {
  children: React.ReactNode;
  /** 0–1; omit to hide the progress track. */
  progress?: number;
  onBack?: () => void;
  showBack?: boolean;
  eyebrow?: string;
};

export function Shell({
  children,
  progress,
  onBack,
  showBack = true,
  eyebrow,
}: Props) {
  const router = useRouter();

  return (
    <div className="funnel-shell">
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur">
        <div className="relative flex h-14 items-center justify-center px-3">
          {showBack && (
            <button
              type="button"
              onClick={() => (onBack ? onBack() : router.back())}
              aria-label="Back"
              className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition hover:bg-cream"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
                <path
                  d="M12 4l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <Logo />
        </div>

        {progress !== undefined && (
          <div className="px-5 pb-3">
            {eyebrow && (
              <p className="mb-2 text-center">
                <span className="inline-block rounded-pill bg-violet-600 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_3px_10px_rgba(124,45,255,0.35)]">
                  {eyebrow}
                </span>
              </p>
            )}
            <div className="h-2.5 w-full overflow-hidden rounded-pill bg-line">
              <div
                className="h-full rounded-pill bg-gradient-to-r from-violet-600 via-pink-500 to-coral-500 shadow-[0_0_12px_rgba(255,45,135,0.45)] transition-[width] duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(5, progress * 100))}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <main className="funnel-body">{children}</main>
    </div>
  );
}
