<script setup lang="ts">
import { DATA } from "../../data";
import { ago, longDate } from "../../format";
import AppBreadcrumb from "../ui/AppBreadcrumb.vue";

defineProps<{ post: { title: string; summary: string; date: string } }>();

const [home, blog] = DATA.navbar;
</script>

<template>
  <header class="container flex flex-col gap-6 pt-22 max-md:pt-14">
    <AppBreadcrumb
      flush
      :items="[
        { label: home.label, to: home.href },
        { label: blog.label, to: blog.href },
        { label: post.title },
      ]"
    />
    <h1 class="text-[clamp(2.5rem,7vw,4rem)] leading-[1.05] font-semibold tracking-[-0.0375em]">
      {{ post.title }}
    </h1>
    <p
      class="max-w-160 text-[1.3125rem] leading-[1.52] tracking-[-0.01em] text-ink-2 max-md:text-lg"
    >
      {{ post.summary }}
    </p>
    <!-- On one column the date wraps under the author, so the dot between them would dangle. -->
    <p class="flex flex-wrap items-center gap-3.5 pt-1 text-[0.9375rem] text-s-muted">
      <img class="avatar" :src="DATA.avatarUrl" alt="" width="36" height="36" />
      <span class="font-semibold text-ink">{{ DATA.name }}</span>
      <span class="size-[3px] rounded-full bg-s-muted max-md:hidden" aria-hidden="true" />
      <!-- "9mo ago" is as of the day the page was built: Vue corrects it on arrival, and is
           told here not to report the difference. -->
      <time class="max-md:basis-full" :datetime="post.date" data-allow-mismatch="text"
        >{{ longDate(post.date) }} ({{ ago(post.date) }})</time
      >
    </p>
  </header>
</template>
