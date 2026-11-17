<script setup lang="ts">
import { ref } from "vue";
import { useInView } from "../../composables/useInView";

// A horizontal glass tube filled to `value` percent, with a bead at the level. Each time it is
// scrolled into view the liquid pours in from the left, as water fills a tube.
defineProps<{ value: number; label: string }>();

const meter = ref<HTMLElement | null>(null);
// In view from a little above the foot of the window, so a tube starts empty while it is still
// at the edge.
const inView = useInView(meter, "0px 0px -8% 0px");
</script>

<template>
  <div
    ref="meter"
    class="meter"
    :class="{ pour: inView }"
    role="meter"
    :aria-label="label"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
    :style="{ '--value': `${value}%` }"
  >
    <span class="glass track"><span class="liquid" /></span>
    <span class="level"><span class="bead" /></span>
  </div>
</template>

<style scoped>
.meter {
  /* How far the liquid reaches back past the start of the tube, out of sight: the room it has
     to run past its level without leaving the start of the tube dry. */
  --slack: 12px;
  position: relative;
  height: 18px;
}

.track {
  --glass-radius: 5px;
  --glass-blur: 5px;
  --glass-elevation: 0 4px 10px;
  position: absolute;
  inset: 4px 0;
  overflow: hidden;
  background: var(--track);
}

/* The liquid and the level are the same width, so sliding either by its own width takes it
   from empty to full. They are slid, not resized: that costs the page nothing. */
.liquid,
.level {
  position: absolute;
  inset: 0 auto 0 calc(-1 * var(--slack));
  width: calc(var(--value) + var(--slack));
}

.liquid {
  overflow: hidden;
  /* The glint along the top, the shade where a round tube's liquid is deepest, the liquid. */
  background:
    linear-gradient(var(--gloss), var(--gloss)) calc(5px + var(--slack)) 2px /
      calc(100% - 14px - var(--slack)) 2px no-repeat,
    linear-gradient(180deg, transparent 50%, light-dark(#064e3b40, #00000059)),
    linear-gradient(90deg, var(--liquid-hi), var(--liquid-lo));
}

/* A band of light that crosses the liquid once it has settled, as on wet glass. */
.liquid::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 30%, var(--gloss) 50%, transparent 70%);
  translate: -100%;
}

.level {
  pointer-events: none;
}

.bead {
  --bead-ring: var(--accent);
  position: absolute;
  top: 0;
  right: -9px;
}

/* Only once the page is awake (see style.css): held at its first step, the tube would sit
   empty. The liquid rushes in, runs a little past its level and settles back, as water does. */
:root.awake .pour :is(.liquid, .level) {
  animation: pour 1.9s both;
}

:root.awake .pour .liquid::after {
  animation: glint 1.2s 1.3s ease-in-out both;
}

@keyframes pour {
  from {
    translate: -100%;
    animation-timing-function: cubic-bezier(0.2, 0.75, 0.25, 1);
  }
  70% {
    translate: 8px;
    animation-timing-function: ease-in-out;
  }
  86% {
    translate: -3px;
    animation-timing-function: ease-in-out;
  }
  to {
    translate: 0;
  }
}

@keyframes glint {
  to {
    translate: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  :root.awake .pour :is(.liquid, .level),
  :root.awake .pour .liquid::after {
    animation: none;
  }
}
</style>
