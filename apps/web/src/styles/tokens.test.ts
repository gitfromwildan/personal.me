import { expect, onTestFinished, test } from "vite-plus/test";
import "../style.css";

/** An element with these classes in the page, for the length of the test. */
function place(className: string) {
  const el = document.body.appendChild(document.createElement("div"));
  el.className = className;
  onTestFinished(() => el.remove());
  return el;
}

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

// Tailwind's own dark: follows the system's setting. The site's follows the dock's switch.
test("dark: utilities follow data-theme, whatever the system's setting", () => {
  const root = document.documentElement;
  const moon = place("dark:hidden");
  const shown = () => getComputedStyle(moon).display !== "none";

  root.dataset.theme = "light";
  expect(shown()).toBe(true);

  root.dataset.theme = "dark";
  expect(shown()).toBe(false);
});

// Tailwind's own container steps up with the breakpoints. The site's is the design's column.
test("the container is the 1120px page column, with a gutter on narrow screens", () => {
  const column = place("container");
  const room = document.body.clientWidth;

  expect(column.getBoundingClientRect().width).toBeCloseTo(Math.min(1120, room - 40), 0);
  expect(column.getBoundingClientRect().left).toBeCloseTo(
    (room - Math.min(1120, room - 40)) / 2,
    0,
  );
});
