import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/content";
import { LOCALES, isLocale } from "@/lib/config";
import { FunnelProvider } from "@/lib/store";
import { MetaPixel } from "@/components/MetaPixel";
import { UtmifyPixel } from "@/components/UtmifyPixel";

export const generateStaticParams = () =>
  LOCALES.map((locale) => ({ locale }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return { title: t.meta.title, description: t.meta.description };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={getDict(locale).htmlLang}>
      <body>
        <MetaPixel />
        <UtmifyPixel />
        <FunnelProvider>{children}</FunnelProvider>
      </body>
    </html>
  );
}
