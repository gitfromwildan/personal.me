<script setup lang="ts">
import { ago } from "../../format";
import { computed } from "vue";
import { DATA } from "../../data/resume";
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
      color: LANGUAGE_COLORS[repo?.language ?? ""] ?? "var(--s-muted)",
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
  <section id="projects" class="section container projects" aria-labelledby="projects-title">
    <header class="header">
      <SectionEyebrow label="Open source" />
      <h2 id="projects-title" class="title">{{ DATA.projects.title }}</h2>
      <p class="sub">{{ DATA.projects.sub }}</p>
    </header>

    <div class="grid">
      <ul
        v-for="group in groups"
        :key="group.featured ? 'featured' : 'list'"
        class="glass"
        :class="group.featured ? 'featured' : 'list divided'"
      >
        <li v-for="card in group.cards" :key="card.name">
          <a class="card" :href="card.url" target="_blank" rel="noopener noreferrer">
            <img v-if="group.featured" class="preview" :src="DATA.projects.preview" alt="" />
            <div class="body">
              <h3 class="name">
                {{ card.name }}
                <AppIcon name="arrow-up-right" :size="group.featured ? 18 : 16" />
              </h3>
              <template v-if="card.repo">
                <p v-if="card.repo.description" class="muted-text description">
                  {{ card.repo.description }}
                </p>
                <p class="meta">
                  <span v-if="card.repo.language" class="lang">
                    <span class="lang-dot" :style="{ background: card.color }" aria-hidden="true" />
                    {{ card.repo.language }}
                  </span>
                  <span class="stat" :title="`${card.repo.stars} stars`">
                    <AppIcon name="star" :size="13" />{{ card.repo.stars
                    }}<span class="visually-hidden"> stars</span>
                  </span>
                  <span class="stat" :title="`${card.repo.forks} forks`">
                    <AppIcon name="git-fork" :size="13" />{{ card.repo.forks
                    }}<span class="visually-hidden"> forks</span>
                  </span>
                  <span>last commit · {{ ago(card.repo.pushedAt) }}</span>
                </p>
              </template>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.projects {
  padding-block: 1.75rem 3rem;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 40rem;
}

.title {
  margin: 0.875rem 0 0;
  padding-inline: 0.5rem;
  color: var(--ink);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.033em;
  line-height: 1.05;
}

.sub {
  margin: -0.5rem 0 0;
  padding-inline: 0.5rem;
  color: var(--s-muted);
  font-size: 1.0625rem;
  line-height: 1.55;
}

.grid {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.125rem;
}

.featured,
.list {
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.875rem 2.25rem;
}

.card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.featured .card {
  transition: transform 0.2s;
}

.featured .card:hover {
  transform: translateY(-3px);
}

.preview {
  aspect-ratio: 535 / 323;
  margin: 0.75rem 0.75rem 0;
  width: calc(100% - 1.5rem);
  border-radius: 22px;
  object-fit: cover;
  object-position: top;
}

.list .body {
  padding-inline: 0;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
}

.name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.125rem;
  margin: 0;
  color: var(--s-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.lang {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  color: var(--ink-2);
  font-family: var(--font-sans);
  font-size: 0.8125rem;
}

.lang-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
}

.featured .body {
  gap: 0.875rem;
  padding: 1.5rem 1.25rem 1.125rem;
}

.featured .name {
  font-size: 1.125rem;
}

.featured .description {
  color: var(--ink-2);
  font-size: 1rem;
  line-height: 1.6;
}

@media (min-width: 860px) {
  .grid {
    grid-template-columns: 1.04fr 1fr;
  }
}
</style>
