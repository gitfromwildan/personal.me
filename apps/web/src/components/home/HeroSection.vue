<script setup lang="ts">
import AppIcon from "../ui/AppIcon.vue";
import { DATA } from "../../data/resume";

const [current] = DATA.work;
const FACTS = [...DATA.hero.facts, { key: "Now", value: `${current.title}, ${current.company}` }];

// Positions are artboard coordinates (1440px wide, hero top at 0).
const BLOBS = [
  { x: 790, y: 90, color: "var(--blob-c)" },
  { x: 1120, y: 250, color: "var(--blob-a)" },
];

const PANES = [
  {
    x: 960,
    y: 96,
    w: 440,
    h: 540,
    r: 44,
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
    r: 26,
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
    r: 34,
    blur: 11,
    lift: "26px 56px",
    tint: "light-dark(#34d39931, #10b9811d)",
    z: 12,
  },
];

const BUBBLES = [
  { x: 925, y: 60, size: 72, lift: "0.17em 0.36em", z: 13 },
  { x: 904, y: 266, size: 36, lift: "0.17em 0.36em", z: 14, faint: true },
  { x: 762, y: 414, size: 84, lift: "0.16em 0.36em", z: 15 },
  { x: 1352, y: 196, size: 200, lift: "0.16em 0.36em", z: 17 },
];
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="art" aria-hidden="true">
      <span
        v-for="b in BLOBS"
        :key="b.x"
        class="blob"
        :style="{ left: `${b.x}px`, top: `${b.y}px`, background: b.color }"
      />
      <span
        v-for="p in PANES"
        :key="p.x"
        class="glass pane"
        :class="{ dim: p.fade }"
        :style="{
          left: `${p.x}px`,
          top: `${p.y}px`,
          width: `${p.w}px`,
          height: `${p.h}px`,
          zIndex: p.z,
          '--glass-radius': `${p.r}px`,
          '--glass-blur': `${p.blur}px`,
          '--glass-elevation': `0 ${p.lift}`,
          '--tint': p.tint,
        }"
      />
      <img class="portrait" src="/hero-portrait.png" alt="" />
      <span
        v-for="b in BUBBLES"
        :key="b.x"
        class="glass bubble"
        :class="{ faint: b.faint }"
        :style="{
          left: `${b.x}px`,
          top: `${b.y}px`,
          fontSize: `${b.size}px`,
          zIndex: b.z,
          '--glass-elevation': `0 ${b.lift}`,
        }"
      />
      <span class="fade" />
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
          <a class="btn solid" href="#contact">
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

.art > * {
  position: absolute;
}

.art .blob {
  z-index: 8;
  width: 420px;
  height: 420px;
  --blob-blur: 45px;
}

.pane {
  background:
    linear-gradient(125deg, light-dark(#ffffff5c, #ffffff22) 15%, var(--stage-0) 37%),
    linear-gradient(140deg, var(--tint) 15%, var(--stage-0) 68%),
    linear-gradient(180deg, var(--glass-hi), var(--glass-lo));
}

.pane.dim {
  opacity: 0.8;
}

.portrait {
  z-index: 16;
  left: 308px;
  top: 97px;
  width: 1250px;
  height: 703px;
  object-fit: cover;
}

.fade {
  z-index: 18;
  left: 780px;
  top: 640px;
  width: 660px;
  height: 162px;
  background: linear-gradient(180deg, var(--stage-0), var(--stage) 72%);
}

/* Bubble: sized by font-size, parts in em. The caustic is a second gradient on the sphere, the highlight its ::after. */
.bubble {
  --glass-radius: 50%;
  --glass-blur: 1.5px;
  width: 1em;
  height: 1em;
  background:
    radial-gradient(ellipse 23% 7% at 50% 87%, var(--bubble-edge), transparent),
    radial-gradient(
      ellipse 67.5% 67.5% at 34% 28%,
      var(--bubble-core) 0%,
      var(--bubble-mid) 20%,
      var(--bubble-mid) 58%,
      var(--bubble-edge) 100%
    );
}

.bubble.faint {
  opacity: 0.6;
}

.bubble::after {
  content: "";
  position: absolute;
  left: 0.2em;
  top: 0.13em;
  width: 0.26em;
  height: 0.14em;
  border-radius: 50%;
  background: var(--bubble-hi);
  transform: rotate(-24deg);
  transform-origin: top left;
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

.identity .avatar {
  width: 56px;
  height: 56px;
  object-fit: cover;
  outline: 2px solid var(--rim-hi);
  outline-offset: -1px;
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

  .art {
    display: none;
  }

  .content {
    gap: 3rem;
  }

  .strip,
  .facts {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .fact {
    padding: 16px 0 0;
    border-left: 0;
    border-top: 1px solid var(--glass-line);
    width: 100%;
  }
}
</style>
