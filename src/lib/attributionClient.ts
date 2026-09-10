"use client";

import { ATTRIBUTION_FIELDS, type Attribution } from "./attribution";

const KEY = "dogflow:attribution";

/**
 * Reads utm_ and click-id params from a URL's querystring and remembers
 * them for the rest of the run (survives navigating from the landing page,
 * through the quiz, to the offer page, where they get attached to the
 * checkout link). Last-touch, same as `variant` in useFunnel: a landing
 * hit always overwrites whatever was captured on a previous visit.
 */
export function captureAttribution(search: string): Attribution {
  try {
    const params = new URLSearchParams(search);
    const found: Attribution = {};
    let hasAny = false;
    for (const f of ATTRIBUTION_FIELDS) {
      const v = params.get(f);
      if (v) {
        found[f] = v;
        hasAny = true;
      }
    }
    if (hasAny) {
      window.localStorage.setItem(KEY, JSON.stringify(found));
      return found;
    }
  } catch {
    // Storage unavailable (private mode): fall through to whatever is stored.
  }
  return getAttribution();
}

export function getAttribution(): Attribution {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
