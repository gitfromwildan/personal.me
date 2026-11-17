import { afterEach, expect, test } from "vite-plus/test";
import { DATA } from "./data";
import { messages } from "./data/messages";
import { ago, count, longDate } from "./format";
import { i18n, inOtherLocale, localeOf } from "./i18n";
import { postPath } from "./links";

afterEach(() => (i18n.global.locale.value = "en"));

test("the address says which language a page is in", () => {
  expect(localeOf("/")).toBe("en");
  expect(localeOf("/blog/hello-world")).toBe("en");
  expect(localeOf("/id")).toBe("id");
  expect(localeOf("/id/blog")).toBe("id");
  // A post could be called "idea": only a whole /id segment counts.
  expect(localeOf("/idea")).toBe("en");
});

test("every page has its twin in the other language", () => {
  expect(inOtherLocale("/")).toBe("/id");
  expect(inOtherLocale("/id")).toBe("/");
  expect(inOtherLocale("/blog/hello-world")).toBe("/id/blog/hello-world");
  expect(inOtherLocale("/id/blog/hello-world")).toBe("/blog/hello-world");
});

test("the copy, the links and the dates follow the language", () => {
  expect(DATA.navbar[0].label).toBe("Home");
  expect(postPath("hello-world")).toBe("/blog/hello-world");
  expect(longDate("2026-02-04")).toBe("February 4, 2026");
  expect(count(1835)).toBe("1,835");

  i18n.global.locale.value = "id";
  expect(DATA.navbar[0].label).toBe("Beranda");
  expect(postPath("hello-world")).toBe("/id/blog/hello-world");
  expect(longDate("2026-02-04")).toBe("4 Februari 2026");
  expect(count(1835)).toBe("1.835");
  expect(ago(new Date(Date.now() - 3 * 86_400_000).toISOString())).toBe("3 hr lalu");
});

// Indonesian is checked against English by its type, except for the skills, whose groups are
// keyed by their translated names.
test("both languages list the same skills at the same levels", () => {
  const levels = (skills: Record<string, readonly { percentage: number }[]>) =>
    Object.values(skills).map((group) => group.map((skill) => skill.percentage));
  expect(levels(messages.id.skills)).toEqual(levels(messages.en.skills));
});
