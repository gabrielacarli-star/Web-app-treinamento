import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { notFound } from "next/navigation";
import { Landing } from "./Landing";

export default async function LandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const { locale } = await params;
  const { v } = await searchParams;
  if (!isLocale(locale)) notFound();

  const t = getDict(locale);
  const variant =
    t.landing.variants.find((item) => item.id === v) ?? t.landing.variants[0];

  return <Landing locale={locale} dict={t} variantId={variant.id} />;
}
