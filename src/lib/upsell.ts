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
 * Cross-sell to other products from the same seller, offered once on the
 * success page right after a DogFlow purchase. Each is its own Hotmart
 * checkout — no combined payment, no revenue split to build.
 *
 * PLACEHOLDER: swap in the real checkout URL, price and tagline once known.
 */
export const UPSELL_OFFERS: UpsellOffer[] = [
  {
    id: "kit-farmacia-em-casa",
    checkoutUrl: "https://pay.hotmart.com/REPLACE_ME",
    productName: "Kit Farmácia em Casa",
    priceLabel: "US$ 0,00",
    copy: {
      es: {
        tagline: "El mismo cuidado, ahora también para tu botiquín en casa.",
        cta: "Quiero verlo",
      },
      pt: {
        tagline: "O mesmo cuidado, agora também para sua farmácia em casa.",
        cta: "Quero ver",
      },
      en: {
        tagline: "The same care, now for your home medicine kit too.",
        cta: "Show me",
      },
    },
  },
];
