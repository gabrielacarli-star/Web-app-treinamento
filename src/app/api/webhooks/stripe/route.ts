import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, PRICE_TO_PLAN } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TERM_DAYS, type Plan } from "@/lib/config";
import { provisionPasswordSetup } from "@/lib/auth/provisionPasswordSetup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Every plan is a recurring subscription (weekly/monthly/quarterly), same as
 * the existing Hotmart plans — so access is granted and extended off of
 * `invoice.payment_succeeded`, which fires once for the first charge and
 * again on every renewal, rather than off of `checkout.session.completed`
 * (which only ever fires once, at the very first payment). Cancellation
 * comes from `customer.subscription.deleted`; refunds still come from
 * `charge.refunded`, matched the same way as a one-time purchase would be.
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

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const email = invoice.customer_email;
    const priceDetails = invoice.lines.data[0]?.pricing?.price_details;
    const priceId = typeof priceDetails?.price === "string" ? priceDetails.price : priceDetails?.price?.id;
    const planId = priceId ? PRICE_TO_PLAN[priceId] : undefined;

    if (!email) {
      await finish(false, "no buyer e-mail on invoice");
      return NextResponse.json({ error: "missing buyer email" }, { status: 400 });
    }
    if (!planId || !(planId in TERM_DAYS)) {
      await finish(false, `unknown plan for price: ${priceId}`);
      return NextResponse.json({ error: "missing/unknown plan" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + TERM_DAYS[planId] * 86_400_000).toISOString();
    // Best-effort: the default InvoicePayment carries the PaymentIntent that
    // actually charged the card, used later to match a `charge.refunded`
    // event back to this purchase row.
    const payment = invoice.payments?.data[0]?.payment;
    const paymentIntentId =
      typeof payment?.payment_intent === "string" ? payment.payment_intent : payment?.payment_intent?.id;

    // One row per billing cycle (invoice.id is unique per charge, same as a
    // Hotmart renewal gets its own transaction id) — onConflict on
    // transaction makes retries idempotent, since Stripe can and does
    // redeliver events.
    const { error } = await supabase.from("purchases").upsert(
      {
        email,
        plan: planId,
        status: "active",
        transaction: invoice.id,
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

  // A subscription that ends (buyer cancelled, or Stripe gave up retrying a
  // failed renewal) — revoke whatever Stripe-sourced purchase is still
  // active for that buyer, mirroring Hotmart's SUBSCRIPTION_CANCELLATION.
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    const email = "deleted" in customer ? null : customer.email;

    if (!email) {
      await finish(false, "no e-mail on Stripe customer");
      return NextResponse.json({ error: "missing customer email" }, { status: 400 });
    }

    const { error } = await supabase
      .from("purchases")
      .update({ status: "cancelled" })
      .eq("email", email.toLowerCase())
      .eq("product_id", "stripe")
      .eq("status", "active");

    if (error) {
      await finish(false, error.message);
      return NextResponse.json({ error: "could not revoke" }, { status: 500 });
    }

    await finish(true);
    return NextResponse.json({ ok: true, revoked: email });
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
