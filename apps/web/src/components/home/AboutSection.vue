<script setup lang="ts">
import { DATA } from "../../data";
import AppIcon from "../ui/AppIcon.vue";
import GlassText from "../ui/GlassText.vue";
import SectionEyebrow from "../ui/SectionEyebrow.vue";
</script>

<template>
  <section id="about" class="section container" aria-labelledby="about-title">
    <SectionEyebrow id="about-title" as="h2" :label="DATA.ui.eyebrows.about" />

    <div class="glass panel">
      <span class="bar" aria-hidden="true" />

      <div class="story">
        <p class="lead">{{ DATA.about.lead }}</p>
        <p class="body">{{ DATA.about.body }}</p>
        <div class="footer">
          <p class="signature">— {{ DATA.name }} · {{ DATA.location }}</p>
          <a
            class="glass chip now"
            :href="DATA.work[0].href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="dot" aria-hidden="true" />
            {{ DATA.about.now }}
            <AppIcon name="arrow-up-right" :size="14" />
          </a>
        </div>
      </div>

      <div class="board">
        <div>
          <h3 class="mono-label">{{ DATA.about.owned.label }}</h3>
          <ul class="rows divided">
            <li v-for="system in DATA.about.owned.systems" :key="system">
              <AppIcon name="check" :size="15" />
              {{ system }}
            </li>
          </ul>
        </div>
        <div class="stayed-up">
          <h3 class="mono-label">{{ DATA.about.owned.stayedUpLabel }}</h3>
          <p>{{ DATA.about.owned.stayedUp.join(" · ") }}</p>
        </div>
      </div>

      <span class="quote-mark" aria-hidden="true">
        <GlassText text="“" />
      </span>
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  gap: 4rem;
  padding: 5.75rem 3.5rem 3.5rem 4.5rem;
}

.bar {
  position: absolute;
  top: 5.75rem;
  left: 2.5rem;
  width: 6px;
  height: 16.4rem;
  border-radius: 3px;
  background:
    linear-gradient(var(--gloss), var(--gloss)) 1.5px 0 / 1.5px 100% no-repeat,
    linear-gradient(180deg, var(--liquid-lo), var(--liquid-hi));
}

.story {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lead {
  margin: 0;
  color: var(--ink);
  font-size: clamp(1.375rem, 3vw, 1.875rem);
  font-weight: 600;
  letter-spacing: -0.027em;
  line-height: 1.27;
}

.body {
  margin: 0;
  max-width: 35rem;
  color: var(--ink-2);
  font-size: 1.125rem;
  line-height: 1.6;
}

.footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
}

.signature {
  margin: 0;
  color: var(--s-muted);
  font-size: 0.9375rem;
}

.now {
  padding: 0.5625rem 0.875rem 0.5625rem 0.75rem;
  color: var(--ink);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.board {
  flex: none;
  width: 18rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}

.mono-label {
  font-size: 0.75rem;
  font-weight: 400;
}

.rows {
  padding: 0.625rem 0 0;
}

.rows li {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding-block: 0.875rem;
  color: var(--ink-2);
  font-size: 0.9375rem;
  font-weight: 500;
}

.rows li svg {
  flex: none;
  color: var(--s-muted);
}

.stayed-up {
  border-top: 1px solid var(--glass-line);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
}

.stayed-up p {
  margin: 0;
  color: var(--ink-2);
  font-size: 0.9375rem;
  font-weight: 500;
}

.quote-mark {
  position: absolute;
  top: -58px;
  left: 92px;
  z-index: 3;
  font-size: 230px;
  line-height: 1;
  pointer-events: none;
}

@media (max-width: 860px) {
  .panel {
    flex-direction: column;
    gap: 2rem;
    padding: 4.5rem 1.5rem 2rem;
  }

  .bar {
    display: none;
  }

  .board {
    width: 100%;
  }

  .quote-mark {
    top: -2.5rem;
    left: 1.5rem;
    font-size: 8rem;
  }
}
</style>
