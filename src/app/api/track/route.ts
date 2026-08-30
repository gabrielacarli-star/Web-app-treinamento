import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  sessionId?: string;
  locale?: string;
  variant?: string;
  lastStep?: string;
  stepCount?: number;
  email?: string;
  dogName?: string;
  dogBreed?: string;
  answers?: Record<string, unknown>;
};

/**
 * Upserts one row of funnel progress per visitor session. Called on every
 * quiz step and again when the e-mail is captured, so a lead who never
 * finishes is still on record with however far they got.
 *
 * Never blocks or fails loudly toward the visitor: tracking is best-effort,
 * and a dropped beacon must not cost a step of the funnel.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId) {
    return NextResponse.json({ error: "missing sessionId" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    // Supabase not configured yet: accept the beacon and drop it, rather
    // than turning every quiz step into a failed request in dev.
    return NextResponse.json({ ok: true, skipped: "not configured" });
  }

  const row: Record<string, unknown> = { session_id: sessionId };
  if (body.locale) row.locale = body.locale;
  if (body.variant) row.variant = body.variant;
  if (body.lastStep) row.last_step = body.lastStep;
  if (typeof body.stepCount === "number") row.step_count = body.stepCount;
  if (body.email) row.email = body.email;
  if (body.dogName) row.dog_name = body.dogName;
  if (body.dogBreed) row.dog_breed = body.dogBreed;
  if (body.answers) row.answers = body.answers;

  const { error } = await supabase
    .from("quiz_leads")
    .upsert(row, { onConflict: "session_id" });

  if (error) {
    console.error("track upsert failed:", error.message);
    return NextResponse.json({ error: "could not record" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
