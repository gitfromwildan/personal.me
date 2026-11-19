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
  <nav class="container pt-2 pb-6" :aria-label="navLabel">
    <!-- On the last post the link back is all there is: a tray across the page for it alone
         would be mostly empty. -->
    <div
      class="glass flex gap-1 rounded-[20px] p-1 shadow-[0_16px_36px_var(--color-glass-shadow)]"
      :class="{ 'w-1/2': !next }"
    >
      <!-- A third of the tray, or all of the half-width one on the last post. On a phone it
           gives the next post's title the room: it is only as wide as its text. -->
      <RouterLink
        class="link flex-3 gap-1.5 px-3 text-s-muted hover:bg-chip hover:text-ink"
        :class="{ 'max-sm:flex-none': next }"
        :to="blog.href"
      >
        <AppIcon name="arrow-left" :size="14" />
        {{ backLabel }}
      </RouterLink>

      <RouterLink
        v-if="next"
        class="link flex-7 justify-end bg-accent/15 text-right text-accent hover:bg-accent/20 hover:inset-ring hover:inset-ring-accent/30"
        :to="postPath(next.slug)"
        rel="next"
      >
        <span class="flex min-w-0 flex-col px-5 max-sm:px-3">
          <span class="truncate font-semibold">{{ next.title }}</span>
          <span class="ml-auto max-w-72 truncate text-xs opacity-75 max-sm:hidden">
            {{ next.summary }}
          </span>
        </span>
        <!-- "Next" and its arrow, set off by a hairline. -->
        <span
          class="flex flex-none items-center gap-1.5 border-l border-accent/20 py-2 pr-3 pl-5 opacity-75 max-sm:pr-2 max-sm:pl-3"
        >
          {{ nextLabel }}
          <AppIcon name="arrow-right" :size="14" />
        </span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
@reference "../../style.css";

/* The link back and the next post: a block of the tray each. */
.link {
  @apply flex min-h-16 min-w-0 items-center rounded-2xl text-sm transition-[background,color,box-shadow] duration-150 ease-[ease];
}
</style>
