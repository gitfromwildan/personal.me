/** Attributes for an <a>: web URLs open in a new tab, mailto: and in-page links stay in this one. */
export const linkTarget = (url: string) =>
  url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
