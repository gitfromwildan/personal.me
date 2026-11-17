import { expect, test } from "vite-plus/test";
import { mount } from "../../test/mount";
import GlassMeter from "./GlassMeter.vue";

test("the liquid and the bead stand at the value", () => {
  const host = mount(GlassMeter, { value: 60, label: "Networking" });
  host.style.width = "400px";

  const meter = host.querySelector<HTMLElement>("[role=meter]")!;
  expect(meter.getAttribute("aria-label")).toBe("Networking");
  expect(meter.getAttribute("aria-valuenow")).toBe("60");

  // 60% of 400px, measured from the meter's left edge.
  const left = meter.getBoundingClientRect().left;
  const liquid = host.querySelector(".liquid")!.getBoundingClientRect();
  const bead = host.querySelector(".bead")!.getBoundingClientRect();
  expect(liquid.right - left).toBeCloseTo(240, 0);
  expect(bead.left + bead.width / 2 - left).toBeCloseTo(240, 0);
});

test("the meter is still until the page is awake", () => {
  const host = mount(GlassMeter, { value: 60, label: "Networking" });
  expect(host.querySelector(".liquid")!.getAnimations()).toHaveLength(0);
});
