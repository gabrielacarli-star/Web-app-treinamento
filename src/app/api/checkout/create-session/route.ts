import { NextResponse } from "next/server";
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/stripe/server";
import { isLocale, PLANS, SITE_URL, type Plan } from "@/lib/config";

export const runtime = "nodejs";

/**
 * Creates a Stripe embedded Checkout Session and returns its client_secret,
 * which the browser hands to Stripe.js to mount the payment form in place —
 * the buyer never leaves the offer page. `return_url` is where Stripe
 * redirects after payment completes (success or the buyer navigating back);
 * actual access is granted by the webhook, not by that redirect.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { plan?: string; locale?: string; email?: string }
    | null;

  const planId = body?.plan as Plan["id"] | undefined;
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) {
    return NextResponse.json({ error: "unknown plan" }, { status: 400 });
  }

  const priceId = STRIPE_PRICE_IDS[plan.id];
  if (!priceId) {
    return NextResponse.json({ error: "checkout not configured for this plan" }, { status: 500 });
  }

  const locale = isLocale(body?.locale ?? "") ? body!.locale! : "es";
  const email = body?.email?.trim();

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      // Every plan renews automatically (weekly/monthly/quarterly), same as
      // the existing Hotmart subscriptions — a one-time `mode: "payment"`
      // would only ever charge the buyer once.
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      // Prefills and locks the buyer's e-mail when we already have it from
      // the funnel, so the webhook can match the purchase without asking
      // them to retype it.
      ...(email ? { customer_email: email } : {}),
      metadata: { plan: plan.id, locale },
      return_url: `${SITE_URL}/${locale}/success?stripe_session_id={CHECKOUT_SESSION_ID}`,
    });

    console.log(
      "checkout/create-session: created",
      session.id,
      "mode=" + session.mode,
      "has clientSecret=" + Boolean(session.client_secret),
    );
    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    const stripeErr = err as { type?: string; code?: string; message?: string };
    console.error(
      "checkout/create-session: failed to create session",
      stripeErr.type,
      stripeErr.code,
      stripeErr.message,
    );
    return NextResponse.json({ error: "could not start checkout" }, { status: 500 });
  }
}
