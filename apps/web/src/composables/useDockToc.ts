import { ref } from "vue";

// On narrow screens a post's table of contents has no column of its own: it opens from the dock,
// where its button takes the place of the Blog tile. The post page and the dock share this state.

/** True while a post is shown. */
export const hasToc = ref(false);
/** True while the dock's table-of-contents popover is open. */
export const tocOpen = ref(false);

/**
 * True when the post page is one column wide. Always false until the app is mounted: pages are
 * built ahead of time, for no screen in particular, and Vue must first draw what was built.
 */
export const narrow = ref(false);

/** Starts following the screen's width. For the app to call once it is mounted. */
export function followWidth() {
  const query = matchMedia("(max-width: 1000px)");
  const sync = () => {
    narrow.value = query.matches;
    tocOpen.value = false;
  };
  sync();
  query.addEventListener("change", sync);
}
