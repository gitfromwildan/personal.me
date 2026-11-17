<script setup lang="ts">
import { shortMonth } from "../../format";
import { postPath } from "../../links";
import AppIcon from "../ui/AppIcon.vue";

defineProps<{
  post: { slug: string; title: string; summary: string; date: string };
}>();
</script>

<template>
  <RouterLink class="glass card" :to="postPath(post.slug)">
    <time class="date" :datetime="post.date">
      <span class="day">{{ post.date.slice(8) }}</span>
      <span class="mono-label month">{{ shortMonth(post.date) }}</span>
    </time>
    <div class="text">
      <h2 class="title">{{ post.title }}</h2>
      <p class="muted-text">{{ post.summary }}</p>
    </div>
    <span class="glass chip round open"><AppIcon name="arrow-right" :size="18" /></span>
  </RouterLink>
</template>

<style scoped>
.card {
  --glass-radius: 26px;
  --glass-elevation: 0 20px 44px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-height: 8.25rem;
  padding: 1.5rem 1.75rem;
  color: var(--ink);
  text-decoration: none;
}

.date {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 3.25rem;
}

.day {
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1;
}

.month {
  font-size: 0.6875rem;
  letter-spacing: 0.11em;
}

.text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1.5rem;
  border-left: 1px solid var(--glass-line);
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.open {
  transition: transform 0.15s;
}

.card:hover .open {
  transform: translateX(3px);
}

@media (max-width: 860px) {
  .card {
    gap: 1rem;
    padding: 1.25rem;
  }

  .date {
    width: 2.5rem;
  }

  .text {
    padding-left: 1rem;
  }

  .title {
    font-size: 1.125rem;
  }

  .open {
    display: none;
  }
}
</style>
