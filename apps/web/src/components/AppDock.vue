<script setup lang="ts">
import { linkTarget } from "../links";
import { DATA } from "../data";
import { onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { hasToc, narrow, tocOpen } from "../composables/useDockToc";
import { toggleTheme } from "../composables/useTheme";
import { inOtherLocale } from "../i18n";
import AppIcon from "./ui/AppIcon.vue";

const year = new Date().getFullYear();
const social = Object.values(DATA.contact.social).filter((s) => s.navbar);
const [, blog] = DATA.navbar;
const route = useRoute();

// Whether the pointer last over the dock was a mouse: only a mouse hovers (see .mouse).
const mouse = ref(false);

// While the popover is open, a press outside the dock closes it.
const dock = ref<HTMLElement | null>(null);
function onPress(event: PointerEvent) {
  if (!dock.value?.contains(event.target as Node)) tocOpen.value = false;
}
watch(tocOpen, (open) =>
  open ? addEventListener("pointerdown", onPress) : removeEventListener("pointerdown", onPress),
);
onUnmounted(() => removeEventListener("pointerdown", onPress));

// Magnification as on the macOS Dock: tiles grow the closer the pointer is to them.
const GROWTH = 0.5; // the tile under the pointer is this much bigger
const REACH = 120; // px from the pointer at which a tile is back to its own size
// Centres of the tiles at rest, measured when the pointer comes in: growing tiles push their
// neighbours aside, and following those moving centres would make the dock jitter.
let centres: number[] = [];
const tiles = () => [...dock.value!.querySelectorAll<HTMLElement>(".tile")];

function onEnter(event: PointerEvent) {
  // Mouse only, and not for people who asked for less motion.
  if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;
  centres = tiles().map((tile) => {
    const { left, width } = tile.getBoundingClientRect();
    return left + width / 2;
  });
}

function onMove(event: PointerEvent) {
  if (!centres.length) return;
  // The popover sits inside the dock, but pointing at it is not pointing at the tiles below it.
  if ((event.target as Element).closest(".popover")) return rest();
  tiles().forEach((tile, i) => {
    const nearness = Math.max(0, 1 - Math.abs(event.clientX - centres[i]) / REACH);
    tile.style.setProperty("--grow", String(1 + GROWTH * Math.sin((nearness * Math.PI) / 2)));
  });
}

function rest() {
  for (const tile of tiles()) tile.style.removeProperty("--grow");
}

function onLeave() {
  centres = [];
  rest();
}
</script>

<template>
  <footer class="dock-area">
    <!-- The year is as of the day the page was built: Vue corrects it on arrival, and is told
         here not to report the difference. -->
    <p class="copyright" data-allow-mismatch="text">
      © {{ year }} {{ DATA.name }} · {{ DATA.location }}
    </p>

    <nav
      ref="dock"
      class="dock glass"
      :class="{ mouse }"
      :aria-label="DATA.ui.dock.main"
      @keydown.esc="tocOpen = false"
      @pointerover="mouse = $event.pointerType === 'mouse'"
      @pointerenter="onEnter"
      @pointermove="onMove"
      @pointerleave="onLeave"
    >
      <template v-for="item in DATA.navbar" :key="item.href">
        <!-- On a post, on a narrow screen, the Blog tile opens the table of contents instead. -->
        <button
          v-if="item === blog && hasToc && narrow"
          type="button"
          class="tile"
          :class="{ active: tocOpen }"
          :aria-label="DATA.blog.tocLabel"
          :aria-expanded="tocOpen"
          aria-controls="dock-toc"
          @click="tocOpen = !tocOpen"
        >
          <AppIcon :name="DATA.blog.tocIcon" :size="19" />
        </button>
        <RouterLink
          v-else
          :to="item.href"
          class="tile"
          :class="{ active: item === blog && route.path.startsWith(blog.href) }"
          exact-active-class="active"
          :aria-label="item.label"
        >
          <AppIcon :name="item.icon" :size="19" />
        </RouterLink>
      </template>

      <!-- The post page teleports its table of contents in here. Following a link in it closes it. -->
      <Transition name="pop">
        <div
          v-show="tocOpen"
          id="dock-toc"
          class="popover"
          @click="($event.target as Element).closest('a') && (tocOpen = false)"
        />
      </Transition>

      <span class="sep" aria-hidden="true"></span>

      <a
        v-for="s in social"
        :key="s.name"
        :href="s.url"
        class="tile"
        :aria-label="s.name"
        v-bind="linkTarget(s.url)"
      >
        <AppIcon :name="s.icon" :size="19" />
      </a>

      <!-- The same page in the other language, named after the language it leads to. -->
      <RouterLink
        :to="inOtherLocale(route.path)"
        class="tile language"
        :aria-label="DATA.ui.dock.language"
      >
        <AppIcon name="globe" :size="19" />
        <span class="code" aria-hidden="true">{{ DATA.ui.dock.languageCode }}</span>
      </RouterLink>

      <span class="sep" aria-hidden="true"></span>

      <button type="button" class="tile" :aria-label="DATA.ui.dock.theme" @click="toggleTheme">
        <AppIcon class="moon" name="moon" :size="19" />
        <AppIcon class="sun" name="sun" :size="19" />
      </button>
    </nav>
  </footer>
</template>

<style scoped>
.dock-area {
  display: flex;
  justify-content: center;
  padding: 2.5rem 1.25rem 8rem;
}

.copyright {
  margin: 0;
  color: var(--s-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-align: center;
}

.dock {
  --glass-radius: 999px;
  --glass-elevation: 0 24px 28px;
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  z-index: 50;
  transform: translateX(-50%);
  /* The bar keeps its height: magnified tiles stand on its floor and rise out of it. */
  --tile: 48px;
  --icon: 19px;
  --pad: 8px;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  box-sizing: border-box;
  height: calc(var(--tile) + 2 * var(--pad));
  padding: var(--pad);
}

.tile {
  position: relative;
  display: grid;
  place-items: center;
  flex: none;
  /* --grow is set on hover by onMove. */
  width: calc(var(--tile) * var(--grow, 1));
  height: calc(var(--tile) * var(--grow, 1));
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--ink);
  cursor: pointer;
  transition:
    background 0.15s,
    width 0.12s ease-out,
    height 0.12s ease-out;
}

.tile svg {
  width: calc(var(--icon) * var(--grow, 1));
  height: calc(var(--icon) * var(--grow, 1));
  transition:
    width 0.12s ease-out,
    height 0.12s ease-out;
}

.tile:hover {
  background: var(--chip);
}

/* The theme switch shows where a press takes the page: the moon by day, the sun by night. The
   theme is read from <html>, where index.html sets it before the first paint, so no script is
   needed and a built page is right from the start. */
.sun,
:root[data-theme="dark"] .moon {
  display: none;
}

:root[data-theme="dark"] .sun {
  display: block;
}

/* The code of the language the switch leads to, in the tile's top corner, above the icon. */
.code {
  position: absolute;
  top: 8%;
  right: 10%;
  padding: 0 2px;
  border-radius: 3px;
  background: var(--ink);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: calc(0.5rem * var(--grow, 1));
  font-weight: 600;
  line-height: 1.35;
}

.tile.active,
.tile.active:hover {
  background: var(--ink);
  color: var(--bg);
}

/* Tooltip with the tile's name, on hover and keyboard focus. Not on touch, where hover sticks after a tap. */
.tile::after {
  content: attr(aria-label) / "";
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--ink);
  color: var(--bg);
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transform: translate(-50%, 4px);
  transition:
    opacity 0.15s,
    transform 0.15s;
  pointer-events: none;
}

/* The open popover sits where the tooltip would. */
.tile[aria-expanded="true"]::after {
  display: none;
}

.popover {
  position: absolute;
  bottom: calc(100% + 0.75rem);
  left: 50%;
  width: min(20rem, 100vw - 2rem);
  max-height: 60vh;
  overflow-y: auto;
  border-radius: 26px;
  /* Opaque under the glass card: inside the dock, the card cannot blur the page behind it. */
  background: var(--stage);
  transform: translateX(-50%);
}

/* The popover rises into place and sinks away, so closing it on a link does not just cut. */
.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.pop-leave-active {
  pointer-events: none;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translate(-50%, 0.75rem);
}

@media (prefers-reduced-motion: reduce) {
  .pop-enter-from,
  .pop-leave-to {
    transform: translateX(-50%);
  }
}

.tile:focus-visible::after {
  opacity: 1;
  transform: translate(-50%, 0);
}

/* Only under a mouse, as the dock itself sees it: some phones say they can hover, and there the
   tooltip of a tapped tile came up and stayed. */
.mouse .tile:hover::after {
  opacity: 1;
  transform: translate(-50%, 0);
}

.sep {
  width: 1px;
  height: 28px;
  background: var(--glass-line);
  align-self: center;
}

/* A smaller dock on narrow screens: six 40px tiles instead of 48px. */
@media (max-width: 860px) {
  .dock-area {
    padding-bottom: 6.5rem;
  }

  .dock {
    --tile: 40px;
    --icon: 17px;
    --pad: 6px;
    bottom: 1rem;
    gap: 2px;
  }

  .sep {
    height: 22px;
  }
}
</style>
