<script setup lang="ts">
import { ICONS } from "./icons";

const props = withDefaults(defineProps<{ name: keyof typeof ICONS; size?: number }>(), {
  size: 16,
});
</script>

<template>
  <svg
    :viewBox="`0 0 ${ICONS[props.name][0]} ${ICONS[props.name][0]}`"
    :width="size"
    :height="size"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="ICONS[props.name][1]" />
  </svg>
</template>
