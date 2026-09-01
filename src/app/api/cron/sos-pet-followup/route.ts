import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildSosPetFollowupEmail } from "@/lib/email/sosPetFollowup";
import { sendEmail } from "@/lib/email/send";
import { isLocale } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** How long after the DogFlow recovery email to wait before this fires. */
const FOLLOWUP_AFTER_DAYS = 2;
/** Safety cap per run, in case a backlog piles up between fires. */
const BATCH_SIZE = 50;

/**
 * Fired on a schedule (Vercel Cron) to offer SOS Pet to a DogFlow lead who
 * already got the DogFlow recovery email, waited FOLLOWUP_AFTER_DAYS, and
 * still never bought — a different pitch instead of repeating the same
 * DogFlow discount a second time. Never fires for someone who never got
 * the DogFlow recovery email in the first place (recovery_email_sent_at
 * gates this), and never twice (sos_pet_email_sent_at gates it too).
 */
async function handle(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true, skipped: "RESEND_API_KEY not set" });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ ok: true, skipped: "supabase not configured" });
  }

  const cutoff = new Date(Date.now() - FOLLOWUP_AFTER_DAYS * 86_400_000).toISOString();

  const { data: leads, error } = await supabase
    .from("quiz_leads")
    .select("session_id, locale, email, dog_name")
    .not("email", "is", null)
    .not("recovery_email_sent_at", "is", null)
    .lte("recovery_email_sent_at", cutoff)
    .is("sos_pet_email_sent_at", null)
    .order("recovery_email_sent_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) {
    console.error("sos-pet-followup: fetch failed:", error.message);
    return NextResponse.json({ error: "could not read leads" }, { status: 500 });
  }
  if (!leads?.length) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  // Never pitch SOS Pet to someone who already bought DogFlow in the meantime.
  const emails = leads.map((l) => l.email!.toLowerCase());
  const { data: buyers } = await supabase
    .from("purchases")
    .select("email")
    .eq("status", "active")
    .in("email", emails);
  const boughtSet = new Set((buyers ?? []).map((b) => b.email.toLowerCase()));

  let sent = 0;

  for (const lead of leads) {
    const email = lead.email!;
    if (boughtSet.has(email.toLowerCase())) continue;

    const locale = isLocale(lead.locale ?? "") ? lead.locale! : "es";
    const { subject, html } = buildSosPetFollowupEmail({
      locale,
      email,
      dogName: lead.dog_name,
    });

    const result = await sendEmail({ to: email, subject, html });
    if (!result.ok) {
      console.error("sos-pet-followup: send failed for", email, result.error ?? result.skipped);
      continue;
    }

    await supabase
      .from("quiz_leads")
      .update({ sos_pet_email_sent_at: new Date().toISOString() })
      .eq("session_id", lead.session_id);
    sent += 1;
  }

  return NextResponse.json({ ok: true, sent, candidates: leads.length });
}

export const GET = handle;
export const POST = handle;
