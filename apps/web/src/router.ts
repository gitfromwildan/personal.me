import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";

// A router each: the browser has one, and the build makes one for every page it renders ahead of
// time (entry-server.ts), where there is no address bar to keep the history in.
export const makeRouter = () =>
  createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      { path: "/", component: HomePage },
      // Lazy, so the compiled posts stay out of the home page bundle.
      { path: "/blog", component: () => import("./pages/BlogList.vue") },
      { path: "/blog/:slug", component: () => import("./pages/BlogPost.vue"), props: true },
      { path: "/:pathMatch(.*)*", redirect: "/" },
    ],
    scrollBehavior: (to, _from, saved) => saved ?? (to.hash ? { el: to.hash } : { top: 0 }),
  });
