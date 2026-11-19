<script setup lang="ts">
import { computed } from "vue";

// Extruded glass lettering: a gradient face over a stack of offset copies. Size it with font-size.
const props = withDefaults(defineProps<{ text: string; depth?: number; gloss?: boolean }>(), {
  depth: 8,
});

// One shadow per depth step, fading with distance, then a soft cast shadow under the stack.
const extrusion = computed(() => {
  const steps = Array.from({ length: props.depth }, (_, i) => {
    const n = i + 1;
    const alpha = Math.round(80 - (n - 1) * (42 / props.depth));
    return `${n * 0.0048}em ${n * 0.0052}em 0 color-mix(in srgb, var(--color-gnum-side) ${alpha}%, transparent)`;
  });
  return [...steps, "0.03em 0.1em 0.045em var(--color-gnum-shadow)"].join(", ");
});
</script>

<template>
  <span
    class="glass-text relative inline-block bg-linear-to-b/srgb from-gnum-top via-gnum-mid to-gnum-bot bg-clip-text leading-none font-extrabold whitespace-nowrap text-transparent"
    :class="{ gloss }"
    :data-text="text"
    :style="{ '--extrusion': extrusion }"
  >
    {{ text }}
  </span>
</template>

<style scoped>
@reference "../../style.css";

/* The extrusion sits in a pseudo-element: on the face itself, text-shadow would paint over the
   gradient. */
.glass-text::before,
.glass-text.gloss::after {
  content: attr(data-text) / "";
  @apply absolute inset-0;
}

.glass-text::before {
  @apply -z-1;
  text-shadow: var(--extrusion);
}

/* A hard-edged highlight across the upper third of the glyphs. */
.glass-text.gloss::after {
  @apply bg-linear-to-b/srgb from-gloss from-36% to-transparent to-37% bg-clip-text;
}
</style>
