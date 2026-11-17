<script setup lang="ts">
import AboutSection from "../components/home/AboutSection.vue";
import CommitsBridge from "../components/home/CommitsBridge.vue";
import ContactSection from "../components/home/ContactSection.vue";
import HeroSection from "../components/home/HeroSection.vue";
import ProjectsSection from "../components/home/ProjectsSection.vue";
import SkillsSection from "../components/home/SkillsSection.vue";
import WorkSection from "../components/home/WorkSection.vue";

// The page-wide colour blobs behind the sections: token, size, and position as a share of the page.
const blobs = [
  { color: "--blob-a", size: 620, top: "26%", side: "right", offset: -160 },
  { color: "--blob-b", size: 640, top: "45%", side: "left", offset: -580 },
  { color: "--blob-d", size: 600, top: "47%", side: "right", offset: -540 },
  { color: "--blob-c", size: 620, top: "78%", side: "left", offset: -160 },
  { color: "--blob-b", size: 680, top: "91%", side: "right", offset: -140 },
] as const;
</script>

<template>
  <main class="stage">
    <span
      v-for="(blob, i) in blobs"
      :key="i"
      class="blob"
      aria-hidden="true"
      :style="{
        background: `var(${blob.color})`,
        width: `${blob.size}px`,
        height: `${blob.size}px`,
        top: blob.top,
        [blob.side]: `${blob.offset}px`,
      }"
    />
    <HeroSection />
    <AboutSection />
    <WorkSection />
    <SkillsSection />
    <CommitsBridge />
    <ProjectsSection />
    <ContactSection />
  </main>
</template>
