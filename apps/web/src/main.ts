import { createApp, createSSRApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { i18n } from "./i18n";
import { makeRouter } from "./router";
import { onFirstMove } from "./wake";

// A built page arrives with its HTML already in place (see prerender.ts), which Vue takes over
// as it is. Otherwise Vue draws the page itself: under `vp dev`, where the page starts empty,
// and when a host answers an address it has no file for with another page's file.
const root = document.querySelector<HTMLElement>("#app")!;
const built = root.dataset.page === (location.pathname.replace(/\/$/, "") || "/");
if (!built) root.textContent = "";
const router = makeRouter();
const app = (built ? createSSRApp : createApp)(App).use(router).use(i18n);
// A page that is loaded on demand must be there before Vue starts: taking over HTML only works
// if Vue draws the same thing.
void router.isReady().then(() => app.mount(root));

// The page first shows as a still picture: its looping animations wait (see :root:not(.awake)
// in style.css) for the visitor's first move, so they cost nothing while the page loads.
onFirstMove(() => document.documentElement.classList.add("awake"));
