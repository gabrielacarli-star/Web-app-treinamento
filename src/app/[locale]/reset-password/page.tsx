import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { authConfigured, getAccess } from "@/lib/access";
import { Logo } from "@/components/Logo";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  // Reaching this page requires the session /auth/confirm just verified and
  // wrote to cookies — no session means the link was already used, expired,
  // or never valid to begin with.
  const access = authConfigured ? await getAccess() : { signedIn: true };
  if (!access.signedIn) {
    return (
      <div className="funnel-shell">
        <header className="flex h-14 items-center justify-center">
          <Logo />
        </header>
        <main className="flex flex-1 flex-col px-5 pb-10">
          <div className="mt-14 flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-coral-100 text-[28px]">
              ⏱️
            </span>
            <h1 className="headline mt-5 text-[22px]">
              {t.resetPassword.expiredHeadline}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {t.resetPassword.expiredBody}
            </p>
          </div>
          <div className="mt-auto pt-10">
            <Link href={`/${locale}/login`} className="cta">
              {t.resetPassword.expiredCta}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return <ResetPasswordForm locale={locale} dict={t} />;
}
