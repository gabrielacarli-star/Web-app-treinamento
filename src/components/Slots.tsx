/**
 * Reserved space for creative that is not produced yet. Every slot keeps its
 * aspect ratio so dropping the real asset in later does not move the layout.
 */

type SlotProps = {
  label: string;
  hint?: string;
  /** CSS aspect ratio, e.g. "16 / 9". */
  ratio?: string;
  id?: string;
};

export function VideoSlot({ label, hint, ratio = "16 / 9", id }: SlotProps) {
  return (
    <div
      data-slot={id}
      style={{ aspectRatio: ratio }}
      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl2 bg-sun/70 px-4 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-400 shadow-pop">
        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="#fff" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      </span>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {hint && <span className="text-[11px] text-ink-soft">{hint}</span>}
      {id && (
        <span className="rounded-pill bg-ink/10 px-2 py-0.5 font-mono text-[10px] text-ink-soft">
          {id}
        </span>
      )}
    </div>
  );
}

export function ImageSlot({ label, ratio = "4 / 3", id }: SlotProps) {
  return (
    <div
      data-slot={id}
      style={{ aspectRatio: ratio }}
      className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl2 border border-dashed border-violet-300 bg-violet-50 px-4 text-center"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-violet-300" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
        <path d="M4 17l4.5-4.5 3 3L15 12l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[12px] font-medium text-ink-soft">{label}</span>
      {id && (
        <span className="rounded-pill bg-violet-100 px-2 py-0.5 font-mono text-[10px] text-violet-600">
          {id}
        </span>
      )}
    </div>
  );
}
