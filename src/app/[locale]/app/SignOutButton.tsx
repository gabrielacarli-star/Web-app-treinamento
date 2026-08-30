"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/types";

export function SignOutButton({
  label,
  locale,
}: {
  label: string;
  locale: Locale;
}) {
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  };

  return (
    <button type="button" onClick={signOut} className="cta-ghost">
      {label}
    </button>
  );
}
