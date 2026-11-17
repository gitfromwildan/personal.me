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
        :title="item.label"
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
        :title="s.name"
        v-bind="linkTarget(s.url)"
      >
        <AppIcon :name="s.icon" :size="19" />
      </a>

      <span class="sep" aria-hidden="true"></span>

      <button
        type="button"
        class="tile"
        aria-label="Toggle theme"
        title="Toggle theme"
        @click="toggleTheme"
      >
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

.sep {
  width: 1px;
  height: 28px;
  background: var(--glass-line);
}
</style>
