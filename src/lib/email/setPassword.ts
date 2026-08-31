import { BRAND } from "@/lib/config";
import type { Locale } from "@/lib/types";

/**
 * The one email every buyer gets right after a purchase is granted: a link
 * to set the password they'll use to sign in from then on. Same shape as
 * `recovery.ts` — plain inline-styled HTML, no template engine.
 */
const COPY: Record<
  Locale,
  { subject: string; greeting: string; intro: string; cta: string; footer: string }
> = {
  es: {
    subject: `Creá tu contraseña de ${BRAND.name}`,
    greeting: "¡Hola!",
    intro:
      "Tu compra fue confirmada y tu acceso ya está liberado. Creá una contraseña para entrar cuando quieras.",
    cta: "Crear mi contraseña",
    footer: `Este enlace vale por una hora. Si no funciona, pedí uno nuevo desde la pantalla de inicio de sesión. — El equipo de ${BRAND.name}`,
  },
  pt: {
    subject: `Crie sua senha do ${BRAND.name}`,
    greeting: "Oi!",
    intro:
      "Sua compra foi confirmada e seu acesso já está liberado. Crie uma senha para entrar sempre que quiser.",
    cta: "Criar minha senha",
    footer: `Esse link vale por uma hora. Se não funcionar, peça um novo na tela de login. — Equipe ${BRAND.name}`,
  },
  en: {
    subject: `Set your ${BRAND.name} password`,
    greeting: "Hi!",
    intro:
      "Your purchase is confirmed and your access is live. Set a password so you can sign in whenever you want.",
    cta: "Set my password",
    footer: `This link is valid for one hour. If it doesn't work, request a new one from the sign-in screen. — The ${BRAND.name} team`,
  },
};

export function buildSetPasswordEmail({
  locale,
  actionLink,
}: {
  locale: Locale;
  actionLink: string;
}) {
  const copy = COPY[locale] ?? COPY.es;

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;color:#2C2A44">
      <p>${copy.greeting}</p>
      <p>${copy.intro}</p>
      <p style="margin:28px 0">
        <a href="${actionLink}"
           style="background:#F24E00;color:#fff;padding:14px 24px;border-radius:999px;
                  text-decoration:none;font-weight:700;display:inline-block">
          ${copy.cta} →
        </a>
      </p>
      <p style="color:#6B6880;font-size:13px">${copy.footer}</p>
    </div>
  `.trim();

  return { subject: copy.subject, html };
}
