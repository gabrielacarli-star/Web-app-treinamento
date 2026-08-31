import { BRAND } from "@/lib/config";

/** Thin wrapper around the Resend API, shared by every transactional email this app sends. */
export async function sendEmail({
  to,
  subject,
  html,
  from,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; skipped?: string; error?: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return { ok: false, skipped: "RESEND_API_KEY not set" };

  const fromAddress =
    from || process.env.RESEND_FROM_EMAIL || `${BRAND.name} <onboarding@resend.dev>`;
  const replyToAddress = replyTo || process.env.RESEND_REPLY_TO || "eduardosnl1997@gmail.com";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: fromAddress, to, subject, html, reply_to: replyToAddress }),
    });
    if (!res.ok) return { ok: false, error: await res.text() };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
