<script setup lang="ts">
// The blurred colour blobs behind a page. Use inside .stage. Numbers are pixels.
type Length = number | string;
defineProps<{
  blobs: readonly {
    /** A colour token, such as "--blob-a". */
    color: string;
    width: Length;
    /** Defaults to the width. */
    height?: Length;
    top: Length;
    left?: Length;
    right?: Length;
  }[];
}>();

const css = (value?: Length) => (typeof value === "number" ? `${value}px` : value);
</script>

<template>
  <span
    v-for="(blob, i) in blobs"
    :key="i"
    class="blob"
    aria-hidden="true"
    :style="{
      background: `var(${blob.color})`,
      width: css(blob.width),
      height: css(blob.height ?? blob.width),
      top: css(blob.top),
      left: css(blob.left),
      right: css(blob.right),
    }"
  />
</template>
