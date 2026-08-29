import { notFound } from "next/navigation";
import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { EmailCapture } from "./EmailCapture";

export default async function EmailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <EmailCapture locale={locale} dict={getDict(locale)} />;
}
