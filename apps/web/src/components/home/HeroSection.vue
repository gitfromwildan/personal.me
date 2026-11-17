<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import GlassBubble from "../ui/GlassBubble.vue";
import GlassPane from "../ui/GlassPane.vue";
import { DATA } from "../../data";
import ripple from "./ripple.webp?inline";

const [current] = DATA.work;
const FACTS = [...DATA.hero.facts, { key: "Now", value: `${current.title}, ${current.company}` }];

// Positions and sizes are artboard coordinates (1440px wide, hero top at 0), given to CSS as
// plain numbers (--x, --y, --w, --h) so the whole stage can be drawn at another scale.
const BLOBS = [
  { x: 790, y: 90, color: "var(--blob-c)" },
  { x: 1120, y: 250, color: "var(--blob-a)" },
];

// `r` is the corner radii, clockwise from the top left: soft enough that the panels read as
// glass around the person, not as boxes behind them.
const PANES = [
  {
    x: 960,
    y: 96,
    w: 440,
    h: 540,
    r: [220, 220, 72, 72], // an arch: it frames the head instead of boxing it in
    blur: 13,
    lift: "30px 60px",
    tint: "light-dark(#42ebd442, #22d3ee1f)",
    z: 10,
  },
  {
    x: 800,
    y: 448,
    w: 170,
    h: 196,
    r: [64, 64, 64, 64],
    blur: 7,
    lift: "18px 36px",
    tint: "light-dark(#34d39926, #10b98117)",
    z: 11,
    fade: true,
  },
  {
    x: 888,
    y: 330,
    w: 412,
    h: 330,
    r: [120, 96, 96, 120],
    blur: 11,
    lift: "26px 56px",
    tint: "light-dark(#34d39931, #10b9811d)",
    z: 12,
  },
];

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
const BIG = { x: 846, y: 150, size: 170 };
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
  <section
    id="top"
    class="hero"
    aria-labelledby="hero-title"
    @pointerenter="gather"
    @pointermove="follow"
    @pointerleave="home"
    :class="{ burst }"
    @click="pop"
  >
    <!-- The water the hero is seen through while a ripple crosses it (see .burst): the ripple
         picture, growing from the bubble, over grey, which leaves pixels where they are. It is
         made anew for each pop, which is what starts its animations. -->
    <svg v-if="burst" class="water" width="0" height="0" aria-hidden="true">
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

    <!-- Decoration, apart from the big bubble, which the keyboard can pop too. -->
    <div
      ref="art"
      class="art"
      :style="{ '--bx': BIG.x + BIG.size / 2, '--by': BIG.y + BIG.size / 2 }"
    >
      <span
        v-for="b in BLOBS"
        :key="b.x"
        class="blob"
        aria-hidden="true"
        :style="{ '--x': b.x, '--y': b.y, '--w': 420, background: b.color }"
      />
      <GlassPane
        v-for="(p, i) in PANES"
        :key="p.x"
        :width="p.w"
        :height="p.h"
        :class="{ dim: p.fade }"
        :style="{
          '--x': p.x,
          '--y': p.y,
          '--w': p.w,
          '--h': p.h,
          zIndex: p.z,
          '--glass-radius': p.r.map((corner) => `calc(${corner} * var(--u))`).join(' '),
          '--glass-blur': `${p.blur}px`,
          '--glass-elevation': `0 ${p.lift}`,
          '--tint': p.tint,
          '--phase': i / PANES.length,
        }"
      />
      <!-- The photo is 1672 by 941, in the box the design gives it. -->
      <img
        class="portrait"
        src="/hero-portrait.webp"
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
        :aria-label="burst ? 'Gather the bubbles' : 'Pop the bubble'"
        :aria-pressed="burst"
        :style="{ '--x': BIG.x, '--y': BIG.y, '--w': BIG.size }"
      >
        <GlassBubble />
      </button>
    </div>

    <div class="container content">
      <div class="copy">
        <p class="glass chip status mono-label">
          <span class="dot" />
          {{ DATA.hero.status }}
        </p>
        <h1 id="hero-title" class="headline">
          <span v-for="(line, i) in DATA.hero.headline" :key="i" :class="{ muted: i === 1 }">
            {{ line }}
          </span>
        </h1>
        <p class="subhead">{{ DATA.hero.subhead }}</p>
        <div class="actions">
          <a class="btn solid" href="#projects">
            {{ DATA.hero.cta }}
            <AppIcon name="arrow-down" />
          </a>
          <a class="glass btn" :href="DATA.contact.social.Email.url">
            <AppIcon name="mail" />
            {{ DATA.contact.social.Email.handle }}
          </a>
        </div>
      </div>

      <div class="glass strip">
        <div class="identity">
          <img class="avatar" :src="DATA.avatarUrl" alt="" width="56" height="56" />
          <div>
            <p class="name">{{ DATA.name }}</p>
            <p class="place">{{ DATA.location }}</p>
          </div>
        </div>
        <dl class="facts">
          <div v-for="f in FACTS" :key="f.key" class="fact">
            <dt class="mono-label">{{ f.key }}</dt>
            <dd>{{ f.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding-block: 132px 72px;
}

/* While the bubble is whole it rides under the mouse, and a click anywhere pops it (see pop):
   only then is the hero something to press. */
.hero:not(.burst) {
  cursor: pointer;
}

.water {
  position: absolute;
}

/* Decorative stage: the 1440px artboard, centred, so layers keep their right-hand place. */
.art {
  position: absolute;
  inset: 0 auto 0 50%;
  width: 1440px;
  margin-left: -720px;
}

/* --u is the length of one artboard pixel, and (--ox, --oy) the artboard point drawn at the
   stage's top left corner. A layer without --h is square. */
.art > * {
  --u: 1px;
  --ox: 0;
  --oy: 0;
  position: absolute;
  left: calc((var(--x) - var(--ox)) * var(--u));
  top: calc((var(--y) - var(--oy)) * var(--u));
  width: calc(var(--w) * var(--u));
  height: calc(var(--h, var(--w)) * var(--u));
}

.art .blob {
  z-index: 8;
  --blob-blur: 45px;
}

.dim {
  opacity: 0.8;
}

/* The photo itself fades out at the bottom. A gradient box laid over it would show as a box
   wherever it reaches past the person. */
.portrait {
  z-index: 16;
  mask-image: linear-gradient(180deg, #000 77%, transparent 94%);
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
  top: 0;
  left: 0;
  z-index: 30;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  pointer-events: none;
  translate: calc(var(--cx) - 50%) calc(var(--cy) - 50%);
  transition: translate 0.35s cubic-bezier(0.2, 0.7, 0.3, 1);
}

.big > * {
  width: 100%;
  transition:
    scale 0.45s cubic-bezier(0.2, 1.4, 0.4, 1),
    opacity 0.3s;
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
  position: absolute;
  inset: 0;
  opacity: 0;
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
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 0.5px var(--gloss),
    inset 0 0 0.75rem var(--bubble-edge),
    0 0 0.5rem var(--bubble-edge);
}

.burst .big::before {
  animation: spray 1s cubic-bezier(0.1, 0.7, 0.3, 1);
}

.burst .big::after {
  animation: ripple 1.6s cubic-bezier(0.2, 0.6, 0.4, 1);
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

/* While the ripple travels, the hero is drawn through the #hero-water filter, which bends it. */
.hero.burst {
  animation: water 1.6s;
}

@keyframes water {
  from,
  to {
    filter: url(#hero-water);
  }
}

@media (prefers-reduced-motion: reduce) {
  .art > .bubble,
  .art > .big,
  .big > * {
    transition: none;
  }

  .hero.burst,
  .burst .big::before,
  .burst .big::after {
    animation: none;
  }
}

.content {
  position: relative;
  z-index: 19;
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  max-width: 680px;
}

.status {
  padding: 7px 14px 7px 11px;
  color: var(--ink);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transform-origin: center;
  animation: balloon 3.6s ease-in-out infinite;
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

@media (prefers-reduced-motion: reduce) {
  .status {
    animation: none;
  }
}

.headline {
  margin: 0;
  font-size: clamp(2.25rem, 7vw, 3.75rem);
  font-weight: 600;
  line-height: 1.033;
  letter-spacing: -0.038em;
}

.headline span {
  display: block;
}

.muted {
  color: var(--s-muted);
}

.subhead {
  max-width: 580px;
  margin: 0;
  color: var(--ink-2);
  font-size: 1.1875rem;
  line-height: 1.53;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.strip {
  --glass-radius: 28px;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 22px 32px;
}

.identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.name {
  margin: 0 0 3px;
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.018em;
}

.place {
  margin: 0;
  color: var(--s-muted);
  font-size: 0.875rem;
}

.facts {
  display: flex;
  flex: 1;
  gap: 32px;
  margin: 0;
}

.fact {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 32px;
  border-left: 1px solid var(--glass-line);
}

.fact dt {
  font-size: 0.6875rem;
  letter-spacing: 0.07em;
}

.fact dd {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 860px) {
  .hero {
    padding-block: 96px 56px;
  }

  /* One column: the copy, then the stage, then the profile strip. */
  .hero {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .content {
    display: contents;
  }

  .copy,
  .strip {
    width: min(1120px, 100% - 2.5rem);
    margin-inline: auto;
  }

  .art {
    order: 1;
  }

  .strip {
    order: 2;
  }

  /* The stage shows the part of the artboard that holds the portrait (680 by 742 artboard
     pixels from 760, 60), scaled to the column. */
  .art {
    position: relative;
    inset: auto;
    width: min(26rem, 100% - 2.5rem);
    aspect-ratio: 680 / 742;
    margin: 0 auto;
    container-type: inline-size;
  }

  .art > * {
    --u: calc(100cqw / 680);
    --ox: 760;
    --oy: 60;
  }

  .strip,
  .facts {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .fact {
    padding: 16px 0 0;
    border-left: 0;
    border-top: 1px solid var(--glass-line);
  }
}
</style>
