<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import GlassText from "../ui/GlassText.vue";
import GlassTube from "../ui/GlassTube.vue";
import { DATA } from "../../data";
import { count } from "../../format";
import { commitCount, loadGithub } from "../../composables/useGithub";
import { useInView } from "../../composables/useInView";

loadGithub();

const githubUrl = DATA.contact.social.GitHub.url;
const number = computed(() => (commitCount.value == null ? undefined : count(commitCount.value)));

// Each time the count is scrolled into view its last two digits count up from 00 to the real
// ones, as on a counter: 1,835 goes 1,800, 1,801 ... 1,835, and never shows more than it is.
// A count that ends in 00 would have nothing to count, so its two digits go once round, 01 to
// 99 and back to 00. `behind` is how many steps they still have to go.
const TURN = 100;
const figure = ref<HTMLElement | null>(null);
const inView = useInView(figure);
const behind = ref(0);
let frame = 0;

// While they run, the two digits are set at one width each (see the template), in a box held at the
// width they have at rest, so that the digits in front never move.
const tail = ref<{ $el: HTMLElement } | null>(null);
const hold = (width = "") => tail.value && (tail.value.$el.style.width = width);

watch(inView, (seen) => {
  cancelAnimationFrame(frame);
  behind.value = 0;
  hold();
  // Not for a page that has only just loaded (see :root:not(.awake) in style.css), nor for
  // visitors who asked for less motion: they get the count as it is.
  if (
    !seen ||
    !document.documentElement.classList.contains("awake") ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  if (tail.value) hold(`${tail.value.$el.getBoundingClientRect().width}px`);
  const steps = (commitCount.value ?? 0) % TURN || TURN;
  // Longer the further there is to count, from 0.6s to 1.8s.
  const duration = 600 + steps * 12;
  const start = performance.now();
  const step = (now: number) => {
    const done = Math.min(1, (now - start) / duration);
    // Fast at first, slowing to a stop on the last digits.
    behind.value = Math.round(steps * (1 - done) ** 3);
    if (done < 1) frame = requestAnimationFrame(step);
    else hold();
  };
  frame = requestAnimationFrame(step);
});
onUnmounted(() => cancelAnimationFrame(frame));

// The number in two parts: the digits that stay, and the last two, which run. A count under
// 100 has no part that stays, and is shown whole.
const parts = computed(() => {
  const total = commitCount.value;
  if (total == null) return { head: "—" };
  if (total < TURN) return { head: String(total) };
  const tail = (((total - behind.value) % TURN) + TURN) % TURN;
  return { head: number.value!.slice(0, -2), tail: String(tail).padStart(2, "0") };
});
</script>

<template>
  <section
    class="relative z-1 flex flex-col items-center gap-3.5"
    :aria-label="DATA.ui.commits.label"
  >
    <span
      class="blob top-16 left-1/2 h-64 w-[min(40rem,100%)] -translate-x-1/2 bg-blob-c blur-[55px] max-md:h-40"
      aria-hidden="true"
    />
    <span class="h-18"><GlassTube from="bottom" /></span>
    <p
      ref="figure"
      class="max-w-full pb-4 text-[clamp(5rem,24vw,14.75rem)] leading-none tracking-[-0.04em]"
    >
      <span class="sr-only">{{ number ?? DATA.ui.commits.unknown }}</span>
      <GlassText :text="parts.head" :depth="10" gloss aria-hidden="true" />
      <!-- Digits of one width while they run, in the middle of the box the script holds for
           them: this font's digits differ a lot in width, and the number would shake as they
           changed. -->
      <GlassText
        v-if="parts.tail"
        ref="tail"
        :class="{ 'text-center tabular-nums': behind }"
        :text="parts.tail"
        :depth="10"
        gloss
        aria-hidden="true"
      />
    </p>
    <p class="text-[clamp(1.125rem,4vw,1.5rem)] font-semibold tracking-[-0.02em] text-ink">
      {{ DATA.ui.commits.unit }}
    </p>
    <a
      class="inline-flex items-center gap-1.5 font-mono text-[0.8125rem] tracking-wide text-s-muted hover:text-ink"
      :href="githubUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ DATA.ui.commits.more }} <AppIcon name="arrow-up-right" :size="13" />
    </a>
    <span class="h-18"><GlassTube from="top" /></span>
  </section>
</template>
