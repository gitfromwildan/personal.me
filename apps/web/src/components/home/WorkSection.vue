<script setup lang="ts">
import { ref } from "vue";
import { useInView } from "../../composables/useInView";
import { DATA } from "../../data";
import AppIcon from "../ui/AppIcon.vue";
import GlassTube from "../ui/GlassTube.vue";
import SectionEyebrow from "../ui/SectionEyebrow.vue";

// "November 2024" -> "Nov 2024"
const short = (date: string) => `${date.slice(0, 3)} ${date.split(" ").at(-1)}`;

const jobs = DATA.work.map((job, i) => ({
  ...job,
  year: job.start.split(" ").at(-1),
  // The job held now has no end to show.
  period: `${short(job.start)} — ${job.current ? DATA.ui.now : short(job.end)}`,
  external: job.href.startsWith("http"),
  // On a wide screen the cards take turns either side of the rail, the first on the left.
  left: i % 2 === 0,
}));

// The liquid fills the rail down to the end of the current job's slot.
const currentIndex = Math.max(
  0,
  jobs.findIndex((job) => job.current),
);
const fill = (currentIndex + 1) / jobs.length;

// Each time the timeline is scrolled into view, the liquid climbs the rail from the oldest job
// up to its place.
const rail = ref<HTMLElement | null>(null);
const inView = useInView(rail);
</script>

<template>
  <!-- --rail-w is the width of the rail's column: on a wide screen, between the two columns of
       cards. -->
  <section
    id="work"
    class="section container [--rail-w:5rem] md:[--rail-w:9.5rem]"
    aria-labelledby="work-title"
  >
    <SectionEyebrow id="work-title" as="h2" :label="DATA.ui.eyebrows.work" />

    <div class="relative">
      <div
        ref="rail"
        class="absolute inset-y-12 left-[calc(var(--rail-w)/2-6px)] md:left-[calc(50%-6px)]"
        aria-hidden="true"
      >
        <GlassTube :fill="fill" :travel="inView" />
      </div>

      <!-- On a wide screen each row is pulled up so the cards interleave; cards on the same side
           stay at least 2.5rem apart. -->
      <ol class="flex flex-col gap-12">
        <li
          v-for="job in jobs"
          :key="job.company"
          class="grid grid-cols-[var(--rail-w)_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_var(--rail-w)_minmax(0,1fr)] md:not-first:-mt-16"
        >
          <div class="relative col-start-1 row-start-1 min-h-22 md:col-start-2" aria-hidden="true">
            <img
              class="absolute top-5.5 left-1/2 size-12 -translate-x-1/2 rounded-[14px] bg-logo-tile object-contain shadow-[0_8px_18px_var(--color-glass-shadow)]"
              :class="job.current ? 'outline-2 outline-accent' : 'outline outline-rim-hi'"
              :src="job.logoUrl"
              alt=""
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
            />
            <span
              class="glass chip absolute top-[4.875rem] left-1/2 -translate-x-1/2 bg-stage px-2.25 py-0.5 font-mono text-[0.8125rem] font-semibold"
              :class="job.current ? 'text-ink' : 'text-s-muted'"
            >
              {{ job.year }}
            </span>
            <span
              class="absolute top-[2.6875rem] right-0 h-[5px] w-[calc(50%-24px)] rounded-[3px] shadow-[inset_0_0_0_1px_var(--color-rim-lo)]"
              :class="[
                job.current ? 'bg-liquid-hi' : 'bg-track',
                { 'md:right-auto md:left-0': job.left },
              ]"
            />
          </div>

          <article
            class="glass col-start-2 row-start-1 flex flex-col gap-2 self-start rounded-3xl px-7.5 py-6"
            :class="job.left ? 'md:col-start-1' : 'md:col-start-3'"
          >
            <header class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3 class="text-xl font-semibold tracking-[-0.02em] text-ink">
                <a
                  v-if="job.external"
                  :href="job.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group inline-flex items-center gap-2.5"
                >
                  {{ job.company }}
                  <AppIcon
                    class="text-s-muted group-hover:text-accent group-focus-visible:text-accent"
                    name="arrow-up-right"
                    :size="15"
                  />
                </a>
                <template v-else>{{ job.company }}</template>
              </h3>
              <span
                v-if="job.current"
                class="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.25 py-0.75 font-mono text-2xs font-medium text-accent"
              >
                <span class="dot" />{{ DATA.ui.now }}
              </span>
              <span class="basis-full font-mono text-xs text-s-muted md:ml-auto md:basis-auto">
                {{ job.period }}
              </span>
            </header>
            <p class="text-[0.9375rem] font-medium text-ink-2">{{ job.title }}</p>
            <p class="muted-text">{{ job.description }}</p>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>
