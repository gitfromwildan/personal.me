<script setup lang="ts">
import { posts } from "virtual:posts";
import PostCard from "../components/blog/PostCard.vue";
import AppBreadcrumb from "../components/ui/AppBreadcrumb.vue";
import GlassText from "../components/ui/GlassText.vue";
import GlassTube from "../components/ui/GlassTube.vue";
import PageBlobs from "../components/ui/PageBlobs.vue";
import { DATA } from "../data";
import { shortDate } from "../format";

const { title, tagline, endNote } = DATA.blog;
const [home] = DATA.navbar;

// The page-wide colour blobs. The first sits behind the title, wherever the column starts.
const blobs = [
  {
    color: "--blob-c",
    width: "min(600px, 80%)",
    height: 260,
    top: 96,
    left: "max(0px, 50% - 650px)",
  },
  { color: "--blob-a", width: 560, top: 520, right: -200 },
  { color: "--blob-b", width: 560, top: 640, left: -260 },
];
</script>

<template>
  <main class="stage">
    <PageBlobs :blobs="blobs" />

    <header class="container header">
      <AppBreadcrumb :items="[{ label: home.label, to: home.href }, { label: title }]" />
      <h1 class="heading"><GlassText :text="title" :depth="9" gloss /></h1>
      <div class="meta">
        <p class="tagline">{{ tagline }}</p>
        <p v-if="posts[0]" class="glass mono-label stat">
          <span class="dot" />
          Latest {{ shortDate(posts[0].date) }}
        </p>
      </div>
    </header>

    <div class="container archive">
      <div class="posts">
        <span class="rail" aria-hidden="true">
          <GlassTube :fill="1 / (posts.length + 1)" />
        </span>
        <ol class="post-list">
          <!-- The rail's liquid reaches the newest post, which is the first one. -->
          <li v-for="(post, i) in posts" :key="post.slug" :class="{ newest: i === 0 }">
            <span class="bead" aria-hidden="true" />
            <span class="link" aria-hidden="true" />
            <PostCard :post="post" />
          </li>
        </ol>
      </div>

      <p class="mono-label plain end">{{ endNote }}</p>
    </div>
  </main>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  gap: 1.375rem;
  padding-top: 4.5rem;
}

.heading {
  margin: 0;
  padding-bottom: 1rem;
  font-size: clamp(5rem, 14vw, 8.25rem);
  letter-spacing: -0.042em;
  line-height: 1;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding-left: 0.5rem;
}

.tagline {
  max-width: 40rem;
  margin: 0;
  color: var(--ink-2);
  font-size: 1.375rem;
  letter-spacing: -0.014em;
  line-height: 1.45;
}

.stat {
  --glass-radius: 999px;
  --glass-elevation: 0 20px 44px;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.875rem;
  color: var(--ink);
  font-size: 0.75rem;
}

/* The rail's geometry: the column's width and where the tube's centre line runs in it. */
.archive {
  --rail-w: 4.5rem;
  --rail-x: 2.25rem;
  /* Beads sit this far below the top of their card: the centre of a card of the usual height. */
  --bead-y: 4.125rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-block: 2.75rem 2.5rem;
}

.posts {
  position: relative;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-list li {
  position: relative;
  padding-left: var(--rail-w);
}

/* From the first bead to 28px past the last one, for a last card of the usual 8.25rem height. */
.rail {
  position: absolute;
  top: var(--bead-y);
  bottom: calc(8.25rem - var(--bead-y) - 28px);
  left: calc(var(--rail-x) - 6px);
  z-index: -1;
}

.bead {
  --bead-size: 22px;
  position: absolute;
  top: calc(var(--bead-y) - 11px);
  left: calc(var(--rail-x) - 11px);
}

.link {
  position: absolute;
  top: calc(var(--bead-y) - 3px);
  left: var(--rail-x);
  z-index: -1;
  width: calc(var(--rail-w) - var(--rail-x));
  height: 6px;
  border-radius: 3px;
  background: var(--track);
}

.newest .bead {
  --bead-ring: var(--accent);
}

.newest .link {
  background: var(--liquid-hi);
}

.end {
  padding-left: var(--rail-w);
}

@media (max-width: 860px) {
  .header {
    padding-top: 3.5rem;
  }

  .tagline {
    font-size: 1.125rem;
  }

  .archive {
    --rail-w: 2.25rem;
    --rail-x: 0.6875rem;
  }
}
</style>
