import { notFound } from "next/navigation";
import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // No server-side session check here on purpose: the invite/recovery link
  // lands with the session in the URL's hash fragment, which the server
  // never sees (fragments never leave the browser). ResetPasswordForm
  // detects it client-side instead, and shows the expired-link state
  // itself if there turns out to be no session.
  return <ResetPasswordForm locale={locale} dict={getDict(locale)} />;
}
