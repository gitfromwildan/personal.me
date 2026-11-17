import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import { i18n, inOtherLocale, localeOf } from "./i18n";
import HomePage from "./pages/HomePage.vue";

// Every page exists once per language: as it is for English, and under /id for Indonesian.
const LANG = "/:lang(id)?";

// A router each: the browser has one, and the build makes one for every page it renders ahead of
// time (entry-server.ts), where there is no address bar to keep the history in.
export function makeRouter() {
  const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      { path: LANG, component: HomePage },
      // Lazy, so the compiled posts stay out of the home page bundle.
      { path: `${LANG}/blog`, component: () => import("./pages/BlogList.vue") },
      {
        path: `${LANG}/blog/:slug`,
        component: () => import("./pages/BlogPost.vue"),
        props: (route) => ({ slug: route.params.slug }),
      },
      { path: "/:pathMatch(.*)*", redirect: "/" },
    ],
    scrollBehavior(to, from, saved) {
      // Changing the language of the page being read keeps the reader where they are.
      if (to.path === inOtherLocale(from.path)) return false;
      return saved ?? (to.hash ? { el: to.hash } : { top: 0 });
    },
  });
  // The address decides the language, before the page it leads to is drawn.
  router.beforeEach((to) => {
    i18n.global.locale.value = localeOf(to.path);
  });
  return router;
}
