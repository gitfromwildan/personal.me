<script setup lang="ts">
import { computed } from "vue";

// A glass panel that reads as technology, where the bubbles read as water: it hovers in place,
// circuit traces run along its edges with pulses of data travelling down them, and a sheen
// scans across it. Drawn as SVG and animated with CSS. `--tint` colours it, `--phase` (0 to 1)
// lets neighbours move out of step. `width` and `height` are the panel's design size: they lay out
// the traces, and the panel itself may be shown at any scale of that size.
const props = defineProps<{ width: number; height: number }>();

// Three traces, in the panel's own pixels, each ending in a node. They run along the straight
// parts of the edges (the sides below the top corners, and the bottom) and turn inwards on a
// curve, so they sit naturally in a panel whose corners are very round.
const traces = computed(() => {
  const { width: w, height: h } = props;
  const x = (share: number) => Math.round(w * share);
  const y = (share: number) => Math.round(h * share);
  const r = Math.round(Math.min(w, h) * 0.07); // how wide each turn is
  return [
    {
      d: `M20 ${y(0.46)}V${y(0.64) - r}q0 ${r} ${r} ${r}H${x(0.3)}`,
      end: [x(0.3), y(0.64)],
    },
    {
      d: `M${w - 20} ${y(0.5)}V${y(0.7) - r}q0 ${r} ${-r} ${r}H${x(0.74)}`,
      end: [x(0.74), y(0.7)],
    },
    {
      d: `M${x(0.34)} ${h - 24}H${x(0.58) - r}q${r} 0 ${r} ${-r}V${y(0.84)}`,
      end: [x(0.58), y(0.84)],
    },
  ];
});
</script>

<template>
  <span class="glass pane">
    <svg class="circuit" :viewBox="`0 0 ${width} ${height}`" aria-hidden="true">
      <g v-for="(trace, i) in traces" :key="i" :style="{ '--i': i }">
        <path class="trace" :d="trace.d" />
        <path class="pulse" :d="trace.d" pathLength="100" />
        <circle class="node" :cx="trace.end[0]" :cy="trace.end[1]" r="2.5" />
      </g>
    </svg>
  </span>
</template>

<style scoped>
.pane {
  --phase: 0;
  overflow: hidden;
  background:
    linear-gradient(125deg, light-dark(#ffffff5c, #ffffff22) 15%, var(--stage-0) 37%),
    linear-gradient(140deg, var(--tint, transparent) 15%, var(--stage-0) 68%),
    linear-gradient(180deg, var(--glass-hi), var(--glass-lo));
  animation: hover 10s ease-in-out calc(var(--phase) * -10s) infinite;
}

/* The scanning sheen: a band of light that crosses the panel, then waits. The band is drawn
   once, three panels wide, and slid across: sliding is work the browser does off the page's
   main thread, where redrawing it at each step is not. */
.pane::after {
  content: "";
  position: absolute;
  inset: 0 -100%;
  background: linear-gradient(115deg, transparent 42%, var(--gloss) 50%, transparent 58%);
  opacity: 0.5;
  animation: scan 8s ease-in-out calc(var(--phase) * -8s) infinite;
}

.circuit {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
}

.trace {
  stroke: var(--glass-line);
}

/* A short dash that runs the length of its trace. */
.pulse {
  stroke: var(--accent);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 7 93;
  animation: flow 4.5s linear calc((var(--i) * 1.5s + var(--phase) * 4.5s) * -1) infinite;
}

.node {
  fill: var(--accent);
  animation: blink 4.5s ease-in-out calc((var(--i) * 1.5s + var(--phase) * 4.5s) * -1) infinite;
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

@keyframes flow {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* The node lights up as its pulse arrives, at the end of the cycle. */
@keyframes blink {
  0%,
  80% {
    opacity: 0.35;
  }
  95% {
    opacity: 1;
  }
  100% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pane,
  .pane::after,
  .node {
    animation: none;
  }

  .pane::after,
  .pulse {
    display: none;
  }
}
</style>
