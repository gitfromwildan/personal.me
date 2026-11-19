<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
import type { ICONS } from "./icons";

// A glass tile carrying the mark of a technology: it hovers in place and a sheen scans across
// it. Its size is its parent's to give; `--tint` colours it, and `--phase` (0 to 1) lets
// neighbours move out of step.
defineProps<{ icon: keyof typeof ICONS }>();
</script>

<template>
  <!-- The mark is a share of the tile, whatever size the tile is shown at. -->
  <span class="glass tile grid place-items-center overflow-hidden text-ink-2 *:size-[46%]">
    <AppIcon :name="icon" />
  </span>
</template>

<style scoped>
@reference "../../style.css";

.tile {
  --phase: 0;
  background:
    linear-gradient(125deg, light-dark(#ffffff5c, #ffffff22) 15%, var(--color-stage-0) 37%),
    linear-gradient(140deg, var(--tint, transparent) 15%, var(--color-stage-0) 68%),
    linear-gradient(180deg, var(--color-glass-hi), var(--color-glass-lo));
  animation: hover 10s ease-in-out calc(var(--phase) * -10s) infinite;
}

/* The scanning sheen: a band of light that crosses the tile, then waits. The band is drawn
   once, three tiles wide, and slid across: sliding is work the browser does off the page's
   main thread, where redrawing it at each step is not. */
.tile::after {
  content: "";
  @apply absolute -inset-x-full inset-y-0 opacity-50;
  background: linear-gradient(115deg, transparent 42%, var(--color-gloss) 50%, transparent 58%);
  animation: scan 8s ease-in-out calc(var(--phase) * -8s) infinite;
}

.tile {
  @variant motion-reduce {
    animation: none;
  }
}

.tile::after {
  @variant motion-reduce {
    @apply hidden;
    animation: none;
  }
}

@keyframes hover {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes scan {
  0%,
  45% {
    translate: -53.33% 0;
  }
  90%,
  100% {
    translate: 53.33% 0;
  }
}
</style>
