import { i18n } from "./i18n";

// Dates come as ISO strings. Post dates are YYYY-MM-DD and are read as UTC, so the day never
// shifts with the visitor's time zone. They are written in the language being shown: `en` and
// `id` are the regional forms of English (one day-first, one month-first) and of Indonesian
// that each format uses.
const date =
  (en: string, id: string, options: Intl.DateTimeFormatOptions) =>
  (iso: string): string =>
    new Date(iso).toLocaleDateString(i18n.global.locale.value === "id" ? id : en, {
      ...options,
      timeZone: "UTC",
    });

/** "04 Feb 2026" */
export const shortDate = date("en-GB", "id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
/** "February 4, 2026", "4 Februari 2026" */
export const longDate = date("en-US", "id-ID", { day: "numeric", month: "long", year: "numeric" });
/** "Feb" */
export const shortMonth = date("en-US", "id-ID", { month: "short" });

/** A whole number with its thousands marked: "1,835", "1.835". */
export const count = (n: number) =>
  n.toLocaleString(i18n.global.locale.value === "id" ? "id-ID" : "en-US");

/** "today", "12d ago", "9mo ago", "2y ago" */
export function ago(iso: string) {
  const { t } = i18n.global;
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days < 1) return t("ui.ago.today");
  if (days < 30) return t("ui.ago.days", { n: days });
  if (days < 365) return t("ui.ago.months", { n: Math.floor(days / 30) });
  return t("ui.ago.years", { n: Math.floor(days / 365) });
}
