<script setup lang="ts">
// A horizontal glass track filled to `value` percent, with a bead at the level.
defineProps<{ value: number; label: string }>();
</script>

<template>
  <div
    class="meter"
    role="meter"
    :aria-label="label"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
    :style="{ '--value': `${value}%` }"
  >
    <span class="glass track" />
    <span class="bead" />
  </div>
</template>

<style scoped>
.meter {
  position: relative;
  height: 18px;
}

.track {
  --glass-radius: 5px;
  --glass-blur: 5px;
  --glass-elevation: 0 4px 10px;
  position: absolute;
  inset: 4px 0;
  background:
    linear-gradient(var(--gloss), var(--gloss)) 5px 2px / calc(var(--value) - 14px) 2px no-repeat,
    linear-gradient(90deg, var(--liquid-hi), var(--liquid-lo)) left / var(--value) 100% no-repeat,
    var(--track);
}

.bead {
  --bead-ring: var(--accent);
  position: absolute;
  top: 0;
  left: calc(var(--value) - 9px);
}
</style>
