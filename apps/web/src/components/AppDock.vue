<script setup lang="ts">
import { linkTarget } from "../links";
import { DATA } from "../data";
import { onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { hasToc, narrow, tocOpen } from "../composables/useDockToc";
import { toggleTheme } from "../composables/useTheme";
import AppIcon from "./ui/AppIcon.vue";

const year = new Date().getFullYear();
const social = Object.values(DATA.contact.social).filter((s) => s.navbar);
const [, blog] = DATA.navbar;
const route = useRoute();

// While the popover is open, a press outside the dock closes it.
const dock = ref<HTMLElement | null>(null);
function onPress(event: PointerEvent) {
  if (!dock.value?.contains(event.target as Node)) tocOpen.value = false;
}
watch(tocOpen, (open) =>
  open ? addEventListener("pointerdown", onPress) : removeEventListener("pointerdown", onPress),
);
onUnmounted(() => removeEventListener("pointerdown", onPress));
</script>

<template>
  <footer class="dock-area">
    <p class="copyright">© {{ year }} {{ DATA.name }} · {{ DATA.location }}</p>

    <nav ref="dock" class="dock glass" aria-label="Main" @keydown.esc="tocOpen = false">
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
      <div
        v-show="tocOpen"
        id="dock-toc"
        class="popover"
        @click="($event.target as Element).closest('a') && (tocOpen = false)"
      />

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

      <span class="sep" aria-hidden="true"></span>

      <button type="button" class="tile" aria-label="Toggle theme" @click="toggleTheme">
        <AppIcon name="moon" :size="19" />
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
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
}

.tile {
  position: relative;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--ink);
  cursor: pointer;
  transition: background 0.15s;
}

.tile:hover {
  background: var(--chip);
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

.tile:focus-visible::after {
  opacity: 1;
  transform: translate(-50%, 0);
}

@media (hover: hover) {
  .tile:hover::after {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.sep {
  width: 1px;
  height: 28px;
  background: var(--glass-line);
}

/* A smaller dock on narrow screens: six 40px tiles instead of 48px. */
@media (max-width: 860px) {
  .dock-area {
    padding-bottom: 6.5rem;
  }

  .dock {
    bottom: 1rem;
    gap: 2px;
    padding: 6px;
  }

  .tile {
    width: 40px;
    height: 40px;
  }

  .tile svg {
    width: 17px;
    height: 17px;
  }

  .sep {
    height: 22px;
  }
}
</style>
