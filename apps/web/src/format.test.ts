import { afterEach, expect, test, vi } from "vite-plus/test";
import { ago, longDate, shortDate, shortMonth } from "./format";

afterEach(() => vi.useRealTimers());

// Dates are formatted by the browser, so each engine has to agree on the result.
test("post dates read the same in every browser", () => {
  expect(shortDate("2026-02-04")).toBe("04 Feb 2026");
  expect(longDate("2026-02-04")).toBe("February 4, 2026");
  expect(shortMonth("2026-02-04")).toBe("Feb");
});

test("a date never shifts with the time zone", () => {
  // Midnight UTC is still the day before in the Americas.
  expect(longDate("2026-01-01")).toBe("January 1, 2026");
});

test("ago counts in days, months, then years", () => {
  vi.useFakeTimers({ now: new Date("2026-11-17T12:00:00Z") });
  expect(ago("2026-11-17T08:00:00Z")).toBe("today");
  expect(ago("2026-11-05T12:00:00Z")).toBe("12d ago");
  expect(ago("2026-02-04")).toBe("9mo ago");
  expect(ago("2024-06-01")).toBe("2y ago");
});
