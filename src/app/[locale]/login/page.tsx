import { notFound, redirect } from "next/navigation";
import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { authConfigured, getAccess } from "@/lib/access";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // With no auth backend there is nothing to sign in to, and the member area
  // is open anyway.
  if (!authConfigured) redirect(`/${locale}/app`);

  // Already signed in with a live plan? Skip the form.
  const access = await getAccess();
  if (access.active) redirect(`/${locale}/app`);

  return <LoginForm locale={locale} dict={getDict(locale)} />;
}
