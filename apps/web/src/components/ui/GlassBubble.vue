<script setup lang="ts">
import { useId } from "vue";

// A water bubble drawn as SVG and brought to life with CSS: it bobs, its skin wobbles like
// water, and its highlight drifts. Size it with width; `--pace` (seconds) and `--phase`
// (0 to 1) let neighbours move out of step.
const id = useId();
</script>

<template>
  <svg
    class="bubble aspect-square overflow-visible drop-shadow-[0_0.5rem_1rem_var(--color-glass-shadow)]"
    viewBox="-52 -52 104 104"
    aria-hidden="true"
  >
    <defs>
      <radialGradient :id="`${id}-body`" cx="0.34" cy="0.28" r="0.675">
        <stop offset="0" stop-color="var(--color-bubble-core)" />
        <stop offset="0.2" stop-color="var(--color-bubble-mid)" />
        <stop offset="0.58" stop-color="var(--color-bubble-mid)" />
        <stop offset="1" stop-color="var(--color-bubble-edge)" />
      </radialGradient>
      <linearGradient :id="`${id}-rim`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--color-rim-hi)" />
        <stop offset="1" stop-color="var(--color-rim-lo)" />
      </linearGradient>
      <radialGradient :id="`${id}-caustic`">
        <stop offset="0" stop-color="var(--color-bubble-edge)" />
        <stop offset="1" stop-color="var(--color-bubble-edge)" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- Not quite round, so the wobble shows in the outline. -->
    <path
      class="skin transform-fill origin-center stroke-[0.8]"
      :fill="`url(#${id}-body)`"
      :stroke="`url(#${id}-rim)`"
      d="M0 -46C10.4 -45.8 22.7 -38.2 30.5 -30.5C38.4 -22.9 47.1 -10.3 47.2 0C47.3 10.3 39.3 23.6 31.4 31.4C23.5 39.2 10.3 46.8 0 46.6C-10.3 46.4 -22.4 38 -30.3 30.3C-38.2 22.5 -47.2 10.3 -47.4 0C-47.6 -10.3 -39.6 -24 -31.7 -31.7C-23.8 -39.3 -10.4 -46.2 0 -46Z"
    />
    <ellipse
      class="transform-fill origin-center"
      :fill="`url(#${id}-caustic)`"
      cx="0"
      cy="35"
      rx="23"
      ry="7"
    />
    <ellipse
      class="shine transform-fill origin-center fill-bubble-hi"
      cx="-17"
      cy="-27"
      rx="13"
      ry="7"
      transform="rotate(-24 -17 -27)"
    />
  </svg>
</template>

<style scoped>
@reference "../../style.css";

.bubble {
  --pace: 7s;
  --phase: 0;
  animation: bob var(--pace) ease-in-out calc(var(--phase) * var(--pace) * -1) infinite;
}

.skin {
  animation: wobble calc(var(--pace) * 0.62) ease-in-out calc(var(--phase) * var(--pace) * -1)
    infinite;
}

.shine {
  animation: drift calc(var(--pace) * 0.62) ease-in-out calc(var(--phase) * var(--pace) * -1)
    infinite;
}

.bubble,
.skin,
.shine {
  @variant motion-reduce {
    animation: none;
  }
}

/* Rises and sinks, leaning a little as it goes. */
@keyframes bob {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-9%) rotate(3deg);
  }
}

/* The skin bulges one way, then another: wide, tall, and across each diagonal. */
@keyframes wobble {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  20% {
    transform: scale(1.05, 0.95) rotate(4deg) skewX(2deg);
  }
  40% {
    transform: scale(0.96, 1.05) rotate(-3deg) skewY(-2deg);
  }
  60% {
    transform: scale(1.03, 0.98) rotate(-6deg) skewX(-3deg);
  }
  80% {
    transform: scale(0.98, 1.03) rotate(2deg) skewY(3deg);
  }
}

/* The highlight slides over the skin as it moves. */
@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(6%, 10%) scale(0.9, 1.1);
    opacity: 0.8;
  }
}
</style>
