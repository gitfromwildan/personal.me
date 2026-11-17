<script setup lang="ts">
import { DATA } from "../../data/resume";
import GlassMeter from "../ui/GlassMeter.vue";
import SectionEyebrow from "../ui/SectionEyebrow.vue";

const groups = Object.entries(DATA.skills);
</script>

<template>
  <section id="skills" class="section container skills" aria-labelledby="skills-title">
    <SectionEyebrow id="skills-title" as="h2" label="Skills" />

    <span class="blob blob-a" aria-hidden="true" />
    <span class="blob blob-b" aria-hidden="true" />

    <div class="groups">
      <section v-for="[title, skills] in groups" :key="title" class="group" :aria-label="title">
        <div class="glass bar">
          <h3>{{ title }}</h3>
          <span class="glass chip mono-label plain count">{{ skills.length }} skills</span>
        </div>
        <ul class="list">
          <li v-for="skill in skills" :key="skill.name" class="skill">
            <div class="head">
              <span class="name">{{ skill.name }}</span>
              <span class="percent">{{ skill.percentage }}%</span>
            </div>
            <GlassMeter :value="skill.percentage" :label="skill.name" />
            <p class="muted-text">{{ skill.description }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<style scoped>
.skills {
  z-index: 22;
  gap: 2rem;
}

.blob {
  top: 1.875rem;
  width: 430px;
  height: 200px;
  --blob-blur: 45px;
}

.blob-a {
  left: -2%;
  background: var(--blob-c);
}

.blob-b {
  right: -12%;
  background: var(--blob-a);
}

.groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4rem;
  padding-inline: 0.5rem;
}

.group {
  min-width: 0;
}

.bar {
  --glass-radius: 22px;
  --glass-elevation: 0 18px 40px;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-height: 4.1875rem;
  padding: 0.75rem 1.5rem;
}

.bar h3 {
  margin: 0;
  color: var(--ink);
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.count {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  white-space: nowrap;
}

.skill {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-top: 1.375rem;
}

.head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--ink);
}

.name {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.percent {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 860px) {
  .groups {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.5rem;
  }

  .blob {
    display: none;
  }

  .bar h3 {
    font-size: 1.125rem;
  }

  .name {
    font-size: 1rem;
  }

  .percent {
    font-size: 0.8125rem;
  }

  .skill .muted-text {
    font-size: 0.875rem;
  }
}
</style>
