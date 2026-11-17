import { defineConfig } from "vite-plus";

export default defineConfig({
  // Blog posts are authored content: the formatter must not rewrite them.
  fmt: { ignorePatterns: ["content/**"] },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
