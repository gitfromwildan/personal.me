<script setup lang="ts">
import { linkTarget } from "../links";
import { DATA } from "../data/resume";
import { toggleTheme } from "../composables/useTheme";
import AppIcon from "./ui/AppIcon.vue";

const year = new Date().getFullYear();
const social = Object.values(DATA.contact.social).filter((s) => s.navbar);
</script>

<template>
  <footer class="dock-area">
    <p class="copyright">© {{ year }} {{ DATA.name }} · {{ DATA.location }}</p>

    <nav class="dock glass" aria-label="Main">
      <RouterLink
        v-for="item in DATA.navbar"
        :key="item.href"
        :to="item.href"
        class="tile"
        :active-class="item.href === '/' ? undefined : 'active'"
        exact-active-class="active"
        :aria-label="item.label"
      >
        <AppIcon :name="item.icon" :size="19" />
      </RouterLink>

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
