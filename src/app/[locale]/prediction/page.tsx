import { notFound } from "next/navigation";
import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { Prediction } from "./Prediction";

export default async function PredictionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Prediction locale={locale} dict={getDict(locale)} />;
}
