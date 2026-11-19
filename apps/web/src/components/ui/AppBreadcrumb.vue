<script setup lang="ts">
// The trail to the current page. The last item is the page itself and is not a link. `flush`
// drops its inset, where it lines up with a title below it.
import { DATA } from "../../data";

defineProps<{ items: { label: string; to?: string }[]; flush?: boolean }>();
</script>

<template>
  <nav :aria-label="DATA.ui.breadcrumb">
    <ol class="mono-label plain flex flex-wrap gap-2.5" :class="{ 'px-2': !flush }">
      <li v-for="(item, i) in items" :key="item.label" class="flex gap-2.5">
        <RouterLink v-if="item.to" :to="item.to" class="hover:text-ink">{{
          item.label
        }}</RouterLink>
        <span v-else class="font-semibold text-ink" aria-current="page">{{ item.label }}</span>
        <span v-if="i < items.length - 1" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>
