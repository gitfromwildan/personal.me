<script setup lang="ts">
import { DATA } from "../../data";
import { postPath } from "../../links";
import AppIcon from "../ui/AppIcon.vue";

// Pagination in the shape DocuBook's docs use: a tray with a quiet link back on the left and the
// next post as a tinted block on the right. `next` is the post after this one in the archive.
defineProps<{ next?: { slug: string; title: string; summary: string } }>();

const { backLabel, nextLabel, navLabel } = DATA.blog;
const [, blog] = DATA.navbar;
</script>

<template>
  <nav class="container" :aria-label="navLabel">
    <div class="glass tray">
      <RouterLink class="back" :to="blog.href">
        <AppIcon name="arrow-left" :size="14" />
        {{ backLabel }}
      </RouterLink>

      <RouterLink v-if="next" class="next" :to="postPath(next.slug)" rel="next">
        <span class="text">
          <span class="title">{{ next.title }}</span>
          <span class="summary">{{ next.summary }}</span>
        </span>
        <span class="label">
          {{ nextLabel }}
          <AppIcon name="arrow-right" :size="14" />
        </span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
nav {
  padding-block: 0.5rem 1.5rem;
}

.tray {
  --glass-radius: 20px;
  --glass-elevation: 0 16px 36px;
  display: flex;
  gap: 4px;
  padding: 4px;
}

.back,
.next {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 4rem;
  border-radius: 16px;
  font-size: 0.875rem;
  text-decoration: none;
  transition:
    background 0.15s,
    color 0.15s,
    box-shadow 0.15s;
}

/* A third of the tray, or all of it on the last post. */
.back {
  flex: 3;
  gap: 0.375rem;
  padding-inline: 0.75rem;
  color: var(--s-muted);
}

.back:hover {
  background: var(--chip);
  color: var(--ink);
}

.next {
  flex: 7;
  justify-content: flex-end;
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  text-align: right;
}

.next:hover {
  background: color-mix(in srgb, var(--accent) 20%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent);
}

.text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding-inline: 1.25rem;
}

.title,
.summary {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title {
  font-weight: 600;
}

.summary {
  max-width: 18rem;
  margin-left: auto;
  font-size: 0.75rem;
  opacity: 0.75;
}

/* "Next" and its arrow, set off by a hairline. */
.label {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem 0.5rem 1.25rem;
  border-left: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  opacity: 0.75;
}

@media (max-width: 640px) {
  .summary {
    display: none;
  }

  /* Give the next post's title the room: the link back is only as wide as its text. */
  .back:not(:only-child) {
    flex: none;
  }

  .text {
    padding-inline: 0.75rem;
  }

  .label {
    padding-inline: 0.75rem 0.5rem;
  }
}
</style>
