<script setup lang="ts">
import { ref, useSSRContext } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import GlassBubble from "../ui/GlassBubble.vue";
import GlassTile from "../ui/GlassTile.vue";
import { DATA } from "../../data";
import { linkTarget } from "../../links";
import ripple from "./ripple.webp?inline";

// The portrait is the largest thing on the first screen: the page that is built is told to
// fetch it first of all (see prerender.ts), before its styles and scripts.
const PORTRAIT = {
  src: "/hero-portrait-1250.webp",
  srcset:
    "/hero-portrait-900.webp 900w, /hero-portrait-1250.webp 1250w, /hero-portrait-1670.webp 1670w",
  sizes: "(max-width: 860px) min(26rem, 100vw - 2.5rem), 1250px",
};
if (import.meta.env.SSR) useSSRContext()!.preloadImage = PORTRAIT;

const [current] = DATA.work;
const FACTS = [
  ...DATA.hero.facts,
  { key: DATA.ui.now, value: `${current.title}, ${current.company}` },
];

// Positions and sizes are artboard coordinates (1440px wide, hero top at 0), given to CSS as
// plain numbers (--x, --y, --w, --h) so the whole stage can be drawn at another scale.
const BLOBS = [
  { x: 790, y: 90, color: "var(--color-blob-c)" },
  { x: 1120, y: 250, color: "var(--color-blob-a)" },
];

// Glass tiles around the portrait, each with the mark of a technology this page is about: the
// CCTV, network and satellite links of the IT support side, and the languages and tools of the
// open source side. They are the nodes of a graph: listed in the order they are wired, each to
// the next and the last back to the first, in a ring that passes behind the person.
const TINTS = ["light-dark(#42ebd442, #22d3ee1f)", "light-dark(#34d39931, #10b9811d)"];
const TILES = [
  { icon: "cctv", x: 858, y: 448, size: 108 },
  { icon: "react", x: 872, y: 330, size: 104 },
  { icon: "typescript", x: 884, y: 62, size: 88 },
  { icon: "mikrotik", x: 1266, y: 80, size: 116 },
  { icon: "tailwindcss", x: 1346, y: 236, size: 84 },
  { icon: "satellite-dish", x: 1318, y: 404, size: 100 },
] as const;

// The wires of the graph, each from the middle of one tile to the middle of the next: where it
// starts, how long it is and which way it points. A pulse runs each wire in turn, so that a
// signal is seen to travel the stack from node to node.
const WIRES = TILES.map((from, i) => {
  const to = TILES[(i + 1) % TILES.length];
  const [x, y] = [from.x + from.size / 2, from.y + from.size / 2];
  const [dx, dy] = [to.x + to.size / 2 - x, to.y + to.size / 2 - y];
  return { x, y, length: Math.hypot(dx, dy), angle: Math.atan2(dy, dx) };
});

// `pace` is the seconds one rise and fall takes: bigger bubbles move slower.
const BUBBLES = [
  { x: 925, y: 60, size: 72, z: 13, pace: 6 },
  { x: 904, y: 266, size: 36, z: 14, pace: 5, faint: true },
  { x: 762, y: 414, size: 84, z: 15, pace: 7 },
  { x: 1352, y: 196, size: 200, z: 17, pace: 9 },
];

// The four bubbles start out as one big one, which follows the mouse around the hero. A click
// bursts it into the four, which fly to their own places, while a ripple spreads from the spot
// across the hero, bending what it passes like a wave on water. They gather back into one
// when the mouse next comes into the hero. `BIG` is where it rests when no mouse is in the hero. CSS and the SVG filter draw and
// move all of it: the script only says where the mouse is, and where and whether it burst.
const BIG = { x: 821, y: 125, size: 220 };
const burst = ref(false);
const art = ref<HTMLElement | null>(null);
const big = ref<HTMLElement | null>(null);

// ripple.webp is the ripple as a picture the filter reads: red is how far a pixel is pushed
// sideways and green how far down, half meaning not at all. It holds four rings, by turns
// pushing away from the middle and pulling towards it, fainter towards the middle: the crests
// of a wave and the troughs between them. A 64px bitmap, because a drawn (SVG) picture is
// drawn again at every size the ripple passes through, which is far too slow.
// How the ripple travels: it starts as wide as the bubble and ends nine times that, slowing.
const SPREAD = { dur: "1.6s", calcMode: "spline", keyTimes: "0;1", keySplines: "0.2 0.6 0.4 1" };
const GROWTH = 9;
// The ripple picture's place and size over that time, as the filter's animations want them.
const wave = ref<Record<string, string>>({});

function follow(event: PointerEvent) {
  if (event.pointerType !== "mouse" || !art.value) return;
  const box = art.value.getBoundingClientRect();
  art.value.style.setProperty("--mx", `${event.clientX - box.left}px`);
  art.value.style.setProperty("--my", `${event.clientY - box.top}px`);
}

function home() {
  art.value?.style.removeProperty("--mx");
  art.value?.style.removeProperty("--my");
}

function gather(event: PointerEvent) {
  if (event.pointerType !== "mouse") return;
  follow(event);
  burst.value = false;
}

function pop(event: MouseEvent) {
  // Links and buttons in the hero keep their clicks. The big bubble is the button that pops.
  if ((event.target as Element).closest("a, button:not(.big)") || !big.value) return;
  // A mouse gathers the bubbles by coming back in (see gather), so its clicks only pop. A
  // finger or the keyboard has nothing but the click, which does both for them.
  if (burst.value && (event as PointerEvent).pointerType === "mouse") return;
  // The ripple spreads from around the bubble, measured from the hero's corner.
  const hero = (event.currentTarget as Element).getBoundingClientRect();
  const { x, y, width } = big.value.getBoundingClientRect();
  const grown = width * GROWTH;
  const moved = (from: number) => `${from};${from - (grown - width) / 2}`;
  const sized = `${width};${grown}`;
  wave.value = { x: moved(x - hero.x), y: moved(y - hero.y), width: sized, height: sized };
  burst.value = !burst.value;
}
</script>

<template>
  <!-- --stage is the width of the picture on one column: a percentage in it is of the hero's
       width wherever it is used. -->
  <section
    id="top"
    class="hero relative overflow-hidden pt-33 pb-18 max-md:flex max-md:flex-col max-md:gap-10 max-md:pt-24 max-md:pb-14 max-md:[--stage:min(26rem,100%_-_2.5rem)]"
    :class="burst ? 'burst' : 'cursor-pointer'"
    aria-labelledby="hero-title"
    @pointerenter="gather"
    @pointermove="follow"
    @pointerleave="home"
    @click="pop"
  >
    <!-- The water the hero is seen through while a ripple crosses it (see .burst): the ripple
         picture, growing from the bubble, over grey, which leaves pixels where they are. It is
         made anew for each pop, which is what starts its animations. -->
    <svg v-if="burst" class="water absolute" width="0" height="0" aria-hidden="true">
      <filter
        id="hero-water"
        x="0"
        y="0"
        width="100%"
        height="100%"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-color="#808080" result="still" />
        <feImage :href="ripple" preserveAspectRatio="none" result="ripple">
          <animate
            v-for="(values, name) in wave"
            :key="name"
            :attributeName="name"
            :values="values"
            v-bind="SPREAD"
          />
        </feImage>
        <feMerge result="water">
          <feMergeNode in="still" />
          <feMergeNode in="ripple" />
        </feMerge>
        <!-- A gentle push, which holds for the first half of the way and then dies away. -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="water"
          scale="0"
          xChannelSelector="R"
          yChannelSelector="G"
        >
          <animate attributeName="scale" values="14;12;0" :dur="SPREAD.dur" />
        </feDisplacementMap>
      </filter>
    </svg>

    <!-- Decoration, apart from the big bubble, which the keyboard can pop too. The 1440px
         artboard, centred, so layers keep their right-hand place. On one column it comes after
         the copy, scaled to the column. -->
    <div
      ref="art"
      class="art absolute inset-y-0 left-1/2 -ml-[720px] w-[1440px] max-md:relative max-md:inset-auto max-md:order-1 max-md:mx-auto max-md:aspect-[680/742] max-md:w-(--stage) max-md:@container"
      :style="{ '--bx': BIG.x + BIG.size / 2, '--by': BIG.y + BIG.size / 2 }"
    >
      <span
        v-for="b in BLOBS"
        :key="b.x"
        class="blob z-8 blur-[45px]"
        aria-hidden="true"
        :style="{ '--x': b.x, '--y': b.y, '--w': 420, background: b.color }"
      />
      <span
        v-for="(w, i) in WIRES"
        :key="i"
        class="wire z-9 origin-left bg-accent/32"
        aria-hidden="true"
        :style="{ '--x': w.x, '--y': w.y, '--w': w.length, '--i': i, rotate: `${w.angle}rad` }"
      >
        <span class="pulse" />
      </span>
      <GlassTile
        v-for="(t, i) in TILES"
        :key="t.icon"
        class="z-10 shadow-[0_18px_36px_var(--color-glass-shadow)] backdrop-blur-[9px]"
        :icon="t.icon"
        :style="{
          '--x': t.x,
          '--y': t.y,
          '--w': t.size,
          borderRadius: `calc(${t.size * 0.26} * var(--u))`,
          '--tint': TINTS[i % TINTS.length],
          '--phase': i / TILES.length,
        }"
      />
      <!-- The photo is 1672 by 941, in the box the design gives it. It fades out at the bottom
           itself: a gradient box laid over it would show as a box wherever it reaches past the
           person. -->
      <img
        class="z-16 max-w-none mask-b-from-77% mask-b-to-94%"
        :src="PORTRAIT.src"
        :srcset="PORTRAIT.srcset"
        :sizes="PORTRAIT.sizes"
        width="1250"
        height="703"
        alt=""
        fetchpriority="high"
        :style="{ '--x': 308, '--y': 97, '--w': 1250, '--h': 703 }"
      />
      <GlassBubble
        v-for="(b, i) in BUBBLES"
        :key="b.x"
        class="bubble"
        :class="{ faint: b.faint }"
        :style="{
          '--x': b.x,
          '--y': b.y,
          '--w': b.size,
          zIndex: b.z,
          '--pace': `${b.pace}s`,
          '--phase': i / BUBBLES.length,
          '--i': i,
        }"
      />
      <button
        type="button"
        ref="big"
        class="big"
        :aria-label="burst ? DATA.ui.bubble.gather : DATA.ui.bubble.pop"
        :aria-pressed="burst"
        :style="{ '--x': BIG.x, '--y': BIG.y, '--w': BIG.size }"
      >
        <GlassBubble />
      </button>
    </div>

    <!-- On one column this box steps aside (display: contents): the copy, the picture and the
         profile strip are then rows of the hero itself, in that order. -->
    <div class="container relative z-19 flex flex-col gap-20 max-md:contents">
      <!-- The copy stops a gutter (1.5rem) short of the picture. Both are placed from the hero's
           middle, which is also the middle of this column: so the picture starts at 50% plus
           --art-start, however wide the window is and however long the text of a language
           runs. --art-start is where the big bubble rests, on the artboard, whose middle is at
           720. -->
      <div
        class="flex max-w-[min(680px,50%+var(--art-start)*1px-1.5rem)] flex-col items-start gap-7.5 max-md:mx-auto max-md:w-[min(1120px,100%-2.5rem)] max-md:max-w-[680px]"
        :style="{ '--art-start': BIG.x - 720 }"
      >
        <p
          class="glass chip mono-label status origin-center py-1.75 pr-3.5 pl-2.75 text-xs font-medium text-ink"
        >
          <span class="dot" />
          {{ DATA.hero.status }}
        </p>
        <h1
          id="hero-title"
          class="headline text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.033] font-semibold tracking-[-0.038em]"
        >
          <span
            v-for="(line, i) in DATA.hero.headline"
            :key="i"
            class="block"
            :class="{ 'text-s-muted': i === 1 }"
          >
            {{ line }}
          </span>
        </h1>
        <p class="max-w-145 text-[1.1875rem] leading-[1.53] text-ink-2">{{ DATA.hero.subhead }}</p>
        <div class="actions flex flex-wrap gap-3">
          <a class="btn solid" href="#projects">
            {{ DATA.hero.cta }}
            <AppIcon name="arrow-down" />
          </a>
          <a class="glass btn" :href="DATA.hero.hire.url" v-bind="linkTarget(DATA.hero.hire.url)">
            <AppIcon :name="DATA.hero.hire.icon" />
            {{ DATA.hero.hire.label }}
          </a>
        </div>
      </div>

      <!-- On one column the strip is pulled up over the foot of the picture, where the portrait
           fades out, so the photo runs behind its glass as it does on a wide screen. -->
      <div
        class="glass flex items-center gap-8 rounded-[28px] px-8 py-5.5 max-md:z-19 max-md:order-2 max-md:mx-auto max-md:-mt-[calc(2.5rem+0.28*var(--stage))] max-md:w-[min(1120px,100%-2.5rem)] max-md:flex-col max-md:items-stretch max-md:gap-4"
      >
        <div class="flex items-center gap-3.5">
          <img class="avatar" :src="DATA.avatarUrl" alt="" width="56" height="56" />
          <div>
            <p class="mb-0.75 text-[1.0625rem] font-semibold tracking-[-0.018em]">
              {{ DATA.name }}
            </p>
            <p class="text-sm text-s-muted">{{ DATA.location }}</p>
          </div>
        </div>
        <dl class="flex flex-1 gap-8 max-md:flex-col max-md:gap-4">
          <div
            v-for="f in FACTS"
            :key="f.key"
            class="flex flex-1 flex-col gap-1.5 border-l border-glass-line pl-8 max-md:border-t max-md:border-l-0 max-md:pt-4 max-md:pl-0"
          >
            <dt class="mono-label text-2xs tracking-[0.07em]">{{ f.key }}</dt>
            <dd class="text-sm font-medium">{{ f.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "../../style.css";

/* While the ripple travels, the hero is drawn through the #hero-water filter, which bends it. */
.hero.burst {
  animation: water 1.6s;

  @variant motion-reduce {
    animation: none;
  }
}

@keyframes water {
  from,
  to {
    filter: url(#hero-water);
  }
}

/* Each layer of the artboard. --u is the length of one artboard pixel, and (--ox, --oy) the
   artboard point drawn at the stage's top left corner. A layer without --h is square. On one
   column the stage shows the part of the artboard that holds the portrait (680 by 742 artboard
   pixels from 760, 60), scaled to the column. */
.art > * {
  --u: 1px;
  --ox: 0;
  --oy: 0;
  @apply absolute;
  left: calc((var(--x) - var(--ox)) * var(--u));
  top: calc((var(--y) - var(--oy)) * var(--u));
  width: calc(var(--w) * var(--u));
  height: calc(var(--h, var(--w)) * var(--u));

  @variant max-md {
    --u: calc(100cqw / 680);
    --ox: 760;
    --oy: 60;
  }
}

/* A wire is a hairline laid from its start along the x axis, then turned about that start to
   point at the tile it leads to. Under the tiles, so each end is seen through the glass. */
.art > .wire {
  height: 1.5px;
}

/* The pulse is as long as its wire and drawn only at its tail end, so sliding it by its own
   length takes it from one tile to the next. Sliding costs the page nothing. The six take
   turns, a sixth of the round each: the signal goes once round the ring every 7.2 seconds. */
.pulse {
  --dash: 2.25rem;
  @apply absolute inset-x-0 -inset-y-[1.5px] rounded-full opacity-0;
  background: linear-gradient(90deg, transparent, var(--color-accent)) left / var(--dash) 100%
    no-repeat;
  animation: signal 7.2s linear calc(var(--i) * 1.2s) infinite;

  @variant motion-reduce {
    @apply hidden;
  }
}

/* The head of the pulse: a bright point with a glow, at the leading end of the dash. */
.pulse::after {
  content: "";
  @apply absolute top-1/2 left-[calc(var(--dash)-4px)] size-[7px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_var(--color-accent)];
}

@keyframes signal {
  0% {
    translate: 0;
    opacity: 0;
  }
  1.5%,
  15% {
    opacity: 1;
  }
  16.66%,
  100% {
    translate: calc(100% - var(--dash));
    opacity: 0;
  }
}

/* Where the big bubble is, in the stage: at the mouse (--mx, --my, set by the script) or, with
   no mouse in the hero, at its resting place (--bx, --by). */
.art > .bubble,
.big {
  --cx: var(--mx, calc((var(--bx) - var(--ox)) * var(--u)));
  --cy: var(--my, calc((var(--by) - var(--oy)) * var(--u)));
}

/* Until the big bubble is burst, the four wait inside it, shrunk to nothing. Bursting sends them
   out to their places, one a little after the other; gathering brings them back quicker.
   Direct children only: the big bubble's own drawing is a .bubble too. */
.art > .bubble {
  --rest: 1;
  opacity: var(--rest);
  transition:
    translate 0.75s cubic-bezier(0.2, 1.35, 0.4, 1) calc(var(--i) * 70ms),
    scale 0.75s cubic-bezier(0.2, 1.35, 0.4, 1) calc(var(--i) * 70ms),
    opacity 0.2s calc(var(--i) * 70ms);
}

.art > .bubble.faint {
  --rest: 0.6;
}

.hero:not(.burst) .art > .bubble {
  translate: calc(var(--cx) - (var(--x) - var(--ox) + var(--w) / 2) * var(--u))
    calc(var(--cy) - (var(--y) - var(--oy) + var(--w) / 2) * var(--u));
  scale: 0;
  opacity: 0;
  transition:
    translate 0.4s ease-in,
    scale 0.4s ease-in,
    opacity 0.15s 0.25s;
}

/* The big bubble trails the mouse a little, over everything in the hero, and never takes a
   click: the hero does (see pop), so the buttons under it still work. */
.art > .big {
  @apply pointer-events-none top-0 left-0 z-30 rounded-[50%];
  translate: calc(var(--cx) - 50%) calc(var(--cy) - 50%);
  transition: translate 0.35s cubic-bezier(0.2, 0.7, 0.3, 1);
}

.big > * {
  @apply w-full;
  transition:
    scale 0.45s cubic-bezier(0.2, 1.4, 0.4, 1),
    opacity 0.3s;
}

.art > .bubble,
.art > .big,
.big > * {
  @variant motion-reduce {
    transition: none;
  }
}

/* The pop: it swells and is gone. */
.burst .big > * {
  scale: 1.3;
  opacity: 0;
  transition:
    scale 0.25s cubic-bezier(0.3, 0, 0.6, 1),
    opacity 0.25s;
}

/* What the pop leaves in the air: a spray of tiny soap bubbles, and a soft ring of water that
   rides the ripple's outer crest (see SPREAD and GROWTH in the script). */
.big::before,
.big::after {
  content: "";
  @apply absolute inset-0 opacity-0;
}

/* Each bubble is a ring drawn at a place given in percent, so growing the box (not scaling it)
   throws them outwards at the size they are. */
.big::before {
  --p: #f0abfc;
  --c: #7dd3fc;
  --m: #6ee7b7;
  --l: #c4b5fd;
  background:
    radial-gradient(circle 5px at 8% 38%, #0000 50%, var(--p) 68% 88%, #0000),
    radial-gradient(circle 3px at 18% 12%, #0000 50%, var(--c) 68% 88%, #0000),
    radial-gradient(circle 6px at 30% 26%, #0000 50%, var(--m) 68% 88%, #0000),
    radial-gradient(circle 4px at 44% 4%, #0000 50%, var(--l) 68% 88%, #0000),
    radial-gradient(circle 7px at 58% 18%, #0000 50%, var(--c) 68% 88%, #0000),
    radial-gradient(circle 3px at 74% 8%, #0000 50%, var(--p) 68% 88%, #0000),
    radial-gradient(circle 5px at 88% 28%, #0000 50%, var(--m) 68% 88%, #0000),
    radial-gradient(circle 4px at 96% 52%, #0000 50%, var(--l) 68% 88%, #0000),
    radial-gradient(circle 6px at 84% 74%, #0000 50%, var(--p) 68% 88%, #0000),
    radial-gradient(circle 3px at 68% 92%, #0000 50%, var(--c) 68% 88%, #0000),
    radial-gradient(circle 5px at 50% 80%, #0000 50%, var(--l) 68% 88%, #0000),
    radial-gradient(circle 4px at 34% 96%, #0000 50%, var(--m) 68% 88%, #0000),
    radial-gradient(circle 7px at 16% 78%, #0000 50%, var(--c) 68% 88%, #0000),
    radial-gradient(circle 3px at 4% 60%, #0000 50%, var(--p) 68% 88%, #0000),
    radial-gradient(circle 4px at 40% 44%, #0000 50%, var(--m) 68% 88%, #0000),
    radial-gradient(circle 5px at 63% 57%, #0000 50%, var(--l) 68% 88%, #0000);
}

.big::after {
  @apply rounded-[50%];
  box-shadow:
    inset 0 0 0 0.5px var(--color-gloss),
    inset 0 0 0.75rem var(--color-bubble-edge),
    0 0 0.5rem var(--color-bubble-edge);
}

.burst .big::before {
  animation: spray 1s cubic-bezier(0.1, 0.7, 0.3, 1);
}

.burst .big::after {
  animation: ripple 1.6s cubic-bezier(0.2, 0.6, 0.4, 1);
}

.burst .big::before,
.burst .big::after {
  @variant motion-reduce {
    animation: none;
  }
}

@keyframes spray {
  from {
    inset: 25%;
    opacity: 1;
  }
  60% {
    opacity: 0.9;
  }
  to {
    inset: -140%;
    translate: 0 -2rem;
    opacity: 0;
  }
}

@keyframes ripple {
  from {
    scale: 1;
    opacity: 0.7;
  }
  to {
    scale: 8;
    opacity: 0;
  }
}

.status {
  animation: balloon 3.6s ease-in-out infinite;

  @variant motion-reduce {
    animation: none;
  }
}

/* A water balloon: it swells, wobbles between wide and tall as the water settles, then rests. */
@keyframes balloon {
  0%,
  62%,
  100% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.09, 1.04);
  }
  22% {
    transform: scale(0.95, 1.08);
  }
  34% {
    transform: scale(1.05, 0.96);
  }
  45% {
    transform: scale(0.98, 1.03);
  }
  54% {
    transform: scale(1.01, 0.99);
  }
}
</style>
