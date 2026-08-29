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
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <div className="h-1 w-full overflow-hidden rounded-pill bg-line">
              <div
                className="h-full rounded-pill bg-violet-400 transition-[width] duration-300"
                style={{ width: `${Math.min(100, Math.max(4, progress * 100))}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <main className="funnel-body">{children}</main>
    </div>
  );
}
