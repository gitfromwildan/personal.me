<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
import type { ICONS } from "./icons";

// A glass tile carrying the mark of a technology: it hovers in place and a sheen scans across
// it. Its size is its parent's to give; `--tint` colours it, and `--phase` (0 to 1) lets
// neighbours move out of step.
defineProps<{ icon: keyof typeof ICONS }>();
</script>

<template>
  <span class="glass tile">
    <AppIcon :name="icon" />
  </span>
</template>

<style scoped>
.tile {
  --phase: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    linear-gradient(125deg, light-dark(#ffffff5c, #ffffff22) 15%, var(--stage-0) 37%),
    linear-gradient(140deg, var(--tint, transparent) 15%, var(--stage-0) 68%),
    linear-gradient(180deg, var(--glass-hi), var(--glass-lo));
  color: var(--ink-2);
  animation: hover 10s ease-in-out calc(var(--phase) * -10s) infinite;
}

/* The mark, at a share of the tile whatever size the tile is shown at. */
.tile :deep(svg) {
  width: 46%;
  height: 46%;
}

/* The scanning sheen: a band of light that crosses the tile, then waits. The band is drawn
   once, three tiles wide, and slid across: sliding is work the browser does off the page's
   main thread, where redrawing it at each step is not. */
.tile::after {
  content: "";
  position: absolute;
  inset: 0 -100%;
  background: linear-gradient(115deg, transparent 42%, var(--gloss) 50%, transparent 58%);
  opacity: 0.5;
  animation: scan 8s ease-in-out calc(var(--phase) * -8s) infinite;
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

@media (prefers-reduced-motion: reduce) {
  .tile,
  .tile::after {
    animation: none;
  }

  .tile::after {
    display: none;
  }
}
</style>
