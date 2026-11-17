import { createMdxComponents } from "@docubook/markdown";
import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot, hydrateRoot } from "react-dom/client";
import { bodies } from "virtual:posts/bodies";
import { i18n } from "../../i18n";

// The React side of a post, kept in a file of its own so that PostBody.vue can fetch it after
// the page is up: it is by far the heaviest script of the site (React, DocuBook's components,
// and the whole icon set they look icons up in by name).

const components = createMdxComponents();

/**
 * Runs the post's body, in the language being shown, in `el` with React, and returns the root
 * to unmount it by.
 */
export function mountPost(el: HTMLElement, slug: string) {
  const post = createElement(bodies[i18n.global.locale.value][slug], { components });
  // A page built ahead of time: React takes over the HTML that is already there.
  if (el.hasChildNodes()) return hydrateRoot(el, post);
  // Arrived by a link within the site, or under `vp dev`: React draws it, at once, so the
  // caller can count on the headings being there.
  const root = createRoot(el);
  flushSync(() => root.render(post));
  return root;
}
