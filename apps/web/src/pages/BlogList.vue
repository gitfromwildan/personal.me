<script setup lang="ts">
import { onMounted } from "vue";
import { postsIn } from "virtual:posts";
import PostCard from "../components/blog/PostCard.vue";
import AppBreadcrumb from "../components/ui/AppBreadcrumb.vue";
import GlassText from "../components/ui/GlassText.vue";
import GlassTube from "../components/ui/GlassTube.vue";
import PageBlobs from "../components/ui/PageBlobs.vue";
import { usePageTitle } from "../composables/usePageTitle";
import { DATA } from "../data";
import { i18n } from "../i18n";
import { shortDate } from "../format";
import { onFirstMove } from "../wake";

const { title, tagline, endNote } = DATA.blog;
const [home] = DATA.navbar;
// The posts in the language being shown: the page is made anew when that changes.
const posts = postsIn[i18n.global.locale.value];
usePageTitle(
  () => title,
  () => ({ page: title, title, summary: tagline }),
);
// A post is likely the next page: its heavy script is fetched ahead while this one is read, from
// the visitor's first move on, so that it is no part of loading this page.
onMounted(() => onFirstMove(() => import("../components/blog/postIsland")));

// The page-wide colour blobs. The first sits behind the title, wherever the column starts.
const blobs = [
  {
    color: "--color-blob-c",
    width: "min(600px, 80%)",
    height: 260,
    top: 96,
    left: "max(0px, 50% - 650px)",
  },
  { color: "--color-blob-a", width: 560, top: 520, right: -200 },
  { color: "--color-blob-b", width: 560, top: 640, left: -260 },
];
</script>

<template>
  <main class="stage">
    <PageBlobs :blobs="blobs" />

    <header class="container flex flex-col gap-5.5 pt-18 max-md:pt-14">
      <AppBreadcrumb :items="[{ label: home.label, to: home.href }, { label: title }]" />
      <h1 class="pb-4 text-[clamp(5rem,14vw,8.25rem)] leading-none tracking-[-0.042em]">
        <GlassText :text="title" :depth="9" gloss />
      </h1>
      <div class="flex flex-wrap items-end justify-between gap-4 pl-2">
        <p
          class="max-w-160 text-[1.375rem] leading-[1.45] tracking-[-0.014em] text-ink-2 max-md:text-lg"
        >
          {{ tagline }}
        </p>
        <p
          v-if="posts[0]"
          class="glass mono-label flex items-center gap-2.5 rounded-full px-3.5 py-2 text-xs text-ink shadow-[0_20px_44px_var(--color-glass-shadow)]"
        >
          <span class="dot" />
          {{ DATA.ui.latest }} {{ shortDate(posts[0].date) }}
        </p>
      </div>
    </header>

    <!-- The rail's geometry: the width of its column (--rail-w), where the tube's centre line
         runs in it (--rail-x), how far below the top of their card the beads sit (--bead-y: the
         centre of a card of the usual height, or below md, of the stacked card's top row, where its
         date is), and that usual height (--card-h). -->
    <div
      class="container flex flex-col gap-8 pt-11 pb-10 [--bead-y:4.125rem] [--card-h:8.25rem] [--rail-w:4.5rem] [--rail-x:2.25rem] max-md:[--rail-w:2.25rem] max-md:[--rail-x:0.6875rem] max-md:[--bead-y:2.375rem] max-md:[--card-h:9.9375rem] max-sm:[--card-h:11.4375rem]"
    >
      <div class="relative">
        <!-- From the first bead to 28px past the last one, for a last card of the usual height. -->
        <span
          class="absolute top-(--bead-y) bottom-[calc(var(--card-h)-var(--bead-y)-28px)] left-[calc(var(--rail-x)-6px)] -z-1"
          aria-hidden="true"
        >
          <GlassTube :fill="1 / (posts.length + 1)" />
        </span>
        <ol class="flex flex-col gap-8">
          <!-- The rail's liquid reaches the newest post, which is the first one. -->
          <li v-for="(post, i) in posts" :key="post.slug" class="relative pl-(--rail-w)">
            <span
              class="bead absolute top-[calc(var(--bead-y)-11px)] left-[calc(var(--rail-x)-11px)] size-5.5"
              :class="{ 'outline-accent': i === 0 }"
              aria-hidden="true"
            />
            <span
              class="absolute top-[calc(var(--bead-y)-3px)] left-(--rail-x) -z-1 h-1.5 w-[calc(var(--rail-w)-var(--rail-x))] rounded-[3px]"
              :class="i === 0 ? 'bg-liquid-hi' : 'bg-track'"
              aria-hidden="true"
            />
            <PostCard :post="post" />
          </li>
        </ol>
      </div>

      <p class="mono-label plain pl-(--rail-w)">{{ endNote }}</p>
    </div>
  </main>
</template>
