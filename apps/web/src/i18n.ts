import { createI18n } from "vue-i18n";
import { messages, type Locale } from "./data/messages";

/** The language of pages with no language in their address. */
export const DEFAULT_LOCALE: Locale = "en";

/**
 * vue-i18n holds the language being shown and the copy in each. The address decides the
 * language (see router.ts): /id/... is Indonesian, everything else English.
 */
export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
});

/** The language of an address: "/id" and "/id/blog" are Indonesian. */
export const localeOf = (path: string): Locale => (/^\/id(\/|$)/.test(path) ? "id" : "en");

/** The same page in the other language. */
export const inOtherLocale = (path: string) =>
  localeOf(path) === "id" ? path.slice(3) || "/" : `/id${path === "/" ? "" : path}`;
