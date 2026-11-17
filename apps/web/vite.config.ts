import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite-plus";
import { lazyPlugins } from "vite-plus";
import posts from "./posts.plugin.ts";

// https://vite.dev/config/
export default defineConfig({
  // Static assets stay in the repo-root public/ so UI-personal.pen keeps resolving them.
  publicDir: "../../public",
  plugins: lazyPlugins(() => [vue(), posts()]),
});
