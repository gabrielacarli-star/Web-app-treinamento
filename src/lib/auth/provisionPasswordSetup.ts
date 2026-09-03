import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL, isLocale } from "@/lib/config";
import { buildSetPasswordEmail } from "@/lib/email/setPassword";
import { sendEmail } from "@/lib/email/send";
import type { Locale } from "@/lib/types";

/**
 * A fresh buyer has no Supabase Auth account yet — this creates one (or, on
 * a repurchase, reuses the existing one) and e-mails a link to set the
 * password they'll sign in with from then on. Best-effort: a failure here
 * never fails the caller's webhook, since the purchase itself is already
 * recorded by the time this runs.
 *
 * Shared by every checkout provider's webhook (Hotmart, Stripe, ...) — the
 * account-provisioning step is the same regardless of who processed the
 * payment.
 */
export async function provisionPasswordSetup(
  supabase: ReturnType<typeof createAdminClient>,
  email: string,
  source: string,
) {
  const { data: lead } = await supabase
    .from("quiz_leads")
    .select("locale")
    .eq("email", email.toLowerCase())
    .order("last_seen_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const locale: Locale = isLocale(lead?.locale ?? "") ? (lead!.locale as Locale) : "es";

  const redirectTo = `${SITE_URL}/${locale}/reset-password`;

  let { data: link, error: linkError } = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: { redirectTo },
  });
  if (linkError) {
    // Already registered from an earlier purchase — send a recovery link instead.
    ({ data: link, error: linkError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    }));
  }
  if (linkError || !link?.properties?.hashed_token) {
    console.error(
      `${source}: could not generate password-setup link for`,
      email,
      linkError?.message,
    );
    return;
  }

  // Built around token_hash/type rather than the link's own action_link: see
  // the comment on /auth/confirm for why.
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
    console.error(
      `${source}: could not send set-password email to`,
      email,
      result.error ?? result.skipped,
    );
  }
}
