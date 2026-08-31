import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildSetPasswordEmail } from "@/lib/email/setPassword";
import { sendEmail } from "@/lib/email/send";
import { isLocale, DEFAULT_LOCALE } from "@/lib/config";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://web-app-treinamento.vercel.app";

/**
 * "Forgot password" goes through Resend, same as the webhook's initial
 * set-password e-mail — never through Supabase's own e-mail sending, which
 * has a strict default rate limit meant for low-volume auth traffic, not a
 * user-facing "resend" button.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; locale?: string }
    | null;
  const email = body?.email?.trim();
  const rawLocale = body?.locale ?? "";
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  // Same response either way: never reveal whether an address has an account.
  if (!email) return NextResponse.json({ ok: true });

  const supabase = createAdminClient();
  const redirectTo = `${SITE_URL}/auth/callback?next=/${locale}/reset-password`;

  const { data: link, error: linkError } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (linkError || !link?.properties?.action_link) {
    if (linkError && linkError.message !== "User not found") {
      console.error("forgot-password: could not generate link for", email, linkError.message);
    }
    return NextResponse.json({ ok: true });
  }

  const { subject, html } = buildSetPasswordEmail({
    locale,
    actionLink: link.properties.action_link,
  });
  const result = await sendEmail({ to: email, subject, html });
  if (!result.ok) {
    console.error("forgot-password: send failed for", email, result.error ?? result.skipped);
  }

  return NextResponse.json({ ok: true });
}
