<script setup lang="ts">
import { DATA } from "./data/resume";
</script>

<template>
  <main>
    <img :src="DATA.avatarUrl" :alt="DATA.name" width="96" height="96" />
    <h1>{{ DATA.name }}</h1>
    <p>{{ DATA.description }}</p>
  </main>
</template>
