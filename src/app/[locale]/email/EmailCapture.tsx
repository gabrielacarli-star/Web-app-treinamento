"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Cta, CtaDock } from "@/components/Cta";
import { OptionCard } from "@/components/OptionCard";
import { fill, type Dict } from "@/content";
import { LEAD_WEBHOOK } from "@/lib/config";
import { useFunnel } from "@/lib/store";
import { track } from "@/lib/pixel";
import type { Locale } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function EmailCapture({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const { answers, patch, variant } = useFunnel();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [stage, setStage] = useState<"email" | "optin">("email");

  const dog = (answers.dog_name as string) || dict.common.yourDog;

  const submitEmail = () => {
    if (!EMAIL_RE.test(value.trim())) {
      setError(true);
      return;
    }
    patch({ email: value.trim() });
    track("Lead", { content_name: "quiz-email", variant });
    setStage("optin");
  };

  const finish = (optIn: boolean) => {
    patch({ optIn });

    // Fire-and-forget: a failed webhook must never block the funnel.
    if (LEAD_WEBHOOK) {
      void fetch(LEAD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value.trim(),
          optIn,
          locale,
          variant,
          answers,
        }),
        keepalive: true,
      }).catch(() => undefined);
    }

    router.push(`/${locale}/discount`);
  };

  if (stage === "optin") {
    return (
      <Shell showBack={false}>
        <h2 className="headline mt-6 text-center text-[22px]">
          {dict.optin.headline}
        </h2>
        <div className="mt-6 space-y-2.5">
          <OptionCard label={dict.optin.yes} onClick={() => finish(true)} />
          <OptionCard label={dict.optin.no} onClick={() => finish(false)} />
        </div>
      </Shell>
    );
  }

  return (
    <Shell onBack={() => router.push(`/${locale}/plan`)}>
      <h2 className="headline mt-4 text-center text-[22px]">
        {fill(dict.email.headline, { dog })}
      </h2>
      <p className="mt-3 text-center text-[15px] leading-relaxed text-ink-soft">
        {dict.email.subhead}
      </p>

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          submitEmail();
        }}
      >
        <label
          htmlFor="email"
          className="mb-1.5 block text-[13px] font-medium text-ink-soft"
        >
          {dict.email.label}
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(false);
          }}
          placeholder={dict.email.placeholder}
          className={`w-full rounded-xl2 border bg-surface px-4 py-4 text-[16px] text-ink outline-none transition focus:ring-1 ${
            error
              ? "border-coral-500 focus:border-coral-500 focus:ring-coral-500"
              : "border-line focus:border-violet-400 focus:ring-violet-400"
          }`}
        />
        {error && (
          <p className="mt-2 text-[13px] text-coral-600">{dict.email.invalid}</p>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          {dict.email.privacy}
        </p>

        <CtaDock>
          <Cta type="submit">{dict.email.cta}</Cta>
        </CtaDock>
      </form>
    </Shell>
  );
}
