import { expect, test } from "vite-plus/test";
import "../style.css";

// The colour tokens are written with light-dark(), keyed by the data-theme attribute: every
// colour on the site depends on the browser resolving that.
test("the page is light or dark as data-theme says", () => {
  const root = document.documentElement;
  const background = () => getComputedStyle(document.body).backgroundColor;

  root.dataset.theme = "light";
  expect(background()).toBe("rgb(232, 235, 241)");

  root.dataset.theme = "dark";
  expect(background()).toBe("rgb(7, 8, 11)");
});
