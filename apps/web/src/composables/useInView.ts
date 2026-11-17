import { onMounted, onUnmounted, ref, type Ref } from "vue";

/**
 * True while `target` crosses the middle of the window (the band between 30% and 70% of its
 * height), false until the page is mounted.
 */
export function useInView(target: Ref<HTMLElement | null>) {
  const inView = ref(false);
  let observer: IntersectionObserver | undefined;
  onMounted(() => {
    observer = new IntersectionObserver(([entry]) => (inView.value = entry.isIntersecting), {
      rootMargin: "-30% 0px",
    });
    observer.observe(target.value!);
  });
  onUnmounted(() => observer?.disconnect());
  return inView;
}
