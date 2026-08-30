"use client";

const SESSION_KEY = "dogflow:session";

/**
 * Stable id for this visitor, independent of the funnel answers in
 * localStorage — it survives `reset()` on a fresh landing hit, so a lead's
 * trail is not wiped out just because they restarted the quiz.
 */
export function getSessionId(): string {
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Storage unavailable (private mode): a per-call id still lets this beacon
    // land, it just won't be joined to the visitor's other steps.
    return crypto.randomUUID();
  }
}

export type TrackProgress = {
  locale?: string;
  variant?: string;
  lastStep?: string;
  stepCount?: number;
  email?: string;
  dogName?: string;
  dogBreed?: string;
  answers?: Record<string, unknown>;
};

/**
 * Fire-and-forget funnel progress beacon. Uses sendBeacon when the caller is
 * navigating away (survives the page unload), otherwise a plain fetch.
 * Never throws: a lost beacon should never interrupt the funnel.
 */
export function trackProgress(progress: TrackProgress) {
  try {
    const payload = JSON.stringify({ sessionId: getSessionId(), ...progress });
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon("/api/track", blob)) return;
    }
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Swallow: telemetry must never break the funnel it is watching.
  }
}
