import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildSetPasswordEmail } from "@/lib/email/setPassword";
import { sendEmail } from "@/lib/email/send";
import { isLocale, DEFAULT_LOCALE, SITE_URL } from "@/lib/config";

export const runtime = "nodejs";

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
  const redirectTo = `${SITE_URL}/${locale}/reset-password`;

  const { data: link, error: linkError } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (linkError || !link?.properties?.hashed_token) {
    if (linkError && linkError.message !== "User not found") {
      console.error("forgot-password: could not generate link for", email, linkError.message);
    }
    return NextResponse.json({ ok: true });
  }

  // Built around token_hash/type rather than the link's own action_link —
  // see the comment on /auth/confirm for why.
  const confirmUrl = new URL("/auth/confirm", SITE_URL);
  confirmUrl.searchParams.set("token_hash", link.properties.hashed_token);
  confirmUrl.searchParams.set("type", link.properties.verification_type);
  confirmUrl.searchParams.set("next", `/${locale}/reset-password`);

  const { subject, html } = buildSetPasswordEmail({
    locale,
    actionLink: confirmUrl.toString(),
  });
  const result = await sendEmail({ to: email, subject, html });
  if (!result.ok) {
    console.error("forgot-password: send failed for", email, result.error ?? result.skipped);
  }

  return NextResponse.json({ ok: true });
}
