import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");

// The page first renders as a still picture: its looping animations wait (see :root:not(.awake)
// in style.css) for the visitor's first move, so they cost nothing while the page loads.
const wake = () => document.documentElement.classList.add("awake");
for (const type of ["pointermove", "pointerdown", "keydown", "scroll"])
  addEventListener(type, wake, { once: true, passive: true });
