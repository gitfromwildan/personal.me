<script setup lang="ts">
import { ago } from "../../format";
import { computed } from "vue";
import { DATA } from "../../data";
import { githubUrl, loadGithub, repos } from "../../composables/useGithub";
import AppIcon from "../ui/AppIcon.vue";
import SectionEyebrow from "../ui/SectionEyebrow.vue";

loadGithub();

// GitHub's own language colours; anything else gets a neutral dot.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  Rust: "#C2703F",
  JavaScript: "#F1E05A",
  Vue: "#41B883",
};

const cards = computed(() =>
  DATA.projects.repos.map((name) => {
    const repo = repos.value[name];
    return {
      name,
      url: repo?.url ?? githubUrl(name),
      repo,
      color: LANGUAGE_COLORS[repo?.language ?? ""] ?? "var(--color-s-muted)",
    };
  }),
);

// The first repo is the featured glass card; the rest share one glass panel.
const groups = computed(() => [
  { featured: true, cards: cards.value.slice(0, 1) },
  { featured: false, cards: cards.value.slice(1) },
]);
</script>

<template>
  <section id="projects" class="section container pt-7 pb-12" aria-labelledby="projects-title">
    <header class="flex max-w-160 flex-col gap-4">
      <SectionEyebrow :label="DATA.ui.eyebrows.projects" />
      <h2
        id="projects-title"
        class="mt-3.5 px-2 text-[clamp(2rem,5vw,3rem)] leading-[1.05] font-semibold tracking-[-0.033em] text-ink"
      >
        {{ DATA.projects.title }}
      </h2>
      <p class="-mt-2 px-2 text-[1.0625rem] leading-[1.55] text-s-muted">
        {{ DATA.projects.sub }}
      </p>
    </header>

    <!-- The list's hairlines sit on top of each card after the first, not under each but the
         last (divide-y): the cards are spread apart, and the line belongs to the card below. -->
    <div class="mt-4.5 grid gap-6 md:grid-cols-[1.04fr_1fr]">
      <ul
        v-for="group in groups"
        :key="group.featured ? 'featured' : 'list'"
        class="glass"
        :class="{
          'flex flex-col justify-between px-9 py-3.5 *:border-glass-line *:not-first:border-t':
            !group.featured,
        }"
      >
        <li v-for="card in group.cards" :key="card.name">
          <a
            class="flex min-w-0 flex-col"
            :class="{
              'transition-transform duration-200 ease-[ease] hover:-translate-y-[3px]':
                group.featured,
            }"
            :href="card.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <!-- The height attribute holds the place before the picture arrives; the ratio
                 sizes it. -->
            <img
              v-if="group.featured"
              class="mx-3 mt-3 aspect-[535/323] h-auto w-[calc(100%-1.5rem)] rounded-[22px] object-cover object-top"
              :src="DATA.projects.preview"
              alt=""
              width="1070"
              height="646"
              loading="lazy"
              decoding="async"
            />
            <div
              class="flex flex-col"
              :class="group.featured ? 'gap-3.5 px-5 pt-6 pb-4.5' : 'gap-3 py-6'"
            >
              <h3
                class="flex items-center justify-between gap-3 font-mono font-semibold tracking-[-0.02em] wrap-anywhere text-ink"
                :class="group.featured ? 'text-lg' : 'text-base'"
              >
                {{ card.name }}
                <AppIcon name="arrow-up-right" :size="group.featured ? 18 : 16" />
              </h3>
              <template v-if="card.repo">
                <p
                  v-if="card.repo.description"
                  class="muted-text"
                  :class="{ 'text-base leading-[1.6] text-ink-2': group.featured }"
                >
                  {{ card.repo.description }}
                </p>
                <p
                  class="flex flex-wrap items-center gap-x-4.5 gap-y-2 font-mono text-xs text-s-muted"
                >
                  <span
                    v-if="card.repo.language"
                    class="inline-flex items-center gap-1.75 font-sans text-[0.8125rem] text-ink-2"
                  >
                    <span
                      class="size-[9px] rounded-full"
                      :style="{ background: card.color }"
                      aria-hidden="true"
                    />
                    {{ card.repo.language }}
                  </span>
                  <span
                    class="inline-flex items-center gap-1.25"
                    :title="`${card.repo.stars} ${DATA.ui.projects.stars}`"
                  >
                    <AppIcon name="star" :size="13" />{{ card.repo.stars
                    }}<span class="sr-only"> {{ DATA.ui.projects.stars }}</span>
                  </span>
                  <span
                    class="inline-flex items-center gap-1.25"
                    :title="`${card.repo.forks} ${DATA.ui.projects.forks}`"
                  >
                    <AppIcon name="git-fork" :size="13" />{{ card.repo.forks
                    }}<span class="sr-only"> {{ DATA.ui.projects.forks }}</span>
                  </span>
                  <span>{{ DATA.ui.projects.lastCommit }} · {{ ago(card.repo.pushedAt) }}</span>
                </p>
              </template>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
