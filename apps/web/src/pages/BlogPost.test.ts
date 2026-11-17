import { createApp, defineComponent, h, nextTick, ref } from "vue";
import { createMemoryHistory } from "vue-router";
import { expect, onTestFinished, test, vi } from "vite-plus/test";
import { hasToc } from "../composables/useDockToc";
import { i18n } from "../i18n";
import { makeRouter } from "../router";
import BlogPost from "./BlogPost.vue";

// The body of a post is drawn by React, from the compiled posts: a lot to fetch, and not what is
// tested here. Fetching it in the middle of a run has also made Vite reload the test page.
vi.mock("../components/blog/PostBody.vue", () => ({
  default: defineComponent({ props: ["slug", "html"], render: () => h("div") }),
}));

test("a post made anew, as on a change of language, keeps its table of contents in the dock", async () => {
  // App.vue keys the page by language: a change of language replaces the post page with a new
  // instance of itself, whose claim on the dock the old one must not withdraw on its way out.
  const key = ref("en");
  const Pages = defineComponent(() => () => h(BlogPost, { key: key.value, slug: "hello-world" }));
  const host = document.body.appendChild(document.createElement("div"));
  // A history of its own: the page the test runs in keeps its address.
  const router = makeRouter(createMemoryHistory());
  await router.push("/blog/hello-world");
  await router.isReady();
  const app = createApp(Pages).use(i18n).use(router);
  app.mount(host);
  onTestFinished(() => {
    app.unmount();
    host.remove();
  });
  expect(hasToc.value).toBe(true);

  key.value = "id";
  await nextTick();
  expect(hasToc.value).toBe(true);
});
