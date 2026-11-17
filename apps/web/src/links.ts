import { DATA } from "./data";

/** Attributes for an <a>: web URLs open in a new tab, mailto: and in-page links stay in this one. */
export const linkTarget = (url: string) =>
  url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

/** Where a post lives, in the language being shown. The route is declared in router.ts. */
export const postPath = (slug: string) => `${DATA.navbar[1].href}/${slug}`;
