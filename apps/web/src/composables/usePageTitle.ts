import { useSSRContext, watchEffect } from "vue";
import { DATA } from "../data";

/**
 * Titles the page "<name> - <site owner>", or just the owner's name while there is no name to
 * give: in the browser tab, and in the <title> of the page as built (see prerender.ts).
 */
export function usePageTitle(name: () => string | undefined) {
  const title = () => [name(), DATA.name].filter(Boolean).join(" - ");
  if (import.meta.env.SSR) useSSRContext()!.title = title();
  else watchEffect(() => (document.title = title()));
}
