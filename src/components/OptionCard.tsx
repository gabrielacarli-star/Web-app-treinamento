"use client";

/* Full-strength accents. Pastel tiles were what made the list read washed
   out, however saturated the button itself was. */
const TONES = [
  "bg-violet-500",
  "bg-coral-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-gold-500",
  "bg-sky-500",
];

type Props = {
  label: string;
  selected?: boolean;
  onClick: () => void;
  /** Multi-select steps show a checkbox, single-select steps show nothing. */
  multi?: boolean;
  emoji?: string;
  /** Position in the list; picks the emoji tile colour. */
  tone?: number;
};

export function OptionCard({
  label,
  selected,
  onClick,
  multi,
  emoji,
  tone = 0,
}: Props) {
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
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
            selected ? "border-white bg-white" : "border-line bg-surface"
          }`}
        >
          {selected && (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path
                d="M3.5 8.5l3 3 6-6.5"
                stroke={selected ? "#7C2DFF" : "#fff"}
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
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[20px] leading-none transition ${
            selected ? "bg-white/30" : TONES[tone % TONES.length]
          }`}
        >
          {emoji}
        </span>
      )}
      <span className="flex-1">{label}</span>
    </button>
  );
}
