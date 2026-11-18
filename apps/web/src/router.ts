import { createMemoryHistory, createRouter, createWebHistory, START_LOCATION } from "vue-router";
import { i18n, inOtherLocale, localeOf } from "./i18n";

// Every page exists once per language: as it is for English, and under /id for Indonesian.
const LANG = "/:lang(id)?";

// A router each: the browser has one, and the build makes one for every page it renders ahead of
// time (entry-server.ts), where there is no address bar to keep the history in. A test gives
// its own history, one that leaves the address of the page it runs in alone.
export function makeRouter(
  history = import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
) {
  const router = createRouter({
    history,
    routes: [
      // Each page is fetched when it is gone to: a page then brings only its own script and
      // styles, and the compiled posts stay out of the home page's.
      { path: LANG, component: () => import("./pages/HomePage.vue") },
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
      // A page that has only just loaded is at its top already: scrolling it there would make
      // the browser lay the whole page out again, in the middle of starting up.
      if (from === START_LOCATION && !saved && !to.hash) return false;
      return saved ?? (to.hash ? { el: to.hash } : { top: 0 });
    },
  });
  // The address decides the language, before the page it leads to is drawn.
  router.beforeEach((to) => {
    i18n.global.locale.value = localeOf(to.path);
  });
  return router;
}
