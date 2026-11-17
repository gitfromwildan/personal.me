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
    return `${n * 0.0048}em ${n * 0.0052}em 0 color-mix(in srgb, var(--gnum-side) ${alpha}%, transparent)`;
  });
  return [...steps, "0.03em 0.1em 0.045em var(--gnum-shadow)"].join(", ");
});
</script>

<template>
  <span
    class="glass-text"
    :class="{ gloss }"
    :data-text="text"
    :style="{ '--extrusion': extrusion }"
  >
    {{ text }}
  </span>
</template>

<style scoped>
.glass-text {
  position: relative;
  display: inline-block;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  color: transparent;
  background: linear-gradient(180deg, var(--gnum-top), var(--gnum-mid) 50%, var(--gnum-bot));
  background-clip: text;
}

/* The extrusion sits in a pseudo-element: on the face itself, text-shadow would paint over the gradient. */
.glass-text::before,
.glass-text.gloss::after {
  content: attr(data-text) / "";
  position: absolute;
  inset: 0;
}

.glass-text::before {
  z-index: -1;
  text-shadow: var(--extrusion);
}

/* A hard-edged highlight across the upper third of the glyphs. */
.glass-text.gloss::after {
  background: linear-gradient(180deg, var(--gloss) 36%, transparent 37%);
  background-clip: text;
}
</style>
