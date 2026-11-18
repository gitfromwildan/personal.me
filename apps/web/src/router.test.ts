import { createApp } from "vue";
import { expect, onTestFinished, test, vi } from "vite-plus/test";
import { createMemoryHistory, RouterView } from "vue-router";
import { DEFAULT_LOCALE, i18n } from "./i18n";
import { makeRouter } from "./router";

test("a page is scrolled to its top when it is gone to, not when it has just loaded", async () => {
  const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  const router = makeRouter(createMemoryHistory());

  await router.push("/");
  await vi.waitFor(() => expect(router.currentRoute.value.path).toBe("/"));
  await new Promise((done) => setTimeout(done));
  expect(scrollTo).not.toHaveBeenCalled();

  await router.push("/blog");
  await vi.waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ top: 0 }));
});

test("an address with no page gets the not-found page, in the language of the address", async () => {
  const router = makeRouter(createMemoryHistory());
  await router.push("/id/nowhere");
  await router.isReady();
  const host = document.body.appendChild(document.createElement("div"));
  const app = createApp(RouterView).use(router).use(i18n);
  app.mount(host);
  onTestFinished(() => {
    app.unmount();
    host.remove();
    i18n.global.locale.value = DEFAULT_LOCALE;
  });

  // The address stays as it was asked for, and the page names it and leads home.
  await vi.waitFor(() => expect(host.querySelector(".echo")!.textContent).toContain("/id/nowhere"));
  expect(router.currentRoute.value.path).toBe("/id/nowhere");
  expect(host.querySelector("h1")!.textContent).toContain("tenggelam");
  expect(host.querySelector('a.btn[href="/id"]')).not.toBeNull();
});
