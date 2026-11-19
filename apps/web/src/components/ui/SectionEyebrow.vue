<script setup lang="ts">
// `as="h2"` makes the eyebrow the section's heading, for sections with no other title. `flush`
// drops its inset, where it sits inside a panel and lines up with the panel's title.
withDefaults(defineProps<{ label: string; as?: "p" | "h2"; flush?: boolean }>(), { as: "p" });
</script>

<template>
  <component :is="as" class="mono-label" :class="{ 'px-2': !flush }">{{ label }}</component>
</template>
