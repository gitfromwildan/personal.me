<script setup lang="ts">
import { onMounted, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import AppDock from "./components/AppDock.vue";
import { followWidth } from "./composables/useDockToc";

onMounted(followWidth);

// Each page and the dock are made anew when the language changes (their key): what a component
// worked out from the copy when it was set up is then worked out again in the new language.
const { locale } = useI18n();
if (!import.meta.env.SSR) watchEffect(() => (document.documentElement.lang = locale.value));
</script>

<template>
  <RouterView :key="locale" />
  <AppDock :key="locale" />
</template>
