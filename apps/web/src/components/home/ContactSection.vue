<script setup lang="ts">
import { linkTarget } from "../../links";
import { DATA } from "../../data/resume";
import AppIcon from "../ui/AppIcon.vue";
import SectionEyebrow from "../ui/SectionEyebrow.vue";

const { title, body, cta, social } = DATA.contact;
</script>

<template>
  <section id="contact" class="section container" aria-labelledby="contact-title">
    <div class="glass panel">
      <div class="copy">
        <SectionEyebrow index="05" label="Contact" />
        <h2 id="contact-title" class="title">{{ title }}</h2>
        <p class="body">{{ body }}</p>
        <a class="btn solid" :href="social.Threads.url" target="_blank" rel="noopener noreferrer">
          {{ cta }}
          <AppIcon name="arrow-up-right" />
        </a>
      </div>

      <ul class="channels divided">
        <li v-for="c in Object.values(social)" :key="c.name">
          <a class="channel" :href="c.url" v-bind="linkTarget(c.url)">
            <AppIcon :name="c.icon" :size="18" />
            <span class="name">{{ c.name }}</span>
            <span class="handle">{{ c.handle }}</span>
            <AppIcon name="arrow-up-right" :size="14" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.panel {
  --glass-radius: 40px;
  display: flex;
  align-items: flex-end;
  gap: 4.5rem;
  padding: 4rem;
}

.copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.625rem;
  min-width: 0;
}

.title {
  margin: 0;
  color: var(--ink);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 600;
  letter-spacing: -0.0375em;
  line-height: 1.015;
}

.body {
  max-width: 28.75rem;
  margin: 0;
  color: var(--ink-2);
  font-size: 1.125rem;
  line-height: 1.55;
}

.channels {
  flex: none;
  width: 25rem;
}

.channel {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding-block: 1.125rem;
  color: var(--ink);
  text-decoration: none;
}

.name {
  flex: none;
  width: 5.625rem;
  font-size: 0.9375rem;
  font-weight: 500;
}

.handle {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--s-muted);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.channel:hover .handle {
  color: var(--ink);
}

@media (max-width: 860px) {
  .panel {
    flex-direction: column;
    align-items: stretch;
    gap: 2.5rem;
    padding: 2rem 1.5rem;
  }

  .channels {
    width: 100%;
  }
}
</style>
