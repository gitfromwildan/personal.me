import { onMounted, onUnmounted, ref, type Ref } from "vue";

/**
 * True while `target` is in view, false until the page is mounted. `margin` shrinks the window
 * it must be in, as CSS margins do: by default to the middle band, between 30% and 70% of the
 * window's height.
 */
export function useInView(target: Ref<HTMLElement | null>, margin = "-30% 0px") {
  const inView = ref(false);
  let observer: IntersectionObserver | undefined;
  onMounted(() => {
    observer = new IntersectionObserver(([entry]) => (inView.value = entry.isIntersecting), {
      rootMargin: margin,
    });
    observer.observe(target.value!);
  });
  onUnmounted(() => observer?.disconnect());
  return inView;
}
