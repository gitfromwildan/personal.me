<script setup lang="ts">
// `as="h2"` makes the eyebrow the section's heading, for sections with no other title.
withDefaults(defineProps<{ label: string; as?: "p" | "h2" }>(), { as: "p" });
</script>

<template>
  <component :is="as" class="mono-label eyebrow">{{ label }}</component>
</template>

<style scoped>
.eyebrow {
  padding-inline: 0.5rem;
}
</style>
