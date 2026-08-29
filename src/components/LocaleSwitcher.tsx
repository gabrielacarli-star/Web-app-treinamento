"use client";

import { usePathname, useRouter } from "next/navigation";
import { DICTS } from "@/content";
import { LOCALES } from "@/lib/config";
import type { Locale } from "@/lib/types";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (locale: Locale) => {
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${locale}${rest ? `/${rest}` : ""}`);
  };

  return (
    <div className="flex justify-center gap-1 pb-4 pt-2">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          className={`rounded-pill px-3 py-1 text-[12px] font-medium transition ${
            locale === current
              ? "bg-violet-100 text-violet-700"
              : "text-ink-faint hover:text-ink-soft"
          }`}
        >
          {DICTS[locale].name}
        </button>
      ))}
    </div>
  );
}
