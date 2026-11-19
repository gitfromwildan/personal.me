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
  <aside
    class="glass flex flex-col gap-5 rounded-[26px] px-6.5 pt-6.5 pb-6 shadow-[0_20px_44px_var(--color-glass-shadow)]"
    :aria-label="reading.label"
  >
    <div class="flex flex-col gap-2.5">
      <p class="mono-label plain flex justify-between text-xs">
        <span class="flex items-center gap-1.75"
          ><AppIcon name="clock" :size="14" />{{
            left ? `${left} ${reading.left}` : reading.done
          }}</span
        >
        <span class="font-semibold text-ink">{{ percent }}%</span>
      </p>
      <div
        class="track h-2.5 rounded-[5px] inset-ring inset-ring-rim-lo"
        role="progressbar"
        :aria-label="reading.label"
        :aria-valuenow="percent"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="{ '--value': `${percent}%` }"
      />
    </div>

    <nav
      v-if="toc.length"
      class="flex flex-col gap-5 border-t border-glass-line pt-5"
      :aria-label="tocLabel"
    >
      <p class="mono-label text-xs tracking-[0.08em]">{{ tocLabel }}</p>
      <!-- The rail is drawn per item: read items fill it, the current one holds the bead. The
           vertical padding is on the item, not on the link: padding on a clamped box shows the
           cut line. Long headings stop after two lines; the full text is in the link's title. -->
      <ol>
        <li
          v-for="(item, i) in toc"
          :key="item.href"
          class="relative flex min-h-9 items-center py-1.75 pl-6"
          :class="{ read: i < activeIndex, current: i === activeIndex }"
        >
          <span
            v-if="i === activeIndex"
            class="bead absolute top-[calc(50%-8px)] -left-1 size-4 outline-accent"
            aria-hidden="true"
          />
          <a
            class="line-clamp-2 text-sm leading-[1.35] hover:text-ink"
            :class="[
              i === activeIndex ? 'font-semibold text-ink' : 'text-s-muted',
              { 'pl-3': item.level > 2 },
            ]"
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
@reference "../../style.css";

.track {
  background:
    linear-gradient(90deg, var(--color-liquid-hi), var(--color-liquid-lo)) left / var(--value) 100%
      no-repeat,
    var(--color-track);
}

/* One 8px slice of the rail per item, so it follows items of any height. */
li::before {
  content: "";
  @apply absolute inset-y-0 left-0 w-2 bg-track;
}

li:first-child::before {
  @apply rounded-t-sm;
}

li:last-child::before {
  @apply rounded-b-sm;
}

.read::before {
  @apply bg-liquid-lo;
}

.current::before {
  background: linear-gradient(
    180deg,
    var(--color-liquid-lo),
    var(--color-liquid-hi) 50%,
    var(--color-track) 50%
  );
}
</style>
