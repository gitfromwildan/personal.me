import { createSSRApp, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import { createMemoryHistory } from "vue-router";
import { expect, onTestFinished, test, vi } from "vite-plus/test";
import App from "./App.vue";
import { tocOpen } from "./composables/useDockToc";
import { i18n } from "./i18n";
import { makeRouter } from "./router";

// The blog page fetches what draws the posts, which is a lot and not what is tested here.
vi.mock("./components/blog/postIsland", () => ({}));

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

/** Escape closes the dock's popover, once the dock's script runs. */
function escape(dock: HTMLElement) {
  tocOpen.value = true;
  dock.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  return !tocOpen.value;
}

test("the dock is left as built until the page changes, and then follows it", async () => {
  const { router, dock } = await arrive("/");
  const blog = dock.querySelector('a[href="/blog"]')!;
  expect(escape(dock)).toBe(false);
  expect(blog.classList.contains("active")).toBe(false);

  await router.push("/blog");
  await vi.waitFor(() => expect(blog.classList.contains("active")).toBe(true));
  expect(dock.querySelector(".language")!.getAttribute("href")).toBe("/id/blog");
  expect(escape(dock)).toBe(true);
});

test("the dock comes to life under a pointer, and shows tooltips only to a mouse", async () => {
  const { dock } = await arrive("/");
  const over = (pointerType: string) =>
    dock
      .querySelector(".tile")!
      .dispatchEvent(new PointerEvent("pointerover", { bubbles: true, pointerType }));

  over("touch");
  await nextTick();
  expect(escape(dock)).toBe(true);
  expect(dock.classList.contains("mouse")).toBe(false);

  over("mouse");
  await nextTick();
  expect(dock.classList.contains("mouse")).toBe(true);
});
