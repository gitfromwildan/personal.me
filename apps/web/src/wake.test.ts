import { expect, test, vi } from "vite-plus/test";
import { onFirstMove } from "./wake";

test("runs once, on the first move of any kind", () => {
  const fn = vi.fn();
  onFirstMove(fn);
  expect(fn).not.toHaveBeenCalled();
  dispatchEvent(new Event("scroll"));
  dispatchEvent(new Event("keydown"));
  expect(fn).toHaveBeenCalledTimes(1);
});
