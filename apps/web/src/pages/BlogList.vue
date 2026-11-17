<script setup lang="ts">
import { posts } from "virtual:posts";
</script>

<template>
  <main>
    <h1>Blog</h1>
    <article v-for="post in posts" :key="post.slug">
      <h2>
        <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
      </h2>
      <time :datetime="post.date">{{ post.date }}</time>
      <p>{{ post.summary }}</p>
    </article>
  </main>
</template>
