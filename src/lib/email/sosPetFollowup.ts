import { BRAND } from "@/lib/config";
import { UPSELL_OFFERS, offerUrl } from "@/lib/upsell";
import type { Locale } from "@/lib/types";

/**
 * Sent 2 days after the DogFlow recovery email to a lead who still hasn't
 * bought — a different pitch, not a nag: training may not be what this
 * person actually needs right now, so offer SOS Pet instead of repeating
 * the same DogFlow discount a second time.
 */
const COPY: Record<
  Locale,
  { subject: () => string; greeting: string; intro: (dog: string) => string; footer: string }
> = {
  es: {
    subject: () => "Por si el adiestramiento no es lo tuyo ahora mismo",
    greeting: "Hola,",
    intro: (dog) =>
      `Vimos que no llegaste a activar el plan de entrenamiento para ${dog}. Puede que ahora mismo no sea el momento, y está bien — pero si lo que te preocupa es estar preparado para una emergencia con tu mascota, esto puede servirte más:`,
    footer: `Cualquier duda, respondé este correo. — El equipo de ${BRAND.name}`,
  },
  pt: {
    subject: () => "Caso o adestramento não seja pra você agora",
    greeting: "Oi,",
    intro: (dog) =>
      `Vimos que você não chegou a ativar o plano de treinamento do ${dog}. Talvez não seja o momento certo pra isso, e tudo bem — mas se o que te preocupa é estar preparado pra uma emergência com seu pet, isso aqui pode fazer mais sentido:`,
    footer: `Qualquer dúvida, responda este e-mail. — Equipe ${BRAND.name}`,
  },
  en: {
    subject: () => "In case training isn't the right fit right now",
    greeting: "Hi,",
    intro: (dog) =>
      `We saw you never activated the training plan for ${dog}. Maybe now just isn't the time for that, and that's OK — but if what you're actually worried about is being ready for a pet emergency, this might fit better:`,
    footer: `Just reply to this email with any question. — The ${BRAND.name} team`,
  },
};

const FALLBACK_DOG: Record<Locale, string> = {
  es: "tu perro",
  pt: "seu cachorro",
  en: "your dog",
};

const SOS_PET = UPSELL_OFFERS.find((o) => o.id === "sos-pet")!;

export function buildSosPetFollowupEmail({
  locale,
  email,
  dogName,
}: {
  locale: Locale;
  email: string;
  dogName?: string | null;
}) {
  const copy = COPY[locale] ?? COPY.es;
  const offerCopy = SOS_PET.copy[locale] ?? SOS_PET.copy.es;
  const dog = dogName?.trim() || FALLBACK_DOG[locale] || FALLBACK_DOG.es;
  const link = offerUrl(SOS_PET, locale, { email, petName: dogName ?? undefined });

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;color:#2C2A44">
      <p>${copy.greeting}</p>
      <p>${copy.intro(dog)}</p>
      <p style="font-size:18px;font-weight:700;margin:20px 0 4px">${SOS_PET.productName}</p>
      <p style="margin:0 0 4px;color:#6B6880">${offerCopy.tagline}</p>
      <p style="font-weight:700;margin:4px 0 20px">${SOS_PET.priceLabel}</p>
      <p style="margin:28px 0">
        <a href="${link}"
           style="background:#F24E00;color:#fff;padding:14px 24px;border-radius:999px;
                  text-decoration:none;font-weight:700;display:inline-block">
          ${offerCopy.cta} →
        </a>
      </p>
      <p style="color:#6B6880;font-size:13px">${copy.footer}</p>
    </div>
  `.trim();

  return {
    subject: copy.subject(),
    html,
  };
}
