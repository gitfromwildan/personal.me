import { release } from "node:os";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite-plus";
import { lazyPlugins } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";
import posts from "./posts.plugin.ts";

// The tests run in real browsers, one run per engine. Playwright downloads both for Linux
// (CI) and for current macOS and Windows. For macOS 12 and older it has none: there an engine
// is tested only if a variable names a browser to run it in, CHROMIUM_PATH (any Chromium-based
// browser will do) or WEBKIT_PATH.
const noDownloads = process.platform === "darwin" && Number.parseInt(release()) < 22;
const engines = (["chromium", "webkit"] as const).flatMap((browser) => {
  const executablePath = process.env[`${browser.toUpperCase()}_PATH`];
  if (executablePath)
    return { browser, provider: playwright({ launchOptions: { executablePath } }) };
  return noDownloads ? [] : { browser };
});
if (!engines.length) console.warn("No browser to test in: set CHROMIUM_PATH or WEBKIT_PATH.");

// https://vite.dev/config/
export default defineConfig({
  // Static assets live in the repo-root public/.
  publicDir: "../../public",
  plugins: lazyPlugins(() => [vue(), posts()]),
  // Only a test draws a page as the build does, in the browser (App.test.ts). Named here, it is
  // made ready before the tests start: found in the middle of a run, it makes Vite reload them.
  optimizeDeps: { include: ["vue/server-renderer"] },
  run: {
    tasks: {
      // A task, not a package.json script, to say that the two variables decide what it does:
      // a run with one set is then never answered from the cache of a run without it.
      test: { command: "vp test", cache: { env: ["CHROMIUM_PATH", "WEBKIT_PATH"] } },
    },
  },
  test: {
    // With no browser to run them in, the tests are skipped: they need a real page.
    include: engines.length ? ["src/**/*.test.ts"] : [],
    passWithNoTests: !engines.length,
    browser: {
      enabled: engines.length > 0,
      provider: playwright(),
      headless: true,
      instances: engines,
    },
  },
});
