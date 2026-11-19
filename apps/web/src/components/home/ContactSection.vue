<script setup lang="ts">
import { linkTarget } from "../../links";
import { DATA } from "../../data";
import AppIcon from "../ui/AppIcon.vue";
import SectionEyebrow from "../ui/SectionEyebrow.vue";

const { title, body, cta, social } = DATA.contact;
</script>

<template>
  <section id="contact" class="section container" aria-labelledby="contact-title">
    <div
      class="glass flex items-end gap-18 rounded-[40px] p-16 max-md:flex-col max-md:items-stretch max-md:gap-8 max-md:px-6 max-md:py-8"
    >
      <div class="flex min-w-0 flex-1 flex-col items-start gap-6.5">
        <SectionEyebrow :label="DATA.ui.eyebrows.contact" flush />
        <h2
          id="contact-title"
          class="text-[clamp(2.5rem,6vw,4rem)] leading-[1.015] font-semibold tracking-[-0.0375em] text-ink"
        >
          {{ title }}
        </h2>
        <p class="max-w-115 text-lg leading-[1.55] text-ink-2">{{ body }}</p>
        <a class="btn solid" :href="social.Threads.url" target="_blank" rel="noopener noreferrer">
          {{ cta }}
          <AppIcon name="arrow-up-right" />
        </a>
      </div>

      <!-- On one column, the panel's own gap and padding already space the list's two ends. -->
      <ul class="w-100 flex-none divide-y divide-glass-line max-md:w-full">
        <li v-for="c in Object.values(social)" :key="c.name">
          <a
            class="group flex items-center gap-3.5 py-4.5 text-ink max-md:gap-3 max-md:py-3.5 max-md:[li:first-child>&]:pt-0 max-md:[li:last-child>&]:pb-0"
            :href="c.url"
            v-bind="linkTarget(c.url)"
          >
            <AppIcon :name="c.icon" :size="18" />
            <span class="w-22.5 flex-none text-[0.9375rem] font-medium max-md:w-19">
              {{ c.name }}
            </span>
            <span
              class="min-w-0 flex-1 font-mono text-[0.8125rem] wrap-anywhere text-s-muted group-hover:text-ink"
            >
              {{ c.handle }}
            </span>
            <AppIcon name="arrow-up-right" :size="14" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
