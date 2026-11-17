<script setup lang="ts">
// A vertical glass tube holding liquid, as tall as its parent. `fill` is the liquid's share of
// the tube (0 to 1) and `from` is the end it is poured from.
withDefaults(defineProps<{ fill?: number; from?: "top" | "bottom" }>(), { fill: 1, from: "top" });
</script>

<template>
  <span class="glass tube" :class="from" :style="{ '--fill': fill }" aria-hidden="true" />
</template>

<style scoped>
.tube {
  --glass-radius: 6px;
  --glass-blur: 5px;
  --glass-elevation: 0 8px 18px;
  display: block;
  width: 12px;
  height: 100%;
  background:
    linear-gradient(var(--gloss), var(--gloss)) 3px 6px / 2.5px calc(100% - 12px) no-repeat,
    linear-gradient(var(--angle), var(--liquid-lo), var(--liquid-hi) 60%, transparent) 1px
      var(--edge) / 10px calc(var(--fill) * 100%) no-repeat,
    linear-gradient(var(--track), var(--track)),
    linear-gradient(90deg, var(--glass-hi), var(--glass-lo));
}

.tube.top {
  --angle: 180deg;
  --edge: top;
}

.tube.bottom {
  --angle: 0deg;
  --edge: bottom;
}
</style>
