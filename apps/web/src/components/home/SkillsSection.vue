<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { DATA } from "../../data";
import GlassMeter from "../ui/GlassMeter.vue";
import SectionEyebrow from "../ui/SectionEyebrow.vue";

const { t } = useI18n();
const groups = Object.entries(DATA.skills);
</script>

<template>
  <section id="skills" class="section container z-22 gap-8" aria-labelledby="skills-title">
    <SectionEyebrow id="skills-title" as="h2" :label="DATA.ui.eyebrows.skills" />

    <span
      class="blob top-7.5 -left-[2%] h-50 w-[430px] bg-blob-c blur-[45px] max-md:hidden"
      aria-hidden="true"
    />
    <span
      class="blob top-7.5 -right-[12%] h-50 w-[430px] bg-blob-a blur-[45px] max-md:hidden"
      aria-hidden="true"
    />

    <div class="grid grid-cols-2 gap-16 px-2 max-md:grid-cols-1 max-md:gap-10">
      <section v-for="[title, skills] in groups" :key="title" class="min-w-0" :aria-label="title">
        <div
          class="glass flex min-h-[4.1875rem] items-center gap-3.5 rounded-[22px] px-6 py-3 shadow-[0_18px_40px_var(--color-glass-shadow)]"
        >
          <h3 class="text-[1.375rem] font-semibold tracking-[-0.03em] text-ink max-md:text-lg">
            {{ title }}
          </h3>
          <span class="glass chip mono-label plain px-2.5 py-1 text-xs whitespace-nowrap">{{
            t("ui.skillsCount", { count: skills.length })
          }}</span>
        </div>
        <ul>
          <li v-for="skill in skills" :key="skill.name" class="flex flex-col gap-1.5 pt-5.5">
            <div class="flex justify-between gap-4 text-ink">
              <span class="text-lg font-semibold tracking-[-0.02em] max-md:text-base">
                {{ skill.name }}
              </span>
              <span class="font-mono text-sm font-medium max-md:text-[0.8125rem]">
                {{ skill.percentage }}%
              </span>
            </div>
            <GlassMeter :value="skill.percentage" :label="skill.name" />
            <p class="muted-text max-md:text-sm">{{ skill.description }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
