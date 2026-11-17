import { ref } from "vue";

// On narrow screens a post's table of contents has no column of its own: it opens from the dock,
// where its button takes the place of the Blog tile. The post page and the dock share this state.

/** True while a post is shown. */
export const hasToc = ref(false);
/** True while the dock's table-of-contents popover is open. */
export const tocOpen = ref(false);

const query = matchMedia("(max-width: 1000px)");
/** True when the post page is one column wide. */
export const narrow = ref(query.matches);
query.addEventListener("change", (event) => {
  narrow.value = event.matches;
  tocOpen.value = false;
});
