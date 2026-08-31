import type { Locale } from "./types";

export type UpsellOffer = {
  id: string;
  /**
   * Exactly one of the two is set, depending on whether this product has
   * its own quiz funnel built:
   * - quizUrl: routes through that funnel's own story before its paywall,
   *   same as this one does (only SOS Pet has one, so far).
   * - checkoutUrl: no funnel of its own — links straight to its Hotmart
   *   checkout.
   * Locale and prefill params are appended by offerUrl(), since only the
   * caller knows the buyer's name/email/locale.
   */
  quizUrl?: string;
  checkoutUrl?: string;
  /** Matches OtherProduct.productId from getOtherProducts — how the member
   *  area tells "already owns this" apart from "should be offered this". */
  hotmartProductId: string;
  /** Shown as-is, not translated: a product name is a name in every locale. */
  productName: string;
  /** e.g. "US$ 9,90" — kept as a single display string since each product prices differently. */
  priceLabel: string;
  copy: Record<Locale, { tagline: string; cta: string }>;
};

/**
 * Cross-sell to other products from the same seller (Dr. Eduardo Sebastião's
 * separate "Pet Saudável" app — its own Vite/React/Supabase project, hosted
 * on Hostinger, not part of this codebase), offered on the success page
 * right after a DogFlow purchase and in the member area's "products" tab.
 * Each is its own Hotmart checkout — no combined payment, no revenue split
 * to build; a buyer's access to that app's content is already handled
 * entirely by its own Hotmart webhook, matched on hotmart_product_id.
 *
 * All three are USD-priced Hotmart offers, matching DogFlow's own currency.
 */
const SOS_PET_QUIZ_URL =
  process.env.NEXT_PUBLIC_SOS_PET_QUIZ_URL ||
  "https://sos-pet-quiz-9are.vercel.app";

export const UPSELL_OFFERS: UpsellOffer[] = [
  {
    id: "sos-pet",
    quizUrl: SOS_PET_QUIZ_URL,
    hotmartProductId: "8190678",
    productName: "SOS Pet",
    priceLabel: "US$ 14,90",
    copy: {
      es: {
        tagline:
          "Guía de primeros auxilios para perros y gatos: qué hacer en las 8 emergencias más comunes, siempre a mano en tu celular.",
        cta: "Quiero verlo",
      },
      pt: {
        tagline:
          "Guia de primeiros socorros para cães e gatos: o que fazer nas 8 emergências mais comuns, sempre à mão no seu celular.",
        cta: "Quero ver",
      },
      en: {
        tagline:
          "A first-aid guide for dogs and cats: what to do in the 8 most common emergencies, always on your phone.",
        cta: "Show me",
      },
    },
  },
  {
    id: "kit-farmacia",
    checkoutUrl: "https://pay.hotmart.com/M106684784V?off=1tbguqji",
    hotmartProductId: "8100878",
    productName: "Kit de Farmacia en Casa",
    priceLabel: "US$ 5,90",
    copy: {
      es: {
        tagline:
          "Qué tener siempre a mano en casa para las emergencias más comunes de tu perro o gato, y qué nunca darle.",
        cta: "Quiero verlo",
      },
      pt: {
        tagline:
          "O que ter sempre à mão em casa para as emergências mais comuns do seu cão ou gato, e o que nunca dar a eles.",
        cta: "Quero ver",
      },
      en: {
        tagline:
          "What to always keep on hand at home for your dog or cat's most common emergencies, and what to never give them.",
        cta: "Show me",
      },
    },
  },
  {
    id: "sinais-silenciosos",
    checkoutUrl: "https://pay.hotmart.com/G106684861L?off=67axhon2",
    hotmartProductId: "8100897",
    productName: "Señales Silenciosas",
    priceLabel: "US$ 5,90",
    copy: {
      es: {
        tagline:
          "Las señales sutiles que tu perro o gato ya te está dando antes de que algo se ponga serio — y que casi nadie nota a tiempo.",
        cta: "Quiero verlo",
      },
      pt: {
        tagline:
          "Os sinais sutis que seu cão ou gato já está dando antes de algo ficar sério — e que quase ninguém percebe a tempo.",
        cta: "Quero ver",
      },
      en: {
        tagline:
          "The subtle signs your dog or cat is already giving before something turns serious — and that almost no one catches in time.",
        cta: "Show me",
      },
    },
  },
];

/**
 * Builds the link to send a buyer to for a given offer, prefilled with
 * whatever we already know about them: a quiz-funnel offer gets its own
 * locale-prefixed URL with pet name and e-mail carried over as query
 * params (see sos-pet-quiz's Landing.tsx); a direct-checkout offer just
 * gets the e-mail appended, since Hotmart checkout pre-fills its own form
 * from an `email` query param.
 */
export function offerUrl(
  offer: UpsellOffer,
  locale: Locale,
  opts: { email?: string; petName?: string } = {},
): string {
  if (offer.quizUrl) {
    const url = new URL(`/${locale}`, offer.quizUrl);
    if (opts.petName) url.searchParams.set("pet", opts.petName);
    if (opts.email) url.searchParams.set("email", opts.email);
    return url.toString();
  }
  const url = new URL(offer.checkoutUrl!);
  if (opts.email) url.searchParams.set("email", opts.email);
  return url.toString();
}
