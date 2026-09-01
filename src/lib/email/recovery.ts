import { BRAND, DISCOUNT, PLANS, checkoutUrl, money, priceOf } from "@/lib/config";
import type { Locale } from "@/lib/types";

/**
 * Copy for the single abandoned-lead recovery email, one locale each. Kept
 * separate from `src/content/*` on purpose — that dict is for pages
 * rendered client-side; this is server-only and never touches the funnel UI.
 */
const COPY: Record<
  Locale,
  {
    subject: (dog: string) => string;
    greeting: string;
    intro: (dog: string) => string;
    discountLine: string;
    couponLine: (percent: number) => string;
    perks: string[];
    cta: (dog: string) => string;
    footer: string;
  }
> = {
  es: {
    subject: (dog) => `${dog} sigue esperando su plan 🐾`,
    greeting: "Hola,",
    intro: (dog) =>
      `Vimos que empezaste a armar el plan de entrenamiento para ${dog}, pero no llegaste a activarlo.`,
    discountLine: "Tu descuento sigue disponible, no lo perdiste:",
    couponLine: (percent) =>
      `🎁 Solo por volver, sumamos ${percent}% extra — ya aplicado en el botón de abajo.`,
    perks: [
      "Paseos sin tirones",
      "Respuesta confiable a tu llamada",
      "Menos ansiedad al quedarse solo",
    ],
    cta: (dog) => `Activar el plan de ${dog}`,
    footer: `Cualquier duda, respondé este correo. — El equipo de ${BRAND.name}`,
  },
  pt: {
    subject: (dog) => `${dog} ainda está esperando pelo plano dele 🐾`,
    greeting: "Oi,",
    intro: (dog) =>
      `Vimos que você começou a montar o plano de treinamento do ${dog}, mas não chegou a ativar.`,
    discountLine: "Seu desconto continua disponível, você não perdeu:",
    couponLine: (percent) =>
      `🎁 Só por voltar, somamos mais ${percent}% — já aplicado no botão abaixo.`,
    perks: [
      "Passeios sem puxões",
      "Chamado confiável",
      "Menos ansiedade ao ficar sozinho",
    ],
    cta: (dog) => `Ativar o plano do ${dog}`,
    footer: `Qualquer dúvida, responda este e-mail. — Equipe ${BRAND.name}`,
  },
  en: {
    subject: (dog) => `${dog} is still waiting on their plan 🐾`,
    greeting: "Hi,",
    intro: (dog) =>
      `We saw you started building a training plan for ${dog}, but never activated it.`,
    discountLine: "Your discount is still there, you didn't lose it:",
    couponLine: (percent) =>
      `🎁 Just for coming back, we added ${percent}% more — already applied in the button below.`,
    perks: [
      "Walks without pulling",
      "A reliable recall",
      "Less anxiety when left alone",
    ],
    cta: (dog) => `Activate ${dog}'s plan`,
    footer: `Just reply to this email with any question. — The ${BRAND.name} team`,
  },
};

const FALLBACK_DOG: Record<Locale, string> = {
  es: "tu perro",
  pt: "seu cachorro",
  en: "your dog",
};

/** Same plan the paywall highlights as "popular" — the obvious single CTA for a recovery email. */
const RECOVERY_PLAN = PLANS.find((p) => p.popular) ?? PLANS[0];

/**
 * Extra Hotmart coupon (see `?offDiscount=`), stacked on top of the site's
 * own DISCOUNT, exclusively for people who already got this recovery email
 * and still didn't buy — an already-lost lead is cheap to win back a little
 * further. Percentage must match what the coupon is actually configured
 * for in the Hotmart dashboard (Products → Coupons); this only controls
 * what the email *displays*, Hotmart's checkout enforces the real charge.
 */
const RECOVERY_COUPON_CODE =
  process.env.RECOVERY_COUPON_CODE || "VOLVISTE20";
const RECOVERY_COUPON_PERCENT = 0.15;

export function buildRecoveryEmail({
  locale,
  email,
  dogName,
}: {
  locale: Locale;
  email: string;
  dogName?: string | null;
}) {
  const copy = COPY[locale] ?? COPY.es;
  const dog = dogName?.trim() || FALLBACK_DOG[locale] || FALLBACK_DOG.es;
  const price = priceOf(RECOVERY_PLAN, DISCOUNT);
  const finalTotal = price.total * (1 - RECOVERY_COUPON_PERCENT);
  const link = checkoutUrl(RECOVERY_PLAN.id, locale, {
    email,
    sck: [locale, RECOVERY_PLAN.id, "recovery-email"].join("-"),
    offDiscount: RECOVERY_COUPON_CODE,
  });

  const perksHtml = copy.perks.map((p) => `<li>${p}</li>`).join("");

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;color:#2C2A44">
      <p>${copy.greeting}</p>
      <p>${copy.intro(dog)}</p>
      <p>${copy.discountLine}</p>
      <p style="font-size:20px;font-weight:700;margin:16px 0">
        <span style="text-decoration:line-through;color:#9B98AC;font-weight:400">
          US$ ${money(RECOVERY_PLAN.basePerWeek * RECOVERY_PLAN.weeks)}
        </span>
        &nbsp; US$ ${money(finalTotal)}
      </p>
      <p style="background:#FFF4E5;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;margin:0 0 16px">
        ${copy.couponLine(RECOVERY_COUPON_PERCENT * 100)}
      </p>
      <ul>${perksHtml}</ul>
      <p style="margin:28px 0">
        <a href="${link}"
           style="background:#F24E00;color:#fff;padding:14px 24px;border-radius:999px;
                  text-decoration:none;font-weight:700;display:inline-block">
          ${copy.cta(dog)} →
        </a>
      </p>
      <p style="color:#6B6880;font-size:13px">${copy.footer}</p>
    </div>
  `.trim();

  return {
    subject: copy.subject(dog),
    html,
  };
}
