import { expect, test, vi } from "vite-plus/test";
import { createMemoryHistory } from "vue-router";
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
