<script setup lang="ts">
import AboutSection from "../components/home/AboutSection.vue";
import CommitsBridge from "../components/home/CommitsBridge.vue";
import ContactSection from "../components/home/ContactSection.vue";
import HeroSection from "../components/home/HeroSection.vue";
import ProjectsSection from "../components/home/ProjectsSection.vue";
import SkillsSection from "../components/home/SkillsSection.vue";
import WorkSection from "../components/home/WorkSection.vue";
import PageBlobs from "../components/ui/PageBlobs.vue";
import { usePageTitle } from "../composables/usePageTitle";
import { DATA } from "../data";

usePageTitle(() => DATA.navbar[0].label);

// The page-wide colour blobs behind the sections, placed as a share of the page's height.
const blobs = [
  { color: "--blob-a", width: 620, top: "26%", right: -160 },
  { color: "--blob-b", width: 640, top: "45%", left: -580 },
  { color: "--blob-d", width: 600, top: "47%", right: -540 },
  { color: "--blob-c", width: 620, top: "78%", left: -160 },
  { color: "--blob-b", width: 680, top: "91%", right: -140 },
];
</script>

<template>
  <main class="stage">
    <PageBlobs :blobs="blobs" />
    <HeroSection />
    <AboutSection />
    <WorkSection />
    <SkillsSection />
    <CommitsBridge />
    <ProjectsSection />
    <ContactSection />
  </main>
</template>
