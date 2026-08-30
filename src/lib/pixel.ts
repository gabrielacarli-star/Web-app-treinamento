/**
 * Meta Pixel helpers. Every call is a no-op when the pixel is not configured
 * or has not loaded yet, so tracking can never break the funnel.
 */

/* Public by nature: the id is visible in the page source of any site running
   a pixel. Defaulted so tracking does not silently sit dark waiting on a
   variable; an environment variable still overrides it. */
export const PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "2290940038399261";

type Fbq = (...args: unknown[]) => void;

const fbq = (): Fbq | null => {
  if (typeof window === "undefined") return null;
  const fn = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof fn === "function" ? fn : null;
};

export const track = (event: string, params?: Record<string, unknown>) => {
  fbq()?.("track", event, params);
};

export const trackCustom = (event: string, params?: Record<string, unknown>) => {
  fbq()?.("trackCustom", event, params);
};

/**
 * Fires an event at most once per browser session, keyed by `key`.
 * Purchase is the reason this exists: the thank-you page is reloaded and
 * re-shared often, and each reload would otherwise count as another sale.
 */
export const trackOnce = (
  key: string,
  event: string,
  params?: Record<string, unknown>,
) => {
  try {
    const storageKey = `dogflow:fb:${key}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Private mode blocks storage; better to risk a duplicate than to lose
    // the event entirely.
  }
  track(event, params);
};
