"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Cta, CtaDock } from "@/components/Cta";
import { createClient } from "@/lib/supabase/client";
import type { Dict } from "@/content";
import type { Locale } from "@/lib/types";

export function ResetPasswordForm({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [fieldError, setFieldError] = useState("");

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
