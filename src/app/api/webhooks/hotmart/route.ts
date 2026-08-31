import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { OFFER_TO_PLAN, isLocale } from "@/lib/config";
import { buildSetPasswordEmail } from "@/lib/email/setPassword";
import { sendEmail } from "@/lib/email/send";
import type { Locale } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://web-app-treinamento.vercel.app";

/**
 * A fresh buyer has no Supabase Auth account yet — this creates one (or, on
 * a repurchase, reuses the existing one) and e-mails a link to set the
 * password they'll sign in with from then on. Best-effort: a failure here
 * never fails the webhook, since the purchase itself is already recorded.
 */
async function provisionPasswordSetup(
  supabase: ReturnType<typeof createAdminClient>,
  email: string,
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
      "hotmart webhook: could not generate password-setup link for",
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
      "hotmart webhook: could not send set-password email to",
      email,
      result.error ?? result.skipped,
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Events that grant access, and those that take it away. */
const GRANTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const REVOKES: Record<string, string> = {
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
  PURCHASE_PROTEST: "chargeback",
  PURCHASE_CANCELED: "cancelled",
  PURCHASE_EXPIRED: "expired",
  SUBSCRIPTION_CANCELLATION: "cancelled",
  SWITCH_PLAN: "cancelled",
};

/** How long each plan grants access for. */
const TERM_DAYS: Record<string, number> = { p7: 7, p4: 28, p12: 84 };

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

/** Reads the first path that resolves to a non-empty string. */
const pick = (source: unknown, paths: string[][]): string | null => {
  for (const path of paths) {
    let node: unknown = source;
    for (const key of path) {
      if (node && typeof node === "object" && key in (node as object)) {
        node = (node as Record<string, unknown>)[key];
      } else {
        node = undefined;
        break;
      }
    }
    if (typeof node === "string" && node.trim()) return node.trim();
    if (typeof node === "number") return String(node);
  }
  return null;
};

export async function POST(request: Request) {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected) {
    console.error("hotmart webhook: HOTMART_HOTTOK is not set");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const bodyText = await request.text();
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(bodyText) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // The token travels in a header on current versions and in the body on
  // older ones; accept either rather than silently rejecting live sales.
  const provided =
    request.headers.get("x-hotmart-hottok") ??
    request.headers.get("hottok") ??
    pick(payload, [["hottok"]]) ??
    "";

  if (!safeEqual(provided, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // The payload shape varies by version and event, so the raw body is stored
  // before anything is interpreted. A delivery we fail to parse is still
  // recoverable from this row.
  const event = pick(payload, [["event"], ["data", "event"]]);
  const email = pick(payload, [
    ["data", "buyer", "email"],
    ["data", "subscriber", "email"],
    ["buyer", "email"],
    ["email"],
  ]);
  const transaction = pick(payload, [
    ["data", "purchase", "transaction"],
    ["data", "transaction"],
    ["purchase", "transaction"],
    ["transaction"],
  ]);
  const productId = pick(payload, [
    ["data", "product", "id"],
    ["product", "id"],
    ["prod"],
  ]);
  const offer = pick(payload, [
    ["data", "purchase", "offer", "code"],
    ["data", "offer", "code"],
    ["offer", "code"],
  ]);

  const { data: logged } = await supabase
    .from("webhook_events")
    .insert({ event, email, transaction, payload })
    .select("id")
    .single();

  const finish = async (handled: boolean, error?: string) => {
    if (logged?.id) {
      await supabase
        .from("webhook_events")
        .update({ handled, error: error ?? null })
        .eq("id", logged.id);
    }
  };

  if (!event) {
    await finish(false, "no event field in payload");
    return NextResponse.json({ error: "missing event" }, { status: 400 });
  }

  if (!email) {
    await finish(false, "no buyer e-mail found in payload");
    return NextResponse.json({ error: "missing buyer email" }, { status: 400 });
  }

  const plan = (offer && OFFER_TO_PLAN[offer]) ?? offer ?? null;

  if (GRANTS.has(event)) {
    const days = plan ? TERM_DAYS[plan] : undefined;
    const expiresAt = days
      ? new Date(Date.now() + days * 86_400_000).toISOString()
      : null;

    // onConflict on transaction makes retries idempotent.
    const { error } = await supabase.from("purchases").upsert(
      {
        email,
        plan,
        status: "active",
        transaction,
        product_id: productId,
        expires_at: expiresAt,
        raw: payload,
      },
      { onConflict: "transaction", ignoreDuplicates: false },
    );

    if (error) {
      await finish(false, error.message);
      return NextResponse.json({ error: "could not record purchase" }, { status: 500 });
    }

    await provisionPasswordSetup(supabase, email);

    await finish(true);
    return NextResponse.json({ ok: true, granted: email });
  }

  const revokedStatus = REVOKES[event];
  if (revokedStatus) {
    // Match on the transaction when we have one, so a refund on one purchase
    // does not revoke a different, still-valid one for the same buyer.
    const query = supabase.from("purchases").update({ status: revokedStatus });
    const { error } = transaction
      ? await query.eq("transaction", transaction)
      : await query.eq("email", email.toLowerCase()).eq("status", "active");

    if (error) {
      await finish(false, error.message);
      return NextResponse.json({ error: "could not revoke" }, { status: 500 });
    }

    await finish(true);
    return NextResponse.json({ ok: true, revoked: email });
  }

  // Everything else (billet printed, delayed, abandoned cart) is acknowledged
  // and kept in the log without touching access.
  await finish(true);
  return NextResponse.json({ ok: true, ignored: event });
}
