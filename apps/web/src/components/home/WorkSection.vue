<script setup lang="ts">
import { ref } from "vue";
import { useInView } from "../../composables/useInView";
import { DATA } from "../../data";
import AppIcon from "../ui/AppIcon.vue";
import GlassTube from "../ui/GlassTube.vue";
import SectionEyebrow from "../ui/SectionEyebrow.vue";

// "November 2024" -> "Nov 2024"
const short = (date: string) => `${date.slice(0, 3)} ${date.split(" ").at(-1)}`;

const jobs = DATA.work.map((job) => ({
  ...job,
  year: job.start.split(" ").at(-1),
  // The job held now has no end to show.
  period: `${short(job.start)} — ${job.current ? DATA.ui.now : short(job.end)}`,
  external: job.href.startsWith("http"),
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
  <section id="work" class="work section container" aria-labelledby="work-title">
    <SectionEyebrow id="work-title" as="h2" :label="DATA.ui.eyebrows.work" />

    <div class="timeline">
      <div ref="rail" class="rail" aria-hidden="true">
        <GlassTube :fill="fill" :travel="inView" />
      </div>

      <ol class="jobs">
        <li v-for="(job, i) in jobs" :key="job.company" class="job" :class="{ left: i % 2 === 0 }">
          <div class="mid" aria-hidden="true">
            <img
              class="node"
              :class="{ current: job.current }"
              :src="job.logoUrl"
              alt=""
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
            />
            <span class="chip glass year" :class="{ current: job.current }">{{ job.year }}</span>
            <span class="link" :class="{ current: job.current }" />
          </div>

          <article class="glass card">
            <header class="heading">
              <h3 class="company">
                <a
                  v-if="job.external"
                  :href="job.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="company-link"
                >
                  {{ job.company }}
                  <AppIcon name="arrow-up-right" :size="15" />
                </a>
                <template v-else>{{ job.company }}</template>
              </h3>
              <span v-if="job.current" class="now"><span class="dot" />{{ DATA.ui.now }}</span>
              <span class="period">{{ job.period }}</span>
            </header>
            <p class="title">{{ job.title }}</p>
            <p class="muted-text">{{ job.description }}</p>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.work {
  --rail-w: 5rem;
}

.timeline {
  position: relative;
}

.jobs {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.rail {
  position: absolute;
  inset-block: 3rem;
  left: calc(var(--rail-w) / 2 - 6px);
}

.job {
  display: grid;
  grid-template-columns: var(--rail-w) minmax(0, 1fr);
}

.mid {
  position: relative;
  grid-column: 1;
  grid-row: 1;
  min-height: 5.5rem;
}

.card {
  --glass-radius: 24px;
  grid-column: 2;
  grid-row: 1;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 1.875rem;
}

.node {
  position: absolute;
  top: 1.375rem;
  left: 50%;
  width: 48px;
  height: 48px;
  translate: -50% 0;
  border-radius: 14px;
  background: var(--logo-tile);
  object-fit: contain;
  box-shadow: 0 8px 18px var(--glass-shadow);
  outline: 1px solid var(--rim-hi);
}

.node.current {
  outline: 2px solid var(--accent);
}

.year {
  position: absolute;
  top: 4.875rem;
  left: 50%;
  translate: -50% 0;
  padding: 2px 9px;
  background: var(--stage);
  color: var(--s-muted);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
}

.year.current {
  color: var(--ink);
}

.link {
  position: absolute;
  top: 2.6875rem;
  right: 0;
  width: calc(50% - 24px);
  height: 5px;
  border-radius: 3px;
  background: var(--track);
  box-shadow: inset 0 0 0 1px var(--rim-lo);
}

.link.current {
  background: var(--liquid-hi);
}

.heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.625rem;
}

.company {
  margin: 0;
  color: var(--ink);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.company-link {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
}

.company-link :deep(svg) {
  color: var(--s-muted);
}

.company-link:hover :deep(svg),
.company-link:focus-visible :deep(svg) {
  color: var(--accent);
}

.now {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
}

.period {
  flex-basis: 100%;
  color: var(--s-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.title {
  margin: 0;
  color: var(--ink-2);
  font-size: 0.9375rem;
  font-weight: 500;
}

@media (min-width: 860px) {
  .period {
    flex-basis: auto;
    margin-left: auto;
  }

  .work {
    --rail-w: 9.5rem;
  }

  .rail {
    left: calc(50% - 6px);
  }

  .job {
    grid-template-columns: minmax(0, 1fr) var(--rail-w) minmax(0, 1fr);
  }

  .mid {
    grid-column: 2;
  }

  .card {
    grid-column: 3;
  }

  /* Pull each row up so cards interleave; same-side cards stay >= 2.5rem apart. */
  .job + .job {
    margin-top: -4rem;
  }

  .job.left .card {
    grid-column: 1;
  }

  .job.left .link {
    right: auto;
    left: 0;
  }
}
</style>
