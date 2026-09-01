import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { Offer } from "./Offer";

export default async function OfferPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Vercel sets this at the edge from the request's IP — free geolocation,
  // no external API call. Absent entirely off Vercel (local dev, other
  // hosts), which just means no local-currency estimate renders.
  const country = (await headers()).get("x-vercel-ip-country");

  return <Offer locale={locale} dict={getDict(locale)} country={country} />;
}
