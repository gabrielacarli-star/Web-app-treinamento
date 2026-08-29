import { notFound } from "next/navigation";
import { getDict } from "@/content";
import { isLocale } from "@/lib/config";
import { Quiz } from "./Quiz";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Quiz locale={locale} dict={getDict(locale)} />;
}
