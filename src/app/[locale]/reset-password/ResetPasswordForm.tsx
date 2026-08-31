"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { Cta, CtaDock } from "@/components/Cta";
import { createClient } from "@/lib/supabase/client";
import type { Dict } from "@/content";
import type { Locale } from "@/lib/types";

export function ResetPasswordForm({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const [session, setSession] = useState<"checking" | "ready" | "expired">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    const supabase = createClient();

    // The invite/recovery link redirects here with its session in the URL's
    // hash fragment (#access_token=...), which supabase-js parses
    // automatically on load (detectSessionInUrl) — that's async, so both an
    // immediate check and the auth-state event below can be the one that
    // actually finds it.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSession("ready");
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, current) => {
      if (current) setSession("ready");
    });

    // A stale/reused link never fires an auth event — give detection a
    // moment before concluding there is nothing to find.
    const timeout = window.setTimeout(() => {
      setSession((current) => (current === "checking" ? "expired" : current));
    }, 2500);

    return () => {
      subscription.subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setFieldError(dict.resetPassword.tooShort);
      return;
    }
    if (password !== confirm) {
      setFieldError(dict.resetPassword.mismatch);
      return;
    }
    setFieldError("");
    setState("saving");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setState("error");
      return;
    }
    router.push(`/${locale}/app`);
    router.refresh();
  };

  if (session !== "ready") {
    return (
      <div className="funnel-shell">
        <header className="flex h-14 items-center justify-center">
          <Logo />
        </header>
        {session === "expired" && (
          <main className="flex flex-1 flex-col px-5 pb-10">
            <div className="mt-14 flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-coral-100 text-[28px]">
                ⏱️
              </span>
              <h1 className="headline mt-5 text-[22px]">
                {dict.resetPassword.expiredHeadline}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {dict.resetPassword.expiredBody}
              </p>
            </div>
            <div className="mt-auto pt-10">
              <a href={`/${locale}/login`} className="cta">
                {dict.resetPassword.expiredCta}
              </a>
            </div>
          </main>
        )}
      </div>
    );
  }

  return (
    <div className="funnel-shell">
      <header className="flex h-14 items-center justify-center">
        <Logo />
      </header>

      <main className="flex flex-1 flex-col px-5 pb-8">
        <form className="flex flex-1 flex-col" onSubmit={submit}>
          <h1 className="headline mt-6 text-center text-[24px]">
            {dict.resetPassword.headline}
          </h1>
          <p className="mt-3 text-center text-[15px] leading-relaxed text-ink-soft">
            {dict.resetPassword.subhead}
          </p>

          <label
            htmlFor="new-password"
            className="mb-1.5 mt-8 block text-[13px] font-medium text-ink-soft"
          >
            {dict.resetPassword.label}
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldError("");
              if (state === "error") setState("idle");
            }}
            placeholder={dict.resetPassword.placeholder}
            className="w-full rounded-xl2 border border-line bg-surface px-4 py-4 text-[16px] text-ink outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          />

          <label
            htmlFor="confirm-password"
            className="mb-1.5 mt-4 block text-[13px] font-medium text-ink-soft"
          >
            {dict.resetPassword.confirmLabel}
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setFieldError("");
              if (state === "error") setState("idle");
            }}
            className="w-full rounded-xl2 border border-line bg-surface px-4 py-4 text-[16px] text-ink outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          />

          {fieldError && (
            <p className="mt-2 text-[13px] text-coral-600">{fieldError}</p>
          )}
          {state === "error" && (
            <p className="mt-2 text-[13px] text-coral-600">{dict.resetPassword.error}</p>
          )}

          <CtaDock>
            <Cta type="submit" disabled={state === "saving"}>
              {state === "saving" ? dict.resetPassword.saving : dict.resetPassword.cta}
            </Cta>
          </CtaDock>
        </form>
      </main>
    </div>
  );
}
