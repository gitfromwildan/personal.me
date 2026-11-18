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
    color: "--blob-d",
    width: "min(760px, 92%)",
    height: 340,
    top: -90,
    left: "max(4%, 50% - 380px)",
  },
  { color: "--blob-a", width: 520, top: "36%", right: -230 },
  { color: "--blob-c", width: 520, top: "56%", left: -250 },
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

    <div class="water" aria-hidden="true">
      <span class="chart" />
      <span
        v-for="r in RAYS"
        :key="r.x"
        class="ray"
        :style="{ '--x': r.x, '--w': r.width, '--tilt': `${r.tilt}deg`, '--pace': `${r.pace}s` }"
      />
      <GlassTile
        v-for="(d, i) in DEVICES"
        :key="d.icon"
        class="device"
        :class="{ top: 'top' in d }"
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
        class="riser"
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

    <div class="container content">
      <p class="glass chip mono-label status">
        <span class="dot" />
        {{ status }} · 404
      </p>

      <!-- A picture of the number: the chip above and the page's title say it in words. -->
      <p class="code" aria-hidden="true">
        <span class="sonar">
          <span v-for="i in 3" :key="i" class="ping" :style="{ '--i': i - 1 }" />
        </span>
        <GlassText text="4" :depth="12" gloss />
        <GlassBubble class="zero" />
        <GlassText text="4" :depth="12" gloss />
      </p>

      <h1 class="headline">
        <span v-for="(line, i) in headline" :key="i" :class="{ muted: i === 1 }">{{ line }}</span>
      </h1>
      <p class="body">{{ body }}</p>

      <div class="actions">
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
      <p class="mono-label plain echo">
        <template v-if="arrived">
          {{ echo }} <span class="address">{{ route.path }}</span>
        </template>
      </p>
    </div>
  </main>
</template>

<style scoped>
/* Behind the copy and over the blobs, which come first in the page. A size container, so a
   bubble can be told to rise the height of the water (100cqh). */
.water {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  container-type: size;
  pointer-events: none;
}

/* A sounding chart: a field of dots, clearest around the number. */
.chart {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, var(--track) 1px, transparent 1.5px) center / 1.75rem 1.75rem;
  mask-image: radial-gradient(ellipse 62% 58% at 50% 40%, #000, transparent);
}

.ray {
  position: absolute;
  top: -4rem;
  left: var(--x);
  width: var(--w);
  height: 85%;
  background: linear-gradient(180deg, var(--gloss), var(--blob-d) 40%, transparent);
  filter: blur(14px);
  opacity: 0.6;
  rotate: var(--tilt);
  transform-origin: 50% 0;
  animation: shimmer var(--pace) ease-in-out infinite alternate;
}

/* Light through moving water: a shaft dims, widens and leans a little, then comes back. */
@keyframes shimmer {
  to {
    opacity: 0.25;
    transform: rotate(3deg) scaleX(1.3);
  }
}

.device {
  --u: 1px;
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: calc(var(--w) * var(--u));
  height: calc(var(--w) * var(--u));
  --glass-radius: calc(var(--w) * 0.26 * var(--u));
  --glass-blur: 9px;
  --glass-elevation: 0 18px 36px;
  --tint: light-dark(#7dd3fc42, #38bdf81f);
  rotate: var(--tilt);
  opacity: 0.8;
}

/* A bubble starts below the water and ends above it, swaying as it goes: the way up and the
   sway are two properties, so each keeps its own pace. */
.riser {
  --sway: calc(var(--w) * 0.45);
  position: absolute;
  top: 100%;
  left: var(--x);
  width: var(--w);
  animation:
    rise var(--pace) linear calc(var(--phase) * var(--pace) * -1) infinite,
    sway calc(var(--pace) / 4) ease-in-out infinite alternate;
}

.riser > * {
  display: block;
  width: 100%;
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

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.75rem;
  min-height: 100svh;
  padding-block: 5rem 7.5rem;
  text-align: center;
}

.status {
  padding: 7px 14px 7px 11px;
  color: var(--ink);
  font-size: 0.75rem;
  font-weight: 500;
}

.code {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.03em;
  margin: 0;
  font-size: clamp(7rem, 31vw, 16rem);
  letter-spacing: -0.04em;
}

/* As tall as the digits beside it. */
.zero {
  flex: none;
  width: 0.74em;
}

/* Centred on the zero, which is in the middle of the number, and under the digits. */
.sonar {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -1;
  width: 0.74em;
  aspect-ratio: 1;
  translate: -50% -50%;
}

/* One ping after another leaves the bubble and fades with distance. Only its upper arc is
   drawn, the part that heads for the surface: a full ring would cross the headline below. */
.ping {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  mask-image: linear-gradient(#000 50%, transparent 72%);
  box-shadow:
    inset 0 0 0 1.5px var(--accent),
    0 0 1rem var(--bubble-edge);
  opacity: 0;
  animation: ping 4.8s cubic-bezier(0.2, 0.6, 0.4, 1) calc(var(--i) * 1.6s) infinite;
}

@keyframes ping {
  from {
    scale: 0.9;
    opacity: 0.6;
  }
  to {
    scale: 3.4;
    opacity: 0;
  }
}

.headline {
  margin: 0;
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.038em;
}

.headline span {
  display: block;
}

.muted {
  color: var(--s-muted);
}

.body {
  max-width: 34rem;
  margin: 0;
  color: var(--ink-2);
  font-size: 1.0625rem;
  line-height: 1.55;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.echo {
  max-width: 100%;
  min-height: 1.5em;
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.address {
  color: var(--ink);
}

@media (max-width: 860px) {
  .device {
    --u: 0.6px;
  }

  .device:not(.top) {
    display: none;
  }

  .device.top {
    top: 3%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ray,
  .ping {
    animation: none;
  }

  /* Without the way up, the bubbles would wait below the water, out of sight. */
  .riser {
    display: none;
  }
}
</style>
