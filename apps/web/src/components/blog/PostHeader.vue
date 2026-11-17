<script setup lang="ts">
import { DATA } from "../../data";
import { ago, longDate } from "../../format";
import AppBreadcrumb from "../ui/AppBreadcrumb.vue";

defineProps<{ post: { title: string; summary: string; date: string } }>();

const [home, blog] = DATA.navbar;
</script>

<template>
  <header class="container header">
    <AppBreadcrumb
      :items="[
        { label: home.label, to: home.href },
        { label: blog.label, to: blog.href },
        { label: post.title },
      ]"
    />
    <h1 class="title">{{ post.title }}</h1>
    <p class="summary">{{ post.summary }}</p>
    <p class="meta">
      <img class="avatar" :src="DATA.avatarUrl" alt="" width="36" height="36" />
      <span class="author">{{ DATA.name }}</span>
      <span class="sep" aria-hidden="true" />
      <time :datetime="post.date">{{ longDate(post.date) }} ({{ ago(post.date) }})</time>
    </p>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 5.5rem;
}

/* The breadcrumb lines up with the title here: no eyebrow inset. */
.header :deep(.trail) {
  padding-inline: 0;
}

.title {
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 4rem);
  font-weight: 600;
  letter-spacing: -0.0375em;
  line-height: 1.05;
}

.summary {
  max-width: 40rem;
  margin: 0;
  color: var(--ink-2);
  font-size: 1.3125rem;
  letter-spacing: -0.01em;
  line-height: 1.52;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.875rem;
  margin: 0;
  padding-top: 0.25rem;
  color: var(--s-muted);
  font-size: 0.9375rem;
}

.author {
  color: var(--ink);
  font-weight: 600;
}

.sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--s-muted);
}

@media (max-width: 860px) {
  .header {
    padding-top: 3.5rem;
  }

  .summary {
    font-size: 1.125rem;
  }

  /* The date wraps under the author here, so the dot between them would dangle. */
  .sep {
    display: none;
  }

  time {
    flex-basis: 100%;
  }
}
</style>
