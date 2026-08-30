"use client";

type Props = {
  label: string;
  selected?: boolean;
  onClick: () => void;
  /** Multi-select steps show a checkbox, single-select steps show nothing. */
  multi?: boolean;
  emoji?: string;
};

export function OptionCard({ label, selected, onClick, multi, emoji }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`option-card ${selected ? "option-card-selected" : ""}`}
    >
      {multi && (
        <span
          aria-hidden="true"
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
            selected ? "border-violet-500 bg-violet-500" : "border-line bg-surface"
          }`}
        >
          {selected && (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path
                d="M3.5 8.5l3 3 6-6.5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      )}
      {emoji && (
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[19px] leading-none transition ${
            selected ? "bg-violet-500/15" : "bg-cream"
          }`}
        >
          {emoji}
        </span>
      )}
      <span className="flex-1">{label}</span>
    </button>
  );
}
