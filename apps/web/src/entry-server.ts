import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { postsIn } from "virtual:posts";
import App from "./App.vue";
import { messages } from "./data/messages";
import { i18n } from "./i18n";
import { makeRouter } from "./router";

// The build's side of the app: prerender.ts calls this once per page to get the HTML that page
// is served with.

/**
 * Every page the site has: each one in every language, at the address its navbar gives. Then
 * the page for an address that has none: the host answers those with 404.html (and the status
 * 404), which is what the address /404 is written to.
 */
export const routes = [
  ...Object.values(messages).flatMap(({ navbar: [home, blog] }) => [
    home.href,
    blog.href,
    ...postsIn.en.map((post) => `${blog.href}/${post.slug}`),
  ]),
  "/404",
];

/** An image the page should fetch before anything else: its largest one, on the first screen. */
export type PreloadImage = { src: string; srcset: string; sizes: string };

/**
 * A page as HTML, with its title, its language, the ids of the modules (components) that drew
 * it, and the image to fetch first, if it has one.
 */
export async function render(url: string) {
  const router = makeRouter();
  const app = createSSRApp(App).use(router).use(i18n);
  await router.push(url);
  await router.isReady();
  // As it renders, each component adds its own module id here, the page its title (see
  // usePageTitle), and the hero its portrait.
  const context: { modules?: Set<string>; title?: string; preloadImage?: PreloadImage } = {};
  const html = await renderToString(app, context);
  return {
    html,
    title: context.title,
    lang: i18n.global.locale.value,
    modules: [...(context.modules ?? [])],
    preloadImage: context.preloadImage,
  };
}
