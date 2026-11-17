<script setup lang="ts">
import { onMounted } from "vue";
import AppDock from "./components/AppDock.vue";
import { followWidth } from "./composables/useDockToc";

onMounted(followWidth);
</script>

<template>
  <RouterView />
  <AppDock />
</template>
