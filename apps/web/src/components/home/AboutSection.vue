<script setup lang="ts">
import { DATA } from "../../data";
import AppIcon from "../ui/AppIcon.vue";
import GlassText from "../ui/GlassText.vue";
import SectionEyebrow from "../ui/SectionEyebrow.vue";
</script>

<template>
  <section id="about" class="section container" aria-labelledby="about-title">
    <SectionEyebrow id="about-title" class="text-xs" as="h2" :label="DATA.ui.eyebrows.about" />

    <div
      class="glass flex gap-16 pt-23 pr-14 pb-14 pl-18 max-md:flex-col max-md:gap-8 max-md:px-6 max-md:pt-18 max-md:pb-8"
    >
      <span
        class="bar absolute top-23 left-10 h-[16.4rem] w-1.5 rounded-[3px] max-md:hidden"
        aria-hidden="true"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-6">
        <p
          class="text-[clamp(1.375rem,3vw,1.875rem)] leading-[1.27] font-semibold tracking-[-0.027em] text-ink"
        >
          {{ DATA.about.lead }}
        </p>
        <p class="max-w-140 text-lg leading-[1.6] text-ink-2">{{ DATA.about.body }}</p>
        <p class="pt-2 text-[0.9375rem] text-s-muted">— {{ DATA.name }} · {{ DATA.location }}</p>
      </div>

      <div class="flex w-72 flex-none flex-col justify-between gap-6 max-md:w-full">
        <div>
          <h3 class="mono-label text-xs">{{ DATA.about.owned.label }}</h3>
          <ul class="divide-y divide-glass-line pt-2.5">
            <li
              v-for="system in DATA.about.owned.systems"
              :key="system"
              class="flex items-center gap-2.5 py-3.5 text-[0.9375rem] font-medium text-ink-2"
            >
              <AppIcon class="flex-none text-s-muted" name="check" :size="15" />
              {{ system }}
            </li>
          </ul>
        </div>
        <div class="flex flex-col gap-2 border-t border-glass-line pt-4">
          <h3 class="mono-label text-xs">{{ DATA.about.owned.stayedUpLabel }}</h3>
          <p class="text-[0.9375rem] font-medium text-ink-2">
            {{ DATA.about.owned.stayedUp.join(" · ") }}
          </p>
        </div>
      </div>

      <span
        class="pointer-events-none absolute -top-[58px] left-[92px] z-3 text-[230px] leading-none max-md:-top-10 max-md:left-6 max-md:text-[8rem]"
        aria-hidden="true"
      >
        <GlassText text="“" />
      </span>
    </div>
  </section>
</template>

<style scoped>
/* A tube of liquid down the side of the story, with a glint along it. */
.bar {
  background:
    linear-gradient(var(--color-gloss), var(--color-gloss)) 1.5px 0 / 1.5px 100% no-repeat,
    linear-gradient(180deg, var(--color-liquid-lo), var(--color-liquid-hi));
}
</style>
