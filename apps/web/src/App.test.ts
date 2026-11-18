import { createSSRApp, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import { createMemoryHistory } from "vue-router";
import { expect, onTestFinished, test, vi } from "vite-plus/test";
import App from "./App.vue";
import { tocOpen } from "./composables/useDockToc";
import { i18n } from "./i18n";
import { makeRouter } from "./router";

/** The page at `path` as the build draws it, taken over by Vue as in main.ts. */
async function arrive(path: string) {
  const make = async () => {
    const router = makeRouter(createMemoryHistory());
    await router.push(path);
    await router.isReady();
    return { router, app: createSSRApp(App).use(router).use(i18n) };
  };
  const host = document.body.appendChild(document.createElement("div"));
  host.innerHTML = await renderToString((await make()).app);
  const { router, app } = await make();
  app.mount(host);
  onTestFinished(() => {
    app.unmount();
    host.remove();
    tocOpen.value = false;
  });
  // The dock's script is fetched by now: from here on, only being needed starts it.
  await import("./components/AppDock.vue");
  await nextTick();
  return { router, dock: host.querySelector<HTMLElement>(".dock")! };
}

/**
 * Whether the dock's script runs: only then does its popover show when it is told to open. Asked
 * without a key or a pointer, which would be the visitor's first move: on it the pages fetch
 * what they put off, GitHub's numbers and the script that draws the posts.
 */
async function live(dock: HTMLElement) {
  tocOpen.value = true;
  await nextTick();
  const shown = dock.querySelector<HTMLElement>("#dock-toc")!.style.display !== "none";
  tocOpen.value = false;
  await nextTick();
  return shown;
}

test("the dock is left as built until the page changes, and then follows it", async () => {
  const { router, dock } = await arrive("/");
  const blog = dock.querySelector('a[href="/blog"]')!;
  expect(await live(dock)).toBe(false);
  expect(blog.classList.contains("active")).toBe(false);

  await router.push("/blog");
  await vi.waitFor(() => expect(blog.classList.contains("active")).toBe(true));
  expect(dock.querySelector(".language")!.getAttribute("href")).toBe("/id/blog");
  expect(await live(dock)).toBe(true);
});

test("the dock comes to life under a pointer, and shows tooltips only to a mouse", async () => {
  const { dock } = await arrive("/");
  const over = (pointerType: string) =>
    dock
      .querySelector(".tile")!
      .dispatchEvent(new PointerEvent("pointerover", { bubbles: true, pointerType }));

  over("touch");
  expect(await live(dock)).toBe(true);
  expect(dock.classList.contains("mouse")).toBe(false);

  over("mouse");
  await nextTick();
  expect(dock.classList.contains("mouse")).toBe(true);
});
