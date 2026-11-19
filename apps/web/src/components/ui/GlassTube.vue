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
  <!-- --far is the way to the other end: down from the top, up from the bottom. -->
  <span
    class="glass tube block h-full w-3 overflow-hidden rounded-md shadow-[0_8px_18px_var(--color-glass-shadow)] backdrop-blur-[5px]"
    :class="{ travel }"
    :style="{
      '--fill': fill,
      '--far': from === 'top' ? 1 : -1,
      '--angle': from === 'top' ? '180deg' : '0deg',
    }"
    aria-hidden="true"
  >
    <span
      class="liquid absolute left-px h-[calc(var(--fill)*100%)] w-2.5"
      :class="from === 'top' ? 'top-0' : 'bottom-0'"
    />
  </span>
</template>

<style scoped>
@reference "../../style.css";

.tube {
  background:
    linear-gradient(var(--color-track), var(--color-track)),
    linear-gradient(90deg, var(--color-glass-hi), var(--color-glass-lo));
}

/* An element of its own, not one more background: it can then be slid along the tube, which
   costs the page nothing, where moving a background means redrawing the tube at every step. */
.liquid {
  background: linear-gradient(
    var(--angle),
    var(--color-liquid-lo),
    var(--color-liquid-hi) 60%,
    transparent
  );
}

/* The glint down the glass, over the liquid. */
.tube::after {
  content: "";
  @apply absolute top-1.5 left-0.75 h-[calc(100%-12px)] w-[2.5px] bg-gloss;
}

/* Only once the page is awake (see style.css): held at its first step, the liquid would sit at
   the wrong end. */
.travel .liquid {
  @variant awake {
    @variant motion-safe {
      animation: travel 2.4s cubic-bezier(0.3, 0, 0.2, 1);
    }
  }
}

/* From the far end, which is the rest of the tube away: 1 / fill - 1 of the liquid's own
   length. */
@keyframes travel {
  from {
    translate: 0 calc(var(--far) * (1 / var(--fill) - 1) * 100%);
  }
}
</style>
