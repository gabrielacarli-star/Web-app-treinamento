/** Reads the first path that resolves to a non-empty string. Shared by the
 *  live Hotmart webhook and the /api/admin/backfill-purchases route, which
 *  re-derives the same fields from each purchase's stored `raw` payload. */
export const pick = (source: unknown, paths: string[][]): string | null => {
  for (const path of paths) {
    let node: unknown = source;
    for (const key of path) {
      if (node && typeof node === "object" && key in (node as object)) {
        node = (node as Record<string, unknown>)[key];
      } else {
        node = undefined;
        break;
      }
    }
    if (typeof node === "string" && node.trim()) return node.trim();
    if (typeof node === "number") return String(node);
  }
  return null;
};

/** Hotmart sends price.value as a number, but be defensive about strings too. */
export const toCents = (value: string | null): number | null => {
  if (value == null) return null;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : null;
};

export function extractHotmartAmount(payload: Record<string, unknown>) {
  const amountCents = toCents(
    pick(payload, [
      ["data", "purchase", "price", "value"],
      ["data", "purchase", "full_price", "value"],
    ]),
  );
  const currency = pick(payload, [
    ["data", "purchase", "price", "currency_value"],
    ["data", "purchase", "price", "currency_code"],
  ]);
  const trackingSrc = pick(payload, [
    ["data", "purchase", "tracking", "source"],
    ["data", "tracking", "source"],
  ]);
  return { amountCents, currency, trackingSrc };
}
