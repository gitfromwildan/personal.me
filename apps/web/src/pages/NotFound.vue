<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import AppIcon from "../components/ui/AppIcon.vue";
import GlassBubble from "../components/ui/GlassBubble.vue";
import GlassText from "../components/ui/GlassText.vue";
import GlassTile from "../components/ui/GlassTile.vue";
import PageBlobs from "../components/ui/PageBlobs.vue";
import { usePageTitle } from "../composables/usePageTitle";
import { DATA } from "../data";

const { title, status, headline, body, cta, echo } = DATA.notFound;
const [home, blog] = DATA.navbar;
usePageTitle(() => title);

// The address that was asked for is shown once the page is in the browser: the page is built
// once, for no address in particular (see entry-server.ts).
const route = useRoute();
const arrived = ref(false);
onMounted(() => (arrived.value = true));

// The page is a view from under water: shafts of light come down from the surface, bubbles rise
// past, and the zero of "404" is a bubble that sends out sonar pings nothing answers.
const blobs = [
  {
    color: "--color-blob-d",
    width: "min(760px, 92%)",
    height: 340,
    top: -90,
    left: "max(4%, 50% - 380px)",
  },
  { color: "--color-blob-a", width: 520, top: "36%", right: -230 },
  { color: "--color-blob-c", width: 520, top: "56%", left: -250 },
];

// Each shaft leans away from the middle, where the light is: `tilt` is in degrees, `pace` the
// seconds one shimmer takes.
const RAYS = [
  { x: "9%", width: "9rem", tilt: 16, pace: 9 },
  { x: "31%", width: "5rem", tilt: 8, pace: 12 },
  { x: "61%", width: "11rem", tilt: -7, pace: 14 },
  { x: "83%", width: "6rem", tilt: -15, pace: 10 },
];

// `x` is a share of the page's width, `size` pixels, and `pace` the seconds the way up takes:
// bigger bubbles rise slower.
const RISERS = [
  { x: 5, size: 26, pace: 15 },
  { x: 16, size: 13, pace: 11 },
  { x: 27, size: 42, pace: 19 },
  { x: 40, size: 11, pace: 10 },
  { x: 57, size: 20, pace: 13 },
  { x: 68, size: 54, pace: 22 },
  { x: 78, size: 15, pace: 12 },
  { x: 90, size: 32, pace: 17 },
];

// What the signal was meant to reach: the hero's hardware, sunk and adrift. Places are shares
// of the page, `size` pixels on a wide screen. A narrow screen keeps only those marked `top`,
// which sit above the copy.
const DEVICES = [
  { icon: "satellite-dish", x: 11, y: 17, size: 96, tilt: -12, top: true },
  { icon: "mikrotik", x: 81, y: 12, size: 84, tilt: 10, top: true },
  { icon: "cctv", x: 85, y: 58, size: 104, tilt: -8 },
  { icon: "typescript", x: 7, y: 63, size: 76, tilt: 14 },
] as const;
</script>

<template>
  <main class="stage">
    <PageBlobs :blobs="blobs" />

    <!-- Behind the copy and over the blobs, which come first in the page. A size container, so
         a bubble can be told to rise the height of the water (100cqh). -->
    <div
      class="pointer-events-none absolute inset-0 -z-1 overflow-hidden @container-size"
      aria-hidden="true"
    >
      <span class="chart absolute inset-0" />
      <span
        v-for="r in RAYS"
        :key="r.x"
        class="ray absolute -top-16 left-(--x) h-[85%] w-(--w) origin-top rotate-(--tilt) opacity-60 blur-[14px]"
        :style="{ '--x': r.x, '--w': r.width, '--tilt': `${r.tilt}deg`, '--pace': `${r.pace}s` }"
      />
      <!-- On a narrow screen the tiles are smaller (--u), and only those above the copy stay. -->
      <GlassTile
        v-for="(d, i) in DEVICES"
        :key="d.icon"
        class="absolute top-(--y) left-(--x) size-[calc(var(--w)*var(--u))] rotate-(--tilt) rounded-[calc(var(--w)*0.26*var(--u))] opacity-80 shadow-[0_18px_36px_var(--color-glass-shadow)] backdrop-blur-[9px] [--tint:light-dark(#7dd3fc42,#38bdf81f)] [--u:1px] max-md:[--u:0.6px]"
        :class="'top' in d ? 'max-md:top-[3%]' : 'max-md:hidden'"
        :icon="d.icon"
        :style="{
          '--x': `${d.x}%`,
          '--y': `${d.y}%`,
          '--w': d.size,
          '--tilt': `${d.tilt}deg`,
          '--phase': i / DEVICES.length,
        }"
      />
      <span
        v-for="(b, i) in RISERS"
        :key="b.x"
        class="riser absolute top-full left-(--x) w-(--w) *:block *:w-full"
        :style="{
          '--x': `${b.x}%`,
          '--w': `${b.size}px`,
          '--pace': `${b.pace}s`,
          '--phase': (i * 0.37) % 1,
        }"
      >
        <GlassBubble />
      </span>
    </div>

    <div
      class="container flex min-h-svh flex-col items-center justify-center gap-7 pt-20 pb-30 text-center"
    >
      <p class="glass chip mono-label py-1.75 pr-3.5 pl-2.75 text-xs font-medium text-ink">
        <span class="dot" />
        {{ status }} · 404
      </p>

      <!-- A picture of the number: the chip above and the page's title say it in words. The
           sonar is centred on the zero, which is in the middle of the number, under the digits;
           the zero is as tall as the digits beside it. -->
      <p
        class="relative flex items-center gap-[0.03em] text-[clamp(7rem,31vw,16rem)] tracking-[-0.04em]"
        aria-hidden="true"
      >
        <span class="absolute top-1/2 left-1/2 -z-1 aspect-square w-[0.74em] -translate-1/2">
          <!-- One ping after another. Only a ring's upper arc is drawn, the part that heads for
               the surface: a full ring would cross the headline below. -->
          <span
            v-for="i in 3"
            :key="i"
            class="absolute inset-0 animate-ping rounded-full opacity-0 shadow-[inset_0_0_0_1.5px_var(--color-accent),0_0_1rem_var(--color-bubble-edge)] mask-b-from-50% mask-b-to-72% motion-reduce:animate-none"
            :style="{ animationDelay: `${(i - 1) * 1.6}s` }"
          />
        </span>
        <GlassText text="4" :depth="12" gloss />
        <GlassBubble class="w-[0.74em] flex-none" />
        <GlassText text="4" :depth="12" gloss />
      </p>

      <h1 class="text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.038em]">
        <span
          v-for="(line, i) in headline"
          :key="i"
          class="block"
          :class="{ 'text-s-muted': i === 1 }"
        >
          {{ line }}
        </span>
      </h1>
      <p class="max-w-136 text-[1.0625rem] leading-[1.55] text-ink-2">{{ body }}</p>

      <div class="flex flex-wrap justify-center gap-3">
        <RouterLink class="btn solid" :to="home.href">
          <AppIcon :name="home.icon" />
          {{ cta }}
        </RouterLink>
        <RouterLink class="glass btn" :to="blog.href">
          <AppIcon :name="blog.icon" />
          {{ blog.label }}
        </RouterLink>
      </div>

      <!-- Keeps its line while it is empty, so nothing moves when the address arrives. -->
      <p class="echo mono-label plain min-h-[1.5em] max-w-full truncate leading-[1.5]">
        <template v-if="arrived">
          {{ echo }} <span class="text-ink">{{ route.path }}</span>
        </template>
      </p>
    </div>
  </main>
</template>

<style scoped>
@reference "../style.css";

/* A sounding chart: a field of dots, clearest around the number. */
.chart {
  background: radial-gradient(circle, var(--color-track) 1px, transparent 1.5px) center / 1.75rem
    1.75rem;
  mask-image: radial-gradient(ellipse 62% 58% at 50% 40%, #000, transparent);
}

.ray {
  background: linear-gradient(180deg, var(--color-gloss), var(--color-blob-d) 40%, transparent);
  animation: shimmer var(--pace) ease-in-out infinite alternate;
}

/* Light through moving water: a shaft dims, widens and leans a little, then comes back. */
@keyframes shimmer {
  to {
    opacity: 0.25;
    transform: rotate(3deg) scaleX(1.3);
  }
}

/* A bubble starts below the water and ends above it, swaying as it goes: the way up and the
   sway are two properties, so each keeps its own pace. */
.riser {
  --sway: calc(var(--w) * 0.45);
  animation:
    rise var(--pace) linear calc(var(--phase) * var(--pace) * -1) infinite,
    sway calc(var(--pace) / 4) ease-in-out infinite alternate;
}

/* A rising bubble keeps still inside: its own wobble is too small to see at this size, and
   without it the browser draws the bubble once and only moves it. */
.riser > *,
.riser :deep(*) {
  animation: none;
}

@keyframes rise {
  from {
    translate: 0 0;
    opacity: 0;
  }
  12%,
  80% {
    opacity: 0.85;
  }
  to {
    translate: 0 calc(-100cqh - 100%);
    opacity: 0;
  }
}

@keyframes sway {
  from {
    transform: translateX(calc(var(--sway) * -1));
  }
  to {
    transform: translateX(var(--sway));
  }
}

/* Without the way up, the bubbles would wait below the water, out of sight. */
.ray {
  @variant motion-reduce {
    animation: none;
  }
}

.riser {
  @variant motion-reduce {
    @apply hidden;
  }
}
</style>
