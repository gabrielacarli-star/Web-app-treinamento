import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TERM_DAYS, type Plan } from "@/lib/config";
import { provisionPasswordSetup } from "@/lib/auth/provisionPasswordSetup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Grants access the moment a Stripe embedded Checkout finishes — this is
 * the only thing that actually unlocks the app; the browser-side
 * `return_url` redirect is just where the buyer lands, not a trusted signal
 * (a webhook call is server-to-server and signed, a redirect can be faked).
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("stripe webhook: STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  const bodyText = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(bodyText, signature ?? "", secret);
  } catch (err) {
    console.error("stripe webhook: signature verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: logged } = await supabase
    .from("webhook_events")
    .insert({
      source: "stripe",
      event: event.type,
      transaction: event.id,
      payload: event as unknown as Record<string, unknown>,
    })
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email;
    const planId = session.metadata?.plan as Plan["id"] | undefined;

    if (!email) {
      await finish(false, "no buyer e-mail on session");
      return NextResponse.json({ error: "missing buyer email" }, { status: 400 });
    }
    if (!planId || !(planId in TERM_DAYS)) {
      await finish(false, `unknown plan in metadata: ${session.metadata?.plan}`);
      return NextResponse.json({ error: "missing/unknown plan" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + TERM_DAYS[planId] * 86_400_000).toISOString();
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    // onConflict on transaction makes retries idempotent, same as the
    // Hotmart webhook — Stripe can and does redeliver events.
    const { error } = await supabase.from("purchases").upsert(
      {
        email,
        plan: planId,
        status: "active",
        transaction: session.id,
        payment_intent: paymentIntentId,
        product_id: "stripe",
        expires_at: expiresAt,
        raw: event as unknown as Record<string, unknown>,
      },
      { onConflict: "transaction", ignoreDuplicates: false },
    );

    if (error) {
      await finish(false, error.message);
      return NextResponse.json({ error: "could not record purchase" }, { status: 500 });
    }

    await provisionPasswordSetup(supabase, email, "stripe webhook");

    await finish(true);
    return NextResponse.json({ ok: true, granted: email });
  }

  // Refunds show up as a charge.refunded event, which only carries the
  // PaymentIntent id (not the Checkout Session id purchases.transaction is
  // keyed on) — matched via purchases.payment_intent instead.
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId =
      typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;

    if (paymentIntentId) {
      const { error } = await supabase
        .from("purchases")
        .update({ status: "refunded" })
        .eq("payment_intent", paymentIntentId);

      if (error) {
        await finish(false, error.message);
        return NextResponse.json({ error: "could not revoke" }, { status: 500 });
      }
    }

    await finish(true);
    return NextResponse.json({ ok: true, refunded: true });
  }

  // Everything else (session expired, payment failed, etc.) is acknowledged
  // and kept in the log without touching access.
  await finish(true);
  return NextResponse.json({ ok: true, ignored: event.type });
}
