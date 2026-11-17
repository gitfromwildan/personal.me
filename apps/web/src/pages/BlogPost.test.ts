import { createApp, defineComponent, h, nextTick, ref } from "vue";
import { expect, onTestFinished, test } from "vite-plus/test";
import { hasToc } from "../composables/useDockToc";
import { i18n } from "../i18n";
import { makeRouter } from "../router";
import BlogPost from "./BlogPost.vue";

test("a post made anew, as on a change of language, keeps its table of contents in the dock", async () => {
  // App.vue keys the page by language: a change of language replaces the post page with a new
  // instance of itself, whose claim on the dock the old one must not withdraw on its way out.
  const key = ref("en");
  const Pages = defineComponent(() => () => h(BlogPost, { key: key.value, slug: "hello-world" }));
  const host = document.body.appendChild(document.createElement("div"));
  const router = makeRouter();
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
