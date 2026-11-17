<script setup lang="ts">
// `as="h2"` makes the eyebrow the section's heading, for sections with no other title.
withDefaults(defineProps<{ index: string; label: string; as?: "p" | "h2" }>(), { as: "p" });
</script>

<template>
  <component :is="as" class="mono-label eyebrow">
    <span class="index">{{ index }}</span>
    {{ label }}
  </component>
</template>

<style scoped>
.eyebrow {
  display: flex;
  gap: 0.75rem;
  padding-inline: 0.5rem;
}

.index {
  color: var(--accent);
  font-weight: 600;
  letter-spacing: 0;
}
</style>
