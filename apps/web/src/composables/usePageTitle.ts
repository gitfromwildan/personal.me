import { useSSRContext, watchEffect } from "vue";
import { DATA } from "../data";

/** What a page is shared as: its search snippet and its social card (see prerender.ts). */
export type PageCard = { page: string; title: string; summary: string };

/**
 * Titles the page "<name> - <site owner>", or just the owner's name while there is no name to
 * give: in the browser tab, and in the <title> of the page as built (see prerender.ts). The
 * card is only read while the page is built: a crawler reads the built page, never the script.
 */
export function usePageTitle(name: () => string | undefined, card?: () => PageCard | undefined) {
  const title = () => [name(), DATA.name].filter(Boolean).join(" - ");
  if (import.meta.env.SSR) Object.assign(useSSRContext()!, { title: title(), card: card?.() });
  else watchEffect(() => (document.title = title()));
}
