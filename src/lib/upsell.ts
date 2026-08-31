import type { Locale } from "./types";

export type UpsellOffer = {
  id: string;
  /** Separate Hotmart checkout for this product — its own sale, its own webhook delivery. */
  checkoutUrl: string;
  /** Shown as-is, not translated: a product name is a name in every locale. */
  productName: string;
  /** e.g. "US$ 9,90" — kept as a single display string since each product prices differently. */
  priceLabel: string;
  copy: Record<Locale, { tagline: string; cta: string }>;
};

/**
 * Cross-sell to other products from the same seller (Dr. Eduardo Sebastião's
 * separate "Pet Saudável" app — its own Vite/React/Supabase project, hosted
 * on Hostinger, not part of this codebase), offered once on the success page
 * right after a DogFlow purchase. Each is its own Hotmart checkout — no
 * combined payment, no revenue split to build; a buyer's access to that
 * app's content is already handled entirely by its own Hotmart webhook,
 * matched on hotmart_product_id.
 *
 * SOS Pet (R$57, Hotmart id 8190678) is the flagship product — "Kit Farmácia
 * em Casa" and "Sinais Silenciosos" are order bumps (R$19.90 each) attached
 * to *its* checkout, not independently marketed products with their own
 * standalone checkout page, so SOS Pet is what belongs here.
 *
 * PLACEHOLDER: checkoutUrl needs the real pay.hotmart.com link for SOS Pet.
 */
export const UPSELL_OFFERS: UpsellOffer[] = [
  {
    id: "sos-pet",
    checkoutUrl: "https://pay.hotmart.com/REPLACE_ME_SOS_PET",
    productName: "SOS Pet",
    priceLabel: "R$ 57,00",
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
];
