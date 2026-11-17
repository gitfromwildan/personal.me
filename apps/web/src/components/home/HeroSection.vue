<script setup lang="ts">
import AppIcon from "../ui/AppIcon.vue";
import GlassBubble from "../ui/GlassBubble.vue";
import GlassPane from "../ui/GlassPane.vue";
import { DATA } from "../../data";

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
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="art" aria-hidden="true">
      <span
        v-for="b in BLOBS"
        :key="b.x"
        class="blob"
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
        }"
      />
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

.bubble.faint {
  opacity: 0.6;
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
