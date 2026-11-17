// Dates come as ISO strings. Post dates are YYYY-MM-DD and are read as UTC, so the day never
// shifts with the visitor's time zone.
const date = (locale: string, options: Intl.DateTimeFormatOptions) => (iso: string) =>
  new Date(iso).toLocaleDateString(locale, { ...options, timeZone: "UTC" });

/** "04 Feb 2026" */
export const shortDate = date("en-GB", { day: "2-digit", month: "short", year: "numeric" });
/** "February 4, 2026" */
export const longDate = date("en-US", { day: "numeric", month: "long", year: "numeric" });
/** "Feb" */
export const shortMonth = date("en-US", { month: "short" });

/** "today", "12d ago", "9mo ago", "2y ago" */
export function ago(iso: string) {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
