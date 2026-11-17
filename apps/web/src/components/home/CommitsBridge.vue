<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import GlassText from "../ui/GlassText.vue";
import GlassTube from "../ui/GlassTube.vue";
import { DATA } from "../../data/resume";
import { commitCount, loadGithub } from "../../composables/useGithub";

loadGithub();

const githubUrl = DATA.contact.social.GitHub.url;
const number = computed(() => commitCount.value?.toLocaleString("en-US"));
</script>

<template>
  <section class="bridge" aria-label="GitHub commits">
    <span class="blob glow" aria-hidden="true" />
    <span class="link"><GlassTube from="bottom" /></span>
    <p class="count">
      <span class="visually-hidden">{{ number ?? "An unknown number of" }}</span>
      <GlassText :text="number ?? '—'" :depth="10" gloss aria-hidden="true" />
    </p>
    <p class="unit">commits, all-time</p>
    <a class="more" :href="githubUrl" target="_blank" rel="noopener noreferrer">
      View on GitHub <AppIcon name="arrow-up-right" :size="13" />
    </a>
    <span class="link"><GlassTube from="top" /></span>
  </section>
</template>

<style scoped>
.bridge {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
}

.glow {
  top: 4rem;
  left: 50%;
  width: min(40rem, 100%);
  height: 16rem;
  transform: translateX(-50%);
  background: var(--blob-c);
  --blob-blur: 55px;
}

.link {
  height: 4.5rem;
}

.count {
  margin: 0;
  padding-bottom: 1rem;
  line-height: 1;
  font-size: clamp(5rem, 24vw, 14.75rem);
  letter-spacing: -0.04em;
  max-width: 100%;
}

.unit {
  margin: 0;
  color: var(--ink);
  font-size: clamp(1.125rem, 4vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--s-muted);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.025em;
  text-decoration: none;
}

.more:hover {
  color: var(--ink);
}

@media (max-width: 860px) {
  .glow {
    height: 10rem;
  }
}
</style>
