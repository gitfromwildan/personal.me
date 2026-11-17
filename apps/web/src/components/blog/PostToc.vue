<script setup lang="ts">
import { computed } from "vue";
import { DATA } from "../../data";
import AppIcon from "../ui/AppIcon.vue";

const props = defineProps<{
  toc: { level: number; text: string; href: string }[];
  /** Reading time of the whole post. */
  minutes: number;
  /** 0 to 1 */
  progress: number;
  /** href of the heading being read */
  active?: string;
}>();

const { reading, tocLabel } = DATA.blog;
const percent = computed(() => Math.round(props.progress * 100));
const left = computed(() => Math.ceil(props.minutes * (1 - props.progress)));
const activeIndex = computed(() => props.toc.findIndex((item) => item.href === props.active));
</script>

<template>
  <aside class="glass toc" :aria-label="reading.label">
    <div class="progress">
      <p class="mono-label plain head">
        <span class="time"
          ><AppIcon name="clock" :size="14" />{{
            left ? `${left} ${reading.left}` : reading.done
          }}</span
        >
        <span class="percent">{{ percent }}%</span>
      </p>
      <div
        class="track"
        role="progressbar"
        :aria-label="reading.label"
        :aria-valuenow="percent"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="{ '--value': `${percent}%` }"
      />
    </div>

    <nav v-if="toc.length" class="contents" :aria-label="tocLabel">
      <p class="mono-label label">{{ tocLabel }}</p>
      <!-- The rail is drawn per item: read items fill it, the current one holds the bead. -->
      <ol class="items">
        <li
          v-for="(item, i) in toc"
          :key="item.href"
          :class="{ read: i < activeIndex, current: i === activeIndex, sub: item.level > 2 }"
        >
          <span v-if="i === activeIndex" class="bead" aria-hidden="true" />
          <a
            :href="item.href"
            :title="item.text"
            :aria-current="i === activeIndex ? 'location' : undefined"
          >
            {{ item.text }}
          </a>
        </li>
      </ol>
    </nav>
  </aside>
</template>

<style scoped>
.toc {
  --glass-radius: 26px;
  --glass-elevation: 0 20px 44px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.625rem 1.625rem 1.5rem;
}

.progress {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.head {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.time {
  display: flex;
  align-items: center;
  gap: 0.4375rem;
}

.percent {
  color: var(--ink);
  font-weight: 600;
}

.track {
  height: 10px;
  border-radius: 5px;
  background:
    linear-gradient(90deg, var(--liquid-hi), var(--liquid-lo)) left / var(--value) 100% no-repeat,
    var(--track);
  box-shadow: inset 0 0 0 1px var(--rim-lo);
}

.contents {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--glass-line);
}

.label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.items li {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 2.25rem;
  /* The vertical padding is here, not on the link: padding on a clamped box shows the cut line. */
  padding: 0.4375rem 0 0.4375rem 1.5rem;
}

/* One 8px slice of the rail per item, so it follows items of any height. */
.items li::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 8px;
  background: var(--track);
}

.items li:first-child::before {
  border-radius: 4px 4px 0 0;
}

.items li:last-child::before {
  border-radius: 0 0 4px 4px;
}

.items .read::before {
  background: var(--liquid-lo);
}

.items .current::before {
  background: linear-gradient(180deg, var(--liquid-lo), var(--liquid-hi) 50%, var(--track) 50%);
}

.bead {
  --bead-size: 16px;
  --bead-ring: var(--accent);
  position: absolute;
  top: calc(50% - 8px);
  left: -4px;
}

.items a {
  color: var(--s-muted);
  font-size: 0.875rem;
  line-height: 1.35;
  text-decoration: none;
  /* Long headings stop after two lines; the full text is in the link's title. */
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.items .sub a {
  padding-left: 0.75rem;
}

.items a:hover,
.items .current a {
  color: var(--ink);
}

.items .current a {
  font-weight: 600;
}
</style>
