import type { Locale } from "@/lib/types";
import type { Dict } from "./dict";
import { pt } from "./pt";
import { es } from "./es";
import { en } from "./en";

export const DICTS: Record<Locale, Dict> = { pt, es, en };

export const getDict = (locale: Locale): Dict => DICTS[locale];

/** Fills {dog}, {breed} and {date} placeholders in any copy string. */
export const fill = (
  text: string,
  vars: Record<string, string | undefined>,
): string =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);

export type { Dict };
