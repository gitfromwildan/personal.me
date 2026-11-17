import { onMounted, onUnmounted, ref, type Ref } from "vue";

// A heading counts as reached once it is this close to the top of the window.
const REACHED = 120;

/**
 * Tracks reading through `article`: `progress` runs from 0 (its top at the top of the window) to
 * 1 (its bottom at the bottom of the window), and `active` is the last of `hrefs` ("#id") whose
 * heading has been reached, starting with the first.
 */
export function useReadingProgress(article: Ref<HTMLElement | null>, hrefs: () => string[]) {
  const progress = ref(0);
  const active = ref<string>();

  function update() {
    const el = article.value;
    if (!el) return;
    const { top, height } = el.getBoundingClientRect();
    const distance = height - innerHeight;
    progress.value = distance > 0 ? Math.min(1, Math.max(0, -top / distance)) : Number(top <= 0);

    const list = hrefs();
    const reached = list.filter((href) => {
      const heading = document.getElementById(href.slice(1));
      return heading && heading.getBoundingClientRect().top <= REACHED;
    });
    // The last heading may never get near the top of the window: the end of the page counts too.
    const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
    active.value = atEnd ? list.at(-1) : (reached.at(-1) ?? list[0]);
  }

  onMounted(() => {
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
  });
  onUnmounted(() => {
    removeEventListener("scroll", update);
    removeEventListener("resize", update);
  });

  return { progress, active, update };
}
