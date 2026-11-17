import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { posts } from "virtual:posts";
import App from "./App.vue";
import { postPath } from "./links";
import { makeRouter } from "./router";

// The build's side of the app: prerender.ts calls this once per page to get the HTML that page
// is served with.

/** Every page the site has. */
export const routes = ["/", "/blog", ...posts.map((post) => postPath(post.slug))];

/** A page as HTML, with its title and the ids of the modules (components) that drew it. */
export async function render(url: string) {
  const router = makeRouter();
  const app = createSSRApp(App).use(router);
  await router.push(url);
  await router.isReady();
  // As it renders, each component adds its own module id here, and the page its title (see
  // usePageTitle).
  const context: { modules?: Set<string>; title?: string } = {};
  const html = await renderToString(app, context);
  return { html, title: context.title, modules: [...(context.modules ?? [])] };
}
