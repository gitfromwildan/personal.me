import { ref } from "vue";

// On narrow screens a post's table of contents has no column of its own: it opens from the dock,
// where its button takes the place of the Blog tile. The post page and the dock share this state.

/** True while a post is shown. */
export const hasToc = ref(false);
/** True while the dock's table-of-contents popover is open. */
export const tocOpen = ref(false);

/**
 * True when the post page is one column wide. Always false until the dock is mounted: pages are
 * built ahead of time, for no screen in particular, and Vue must first draw what was built.
 */
export const narrow = ref(false);

let following = false;

/**
 * Starts following the screen's width. For the dock to call once it is mounted: it is made anew
 * with each change of language, and only the first has anything to start.
 */
export function followWidth() {
  if (following) return;
  following = true;
  const query = matchMedia("(width < 62.5rem)");
  const sync = () => {
    narrow.value = query.matches;
    tocOpen.value = false;
  };
  sync();
  query.addEventListener("change", sync);
}
