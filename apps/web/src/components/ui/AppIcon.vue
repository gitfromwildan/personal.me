<script setup lang="ts">
import { computed } from "vue";
import { ICONS } from "./icons";

const props = withDefaults(defineProps<{ name: keyof typeof ICONS; size?: number }>(), {
  size: 16,
});

// [viewBox size, path data, "stroke" for a line icon]
const icon = computed(() => ICONS[props.name] as readonly [number, string, "stroke"?]);
</script>

<template>
  <svg
    :viewBox="`0 0 ${icon[0]} ${icon[0]}`"
    :width="size"
    :height="size"
    :fill="icon[2] ? 'none' : 'currentColor'"
    :stroke="icon[2] && 'currentColor'"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="icon[1]" />
  </svg>
</template>
