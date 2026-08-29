"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Answers } from "./types";

const STORAGE_KEY = "dogflow:funnel";

export type FunnelState = {
  answers: Answers;
  email: string;
  optIn: boolean | null;
  discount: number | null;
  variant: string;
  /** Epoch ms when the paywall countdown started. */
  offerStartedAt: number | null;
};

const EMPTY: FunnelState = {
  answers: {},
  email: "",
  optIn: null,
  discount: null,
  variant: "",
  offerStartedAt: null,
};

type Ctx = FunnelState & {
  ready: boolean;
  setAnswer: (id: string, value: string | string[]) => void;
  patch: (next: Partial<FunnelState>) => void;
  reset: () => void;
};

const FunnelContext = createContext<Ctx | null>(null);

export function FunnelProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FunnelState>(EMPTY);
  const [ready, setReady] = useState(false);

  // Rehydrate after mount so the server and first client render agree.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as FunnelState) });
    } catch {
      /* storage can be unavailable in private mode — start fresh */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or blocked storage: the funnel still works in memory */
    }
  }, [state, ready]);

  const setAnswer = useCallback((id: string, value: string | string[]) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [id]: value } }));
  }, []);

  const patch = useCallback((next: Partial<FunnelState>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  const reset = useCallback(() => setState(EMPTY), []);

  const value = useMemo<Ctx>(
    () => ({ ...state, ready, setAnswer, patch, reset }),
    [state, ready, setAnswer, patch, reset],
  );

  return <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>;
}

export function useFunnel() {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error("useFunnel must be used inside <FunnelProvider>");
  return ctx;
}

/** Values the copy interpolates: {dog}, {breed}, {date}. */
export function useCopyVars(fallbackDog: string) {
  const { answers } = useFunnel();
  const dog = (answers.dog_name as string) || fallbackDog;
  const breed = (answers.dog_breed as string) || "";
  return { dog, breed };
}
