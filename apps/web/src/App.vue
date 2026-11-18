<script setup lang="ts">
import { defineAsyncComponent, hydrateOnInteraction, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { hasToc } from "./composables/useDockToc";
import { localeOf } from "./i18n";

const router = useRouter();

// The dock arrives as the build drew it and is left that way, none of its script run, until it
// is needed: when it is pointed at, pressed or tabbed into, or when the page is about to change
// and it has to follow. A post needs it from the start, to offer its table of contents.
const AppDock = defineAsyncComponent({
  loader: () => import("./components/AppDock.vue"),
  hydrate(hydrate, forEach) {
    if (hasToc.value) return hydrate();
    const wake = () => {
      stops.forEach((stop) => stop());
      hydrate();
    };
    const stops = [
      // The pointer events come before the click they lead to; the click is for what presses
      // without a pointer, such as a screen reader.
      hydrateOnInteraction(["pointerover", "focusin", "click"])(wake, forEach)!,
      // Before the page changes, while the dock still is what was built: Vue can only take
      // over HTML that it would draw the same. A change of language makes the dock anew.
      router.beforeEach((to, from) => {
        if (localeOf(to.path) === localeOf(from.path)) wake();
      }),
    ];
    return () => stops.forEach((stop) => stop());
  },
});

// Each page and the dock are made anew when the language changes (their key): what a component
// worked out from the copy when it was set up is then worked out again in the new language.
const { locale } = useI18n();
if (!import.meta.env.SSR) watchEffect(() => (document.documentElement.lang = locale.value));
</script>

<template>
  <RouterView :key="locale" />
  <AppDock :key="locale" />
</template>
