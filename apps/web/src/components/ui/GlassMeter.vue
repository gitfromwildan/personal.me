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
  <!-- --slack is how far the liquid reaches back past the start of the tube, out of sight: the
       room it has to run past its level without leaving the start of the tube dry. -->
  <div
    ref="meter"
    class="meter relative h-4.5 [--slack:12px]"
    :class="{ pour: inView }"
    role="meter"
    :aria-label="label"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
    :style="{ '--value': `${value}%` }"
  >
    <span
      class="glass absolute inset-x-0 inset-y-1 overflow-hidden rounded-[5px] bg-track bg-none shadow-[0_4px_10px_var(--color-glass-shadow)] backdrop-blur-[5px]"
    >
      <span class="liquid fill-to-value overflow-hidden" />
    </span>
    <span class="level fill-to-value pointer-events-none">
      <span class="bead absolute top-0 -right-[9px] outline-accent" />
    </span>
  </div>
</template>

<style scoped>
@reference "../../style.css";

/* The liquid and the level are the same width, so sliding either by its own width takes it
   from empty to full. They are slid, not resized: that costs the page nothing. */
.fill-to-value {
  @apply absolute inset-y-0 -left-(--slack) w-[calc(var(--value)+var(--slack))];
}

/* The glint along the top, the shade where a round tube's liquid is deepest, the liquid. */
.liquid {
  background:
    linear-gradient(var(--color-gloss), var(--color-gloss)) calc(5px + var(--slack)) 2px /
      calc(100% - 14px - var(--slack)) 2px no-repeat,
    linear-gradient(180deg, transparent 50%, light-dark(#064e3b40, #00000059)),
    linear-gradient(90deg, var(--color-liquid-hi), var(--color-liquid-lo));
}

/* A band of light that crosses the liquid once it has settled, as on wet glass. */
.liquid::after {
  content: "";
  @apply absolute inset-0 -translate-x-full;
  background: linear-gradient(100deg, transparent 30%, var(--color-gloss) 50%, transparent 70%);
}

/* Only once the page is awake (see style.css): held at its first step, the tube would sit
   empty. The liquid rushes in, runs a little past its level and settles back, as water does. */
.pour .fill-to-value {
  @variant awake {
    @variant motion-safe {
      animation: pour 1.9s both;
    }
  }
}

.pour .liquid::after {
  @variant awake {
    @variant motion-safe {
      animation: glint 1.2s 1.3s ease-in-out both;
    }
  }
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
</style>
