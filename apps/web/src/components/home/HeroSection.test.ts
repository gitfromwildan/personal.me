import { expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser/context";
import { DATA } from "../../data";
import { mount } from "../../test/mount";
import HeroSection from "./HeroSection.vue";

const hero = () => {
  const host = mount(HeroSection);
  return {
    section: host.querySelector<HTMLElement>("#top")!,
    bubble: host.querySelector<HTMLButtonElement>("button.big")!,
    host,
  };
};

test("a click on the hero pops the bubble into a ripple", async () => {
  const { section, bubble, host } = hero();
  expect(section.classList.contains("burst")).toBe(false);
  expect(host.querySelector(".water")).toBeNull();

  await userEvent.click(host.querySelector(".headline")!);

  expect(section.classList.contains("burst")).toBe(true);
  expect(bubble.getAttribute("aria-pressed")).toBe("true");
  // The ripple's filter exists only while the bubble is burst.
  expect(host.querySelector(".water feDisplacementMap")).not.toBeNull();
});

test("the keyboard pops the bubble and gathers it again", async () => {
  const { section, bubble } = hero();
  // The mouse is put on the hero first. A browser tells a page that the mouse is on something
  // new a moment after that thing appears under it, and coming in gathers the bubble: left to
  // chance, that could land between the two key presses.
  await userEvent.hover(section);
  bubble.focus();

  await userEvent.keyboard("{Enter}");
  expect(section.classList.contains("burst")).toBe(true);

  await userEvent.keyboard("{Enter}");
  expect(section.classList.contains("burst")).toBe(false);
});

test("the Hire me button opens its link in a new tab and leaves the bubble alone", async () => {
  const { section, host } = hero();
  const link = [...host.querySelectorAll<HTMLAnchorElement>(".actions a")].find(
    (a) => a.textContent!.trim() === DATA.hero.hire.label,
  )!;
  expect(link.href).toBe(DATA.hero.hire.url);
  expect(link.target).toBe("_blank");
  expect(link.rel).toContain("noopener");

  // A click on a link is the link's: it must not pop the bubble. Following it would leave the
  // test page, so that part is stopped.
  link.addEventListener("click", (event) => event.preventDefault());
  await userEvent.click(link);
  expect(section.classList.contains("burst")).toBe(false);
});
