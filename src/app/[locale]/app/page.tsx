import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { authConfigured, getAccess } from "@/lib/access";
import { getOtherProducts } from "@/lib/crossApp";
import { Logo } from "@/components/Logo";
import { MemberArea } from "./MemberArea";
import { SignOutButton } from "./SignOutButton";

export default async function MemberPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  if (!authConfigured) {
    return <MemberArea dict={t} preview />;
  }

  const access = await getAccess();
  if (!access.signedIn) redirect(`/${locale}/login`);

  if (!access.active) {
    return (
      <div className="funnel-shell">
        <header className="flex h-14 items-center justify-center">
          <Logo />
        </header>
        <main className="flex flex-1 flex-col px-5 pb-10">
          <div className="mt-14 flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-coral-100 text-[28px]">
              🔒
            </span>
            <h1 className="headline mt-5 text-[22px]">
              {t.login.noAccessHeadline}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {t.login.noAccessBody}
            </p>
            <p className="mt-5 text-[13px] text-ink-faint">
              {t.login.signedInAs}{" "}
              <span className="font-medium text-ink-soft">{access.email}</span>
            </p>
          </div>

          <div className="mt-auto space-y-3 pt-10">
            <Link href={`/${locale}/offer`} className="cta">
              {t.login.noAccessCta}
            </Link>
            <SignOutButton label={t.login.signOut} locale={locale} />
          </div>
        </main>
      </div>
    );
  }

  const otherProducts = await getOtherProducts(access.email!);

  return (
    <MemberArea
      dict={t}
      account={{ email: access.email!, signOut: t.login.signOut }}
      locale={locale}
      otherProducts={otherProducts}
    />
  );
}
