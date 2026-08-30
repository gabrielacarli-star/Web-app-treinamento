import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildRecoveryEmail } from "@/lib/email/recovery";
import { isLocale } from "@/lib/config";
import { BRAND } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Leads older than this with no purchase get the recovery email. */
const ABANDON_AFTER_MINUTES = 60;
/** Safety cap per run, in case a backlog piles up between fires. */
const BATCH_SIZE = 50;

/**
 * Fired on a schedule (Vercel Cron, or an external pinger — see README) to
 * email anyone who left their address in the quiz but never bought. Never
 * emails someone twice: `recovery_email_sent_at` is stamped as each send
 * succeeds, and the query only ever selects rows where it is still null.
 *
 * GET because that is what Vercel Cron sends; POST works too, for an
 * external pinger or a manual trigger.
 */
async function handle(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ ok: true, skipped: "RESEND_API_KEY not set" });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ ok: true, skipped: "supabase not configured" });
  }

  const cutoff = new Date(Date.now() - ABANDON_AFTER_MINUTES * 60_000).toISOString();

  const { data: leads, error } = await supabase
    .from("quiz_leads")
    .select("session_id, locale, email, dog_name")
    .not("email", "is", null)
    .is("recovery_email_sent_at", null)
    .lte("last_seen_at", cutoff)
    // Oldest first, so a backlog past BATCH_SIZE drains the longest-waiting
    // leads first instead of an arbitrary DB-order slice.
    .order("last_seen_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) {
    console.error("recover-leads: fetch failed:", error.message);
    return NextResponse.json({ error: "could not read leads" }, { status: 500 });
  }
  if (!leads?.length) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  // Never email an address that already bought — a separate table, joined
  // in code rather than a DB view so this stays a self-contained cron.
  const emails = leads.map((l) => l.email!.toLowerCase());
  const { data: buyers } = await supabase
    .from("purchases")
    .select("email")
    .eq("status", "active")
    .in("email", emails);
  const boughtSet = new Set((buyers ?? []).map((b) => b.email.toLowerCase()));

  let sent = 0;
  const fromAddress =
    process.env.RESEND_FROM_EMAIL || `${BRAND.name} <onboarding@resend.dev>`;
  // The from address needs a domain verified in Resend for deliverability,
  // which is rarely a real inbox anyone checks — replies go here instead.
  const replyTo = process.env.RESEND_REPLY_TO || "eduardosnl1997@gmail.com";

  for (const lead of leads) {
    const email = lead.email!;
    if (boughtSet.has(email.toLowerCase())) continue;

    const locale = isLocale(lead.locale ?? "") ? lead.locale! : "es";
    const { subject, html } = buildRecoveryEmail({
      locale,
      email,
      dogName: lead.dog_name,
    });

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: email,
          subject,
          html,
          reply_to: replyTo,
        }),
      });
      if (!res.ok) {
        console.error("recover-leads: resend failed for", email, await res.text());
        continue;
      }
    } catch (err) {
      console.error("recover-leads: send threw for", email, err);
      continue;
    }

    await supabase
      .from("quiz_leads")
      .update({ recovery_email_sent_at: new Date().toISOString() })
      .eq("session_id", lead.session_id);
    sent += 1;
  }

  return NextResponse.json({ ok: true, sent, candidates: leads.length });
}

export const GET = handle;
export const POST = handle;
