import { release } from "node:os";
import tailwindcss from "@tailwindcss/vite";
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
  plugins: lazyPlugins(() => [tailwindcss(), vue(), posts()]),
  // Made ready before the tests start: a package first met in the middle of a run makes Vite
  // bundle again and reload the tests, which fails whichever were loading. The server renderer
  // is only used by a test (App.test.ts); the JSX runtime is what a compiled post imports.
  optimizeDeps: { include: ["vue/server-renderer", "react/jsx-runtime"] },
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
