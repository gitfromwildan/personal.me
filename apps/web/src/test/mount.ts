import { createApp, type Component } from "vue";
import { onTestFinished } from "vite-plus/test";
import { i18n } from "../i18n";
import "../style.css";

/**
 * Puts a component in the page, with the site's styles, for the length of the test. Returns the
 * element it is mounted in.
 */
export function mount(component: Component, props?: Record<string, unknown>) {
  const host = document.body.appendChild(document.createElement("div"));
  const app = createApp(component, props).use(i18n);
  app.mount(host);
  onTestFinished(() => {
    app.unmount();
    host.remove();
  });
  return host;
}
