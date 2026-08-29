type Props = {
  nowLabel: string;
  nowItems: string[];
  goalLabel: string;
  goalItems: string[];
};

/**
 * The "today → goal" curve. Purely decorative: the shape is fixed, only the
 * callout copy changes with the visitor's answers.
 */
export function PredictionChart({ nowLabel, nowItems, goalLabel, goalItems }: Props) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl2 bg-cream p-4">
      <svg viewBox="0 0 320 200" className="w-full" role="img" aria-label={`${nowLabel} → ${goalLabel}`}>
        <defs>
          <linearGradient id="curve" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#F2C14E" />
            <stop offset="55%" stopColor="#C7D06A" />
            <stop offset="100%" stopColor="#4FBFAE" />
          </linearGradient>
        </defs>

        {[40, 80, 120, 160].map((y) => (
          <line
            key={y}
            x1="12"
            y1={y}
            x2="308"
            y2={y}
            stroke="#E9E4DB"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}

        <path
          d="M24 174 C 90 172, 120 150, 160 110 S 232 48, 296 40"
          fill="none"
          stroke="url(#curve)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="24" cy="174" r="7" fill="#fff" stroke="#F2C14E" strokeWidth="4" />
        <circle cx="296" cy="40" r="7" fill="#fff" stroke="#4FBFAE" strokeWidth="4" />
      </svg>

      <div className="absolute left-4 top-[52%] max-w-[52%] rounded-xl bg-coral-500 px-3 py-2 text-white shadow-card">
        <p className="text-[11px] font-bold uppercase tracking-wide">{nowLabel}</p>
        <ul className="mt-0.5 space-y-0.5">
          {nowItems.map((item) => (
            <li key={item} className="text-[11px] leading-snug opacity-95">
              · {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute right-4 top-4 max-w-[52%] rounded-xl bg-teal-500 px-3 py-2 text-white shadow-card">
        <p className="text-[11px] font-bold uppercase tracking-wide">🏆 {goalLabel}</p>
        <ul className="mt-0.5 space-y-0.5">
          {goalItems.map((item) => (
            <li key={item} className="text-[11px] leading-snug opacity-95">
              · {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
