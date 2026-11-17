<script setup lang="ts">
// The trail to the current page. The last item is the page itself and is not a link.
import { DATA } from "../../data";

defineProps<{ items: { label: string; to?: string }[] }>();
</script>

<template>
  <nav :aria-label="DATA.ui.breadcrumb">
    <ol class="mono-label plain trail">
      <li v-for="(item, i) in items" :key="item.label">
        <RouterLink v-if="item.to" :to="item.to">{{ item.label }}</RouterLink>
        <span v-else class="current" aria-current="page">{{ item.label }}</span>
        <span v-if="i < items.length - 1" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.trail {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  padding-inline: 0.5rem;
}

li {
  display: flex;
  gap: 0.625rem;
}

a {
  text-decoration: none;
}

a:hover,
.current {
  color: var(--ink);
}

.current {
  font-weight: 600;
}
</style>
