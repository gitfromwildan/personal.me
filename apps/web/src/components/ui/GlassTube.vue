<script setup lang="ts">
// A vertical glass tube holding liquid, as tall as its parent. `fill` is the liquid's share of
// the tube (0 to 1) and `from` is the end it is poured from. Each time `travel` turns true, the
// liquid crosses the tube from its far end to that place.
withDefaults(defineProps<{ fill?: number; from?: "top" | "bottom"; travel?: boolean }>(), {
  fill: 1,
  from: "top",
});
</script>

<template>
  <span
    class="glass tube"
    :class="[from, { travel }]"
    :style="{ '--fill': fill }"
    aria-hidden="true"
  >
    <span class="liquid" />
  </span>
</template>

<style scoped>
.tube {
  --glass-radius: 6px;
  --glass-blur: 5px;
  --glass-elevation: 0 8px 18px;
  display: block;
  overflow: hidden;
  width: 12px;
  height: 100%;
  background:
    linear-gradient(var(--track), var(--track)),
    linear-gradient(90deg, var(--glass-hi), var(--glass-lo));
}

/* An element of its own, not one more background: it can then be slid along the tube, which
   costs the page nothing, where moving a background means redrawing the tube at every step. */
.liquid {
  position: absolute;
  left: 1px;
  width: 10px;
  height: calc(var(--fill) * 100%);
  background: linear-gradient(var(--angle), var(--liquid-lo), var(--liquid-hi) 60%, transparent);
}

/* The glint down the glass, over the liquid. */
.tube::after {
  content: "";
  position: absolute;
  top: 6px;
  left: 3px;
  width: 2.5px;
  height: calc(100% - 12px);
  background: var(--gloss);
}

/* --far is the way to the other end: down from the top, up from the bottom. */
.tube.top {
  --angle: 180deg;
  --far: 1;
}

.tube.top .liquid {
  top: 0;
}

.tube.bottom {
  --angle: 0deg;
  --far: -1;
}

.tube.bottom .liquid {
  bottom: 0;
}

/* Only once the page is awake (see style.css): held at its first step, the liquid would sit at
   the wrong end. */
:root.awake .travel .liquid {
  animation: travel 2.4s cubic-bezier(0.3, 0, 0.2, 1);
}

/* From the far end, which is the rest of the tube away: 1 / fill - 1 of the liquid's own
   length. */
@keyframes travel {
  from {
    translate: 0 calc(var(--far) * (1 / var(--fill) - 1) * 100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  :root.awake .travel .liquid {
    animation: none;
  }
}
</style>
