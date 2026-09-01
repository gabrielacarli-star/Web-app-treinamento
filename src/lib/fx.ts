/**
 * Rough, display-only USD conversion for the handful of Latin American
 * currencies DogFlow's buyers actually use. Checkout always settles in USD
 * regardless of what this shows — it exists only to answer "how much is
 * that in my money?" before the buyer decides, since real customer feedback
 * (a recovery-email reply) showed that question alone kills a sale that
 * would otherwise have gone through.
 *
 * Static and approximate on purpose: good enough for a "roughly this much"
 * estimate, not a checkout-grade quote. Rates as of 2026-09-01 — revisit if
 * a currency has moved a lot since.
 */
const RATES: Record<string, { code: string; symbol: string; perUsd: number }> = {
  AR: { code: "ARS", symbol: "AR$", perUsd: 1499.51 },
  MX: { code: "MXN", symbol: "MX$", perUsd: 16.99 },
  CO: { code: "COP", symbol: "COP$", perUsd: 3211.62 },
  CL: { code: "CLP", symbol: "CLP$", perUsd: 931.65 },
  PE: { code: "PEN", symbol: "S/", perUsd: 3.37 },
  BR: { code: "BRL", symbol: "R$", perUsd: 5.19 },
};

/** Coarse thousands separator — good enough for an approximate figure, no locale library needed. */
const grouped = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * `country` is the ISO 3166-1 alpha-2 code Vercel's `x-vercel-ip-country`
 * request header reports for the visitor — read server-side (a client
 * component can't see request headers) and passed down as a prop.
 * Returns null for USD itself or any country not in the table, so callers
 * can just skip rendering rather than showing something wrong.
 */
export function estimateLocalPrice(usdAmount: number, country?: string | null) {
  if (!country) return null;
  const rate = RATES[country.toUpperCase()];
  if (!rate) return null;
  return `${rate.symbol} ${grouped(usdAmount * rate.perUsd)}`;
}
