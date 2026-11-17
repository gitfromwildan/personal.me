import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    // Lazy, so the compiled posts stay out of the home page bundle.
    { path: "/blog", component: () => import("./pages/BlogList.vue") },
    { path: "/blog/:slug", component: () => import("./pages/BlogPost.vue"), props: true },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior: (to) => (to.hash ? { el: to.hash } : { top: 0 }),
});
