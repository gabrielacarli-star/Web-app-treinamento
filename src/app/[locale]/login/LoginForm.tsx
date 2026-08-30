"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Cta, CtaDock } from "@/components/Cta";
import { createClient } from "@/lib/supabase/client";
import type { Dict } from "@/content";
import type { Locale } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LoginForm({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [invalid, setInvalid] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setInvalid(true);
      return;
    }

    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/${locale}/app`,
      },
    });
    setState(error ? "error" : "sent");
  };

  return (
    <div className="funnel-shell">
      <header className="flex h-14 items-center justify-center">
        <Logo />
      </header>

      <main className="flex flex-1 flex-col px-5 pb-8">
        {state === "sent" ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-[28px]">
              ✉️
            </span>
            <h1 className="headline mt-5">{dict.login.sentHeadline}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {dict.login.sentBody}
            </p>
            <p className="mt-4 rounded-pill bg-violet-100 px-4 py-1.5 text-[13px] font-medium text-violet-700">
              {email.trim()}
            </p>
          </div>
        ) : (
          <form className="flex flex-1 flex-col" onSubmit={submit}>
            <h1 className="headline mt-6 text-center text-[24px]">
              {dict.login.headline}
            </h1>
            <p className="mt-3 text-center text-[15px] leading-relaxed text-ink-soft">
              {dict.login.subhead}
            </p>

            <label
              htmlFor="login-email"
              className="mb-1.5 mt-8 block text-[13px] font-medium text-ink-soft"
            >
              {dict.login.label}
            </label>
            <input
              id="login-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setInvalid(false);
                if (state === "error") setState("idle");
              }}
              placeholder={dict.login.placeholder}
              className={`w-full rounded-xl2 border bg-surface px-4 py-4 text-[16px] text-ink outline-none transition focus:ring-1 ${
                invalid
                  ? "border-coral-500 focus:border-coral-500 focus:ring-coral-500"
                  : "border-line focus:border-violet-400 focus:ring-violet-400"
              }`}
            />
            {invalid && (
              <p className="mt-2 text-[13px] text-coral-600">{dict.login.invalid}</p>
            )}
            {state === "error" && (
              <p className="mt-2 text-[13px] text-coral-600">{dict.login.failed}</p>
            )}

            <CtaDock>
              <Cta type="submit" disabled={state === "sending"}>
                {state === "sending" ? dict.login.sending : dict.login.cta}
              </Cta>
            </CtaDock>
          </form>
        )}
      </main>
    </div>
  );
}
