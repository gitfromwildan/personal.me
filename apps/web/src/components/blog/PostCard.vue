<script setup lang="ts">
import { shortMonth } from "../../format";
import { postPath } from "../../links";
import AppIcon from "../ui/AppIcon.vue";

defineProps<{
  post: { slug: string; title: string; summary: string; date: string };
}>();
</script>

<template>
  <!-- One row: the date, the text, the arrow. Below md the card is stacked: the date and the
       arrow on top, the text under a hairline across the card. There the date is a small label
       over the title, not a figure beside it. -->
  <RouterLink
    class="glass group flex min-h-33 items-center gap-6 rounded-[26px] px-7 py-6 text-ink shadow-[0_20px_44px_var(--color-glass-shadow)] max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-3 max-md:gap-y-3.5 max-md:p-5"
    :to="postPath(post.slug)"
  >
    <time
      class="flex w-13 flex-none flex-col items-center gap-1 max-md:w-auto max-md:flex-row max-md:items-baseline max-md:gap-2"
      :datetime="post.date"
    >
      <span
        class="font-mono text-[1.375rem] leading-none font-semibold tracking-[-0.045em] text-ink-2 max-md:text-sm max-md:tracking-normal"
      >
        {{ post.date.slice(8) }}
      </span>
      <span class="mono-label text-2xs tracking-[0.11em]">{{ shortMonth(post.date) }}</span>
    </time>
    <div
      class="flex min-w-0 flex-1 flex-col gap-2 border-l border-glass-line pl-6 max-md:col-span-2 max-md:row-start-2 max-md:border-t max-md:border-l-0 max-md:pt-3.5 max-md:pl-0"
    >
      <h2 class="text-2xl leading-[1.2] font-semibold tracking-[-0.02em] max-md:text-lg">
        {{ post.title }}
      </h2>
      <p class="muted-text">{{ post.summary }}</p>
    </div>
    <span
      class="glass chip round transition-transform duration-150 ease-[ease] group-hover:translate-x-[3px] max-md:col-start-2 max-md:row-start-1 max-md:flex max-md:size-9"
    >
      <AppIcon name="arrow-right" :size="18" />
    </span>
  </RouterLink>
</template>
