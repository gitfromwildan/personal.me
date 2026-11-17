import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { posts } from "virtual:posts";
import App from "./App.vue";
import { messages } from "./data/messages";
import { i18n } from "./i18n";
import { makeRouter } from "./router";

// The build's side of the app: prerender.ts calls this once per page to get the HTML that page
// is served with.

/** Every page the site has: each one in every language, at the address its navbar gives. */
export const routes = Object.values(messages).flatMap(({ navbar: [home, blog] }) => [
  home.href,
  blog.href,
  ...posts.map((post) => `${blog.href}/${post.slug}`),
]);

/**
 * A page as HTML, with its title, its language and the ids of the modules (components) that
 * drew it.
 */
export async function render(url: string) {
  const router = makeRouter();
  const app = createSSRApp(App).use(router).use(i18n);
  await router.push(url);
  await router.isReady();
  // As it renders, each component adds its own module id here, and the page its title (see
  // usePageTitle).
  const context: { modules?: Set<string>; title?: string } = {};
  const html = await renderToString(app, context);
  return {
    html,
    title: context.title,
    lang: i18n.global.locale.value,
    modules: [...(context.modules ?? [])],
  };
}
