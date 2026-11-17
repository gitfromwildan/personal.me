<script setup lang="ts">
import "@docubook/markdown/styles.css";
import { computed } from "vue";
import { posts } from "virtual:posts";

const props = defineProps<{ slug: string }>();
const post = computed(() => posts.find((p) => p.slug === props.slug));

// The body is static HTML rendered at build time by DocuBook's React components, so their
// stateful controls (tabs, accordion, copy button) are driven from these two handlers.
function onClick(event: MouseEvent) {
  const button = (event.target as Element).closest("button");
  if (!button) return;
  if (button.role === "tab") {
    const current = button.parentElement!.querySelector<HTMLElement>('[aria-selected="true"]')!;
    if (current === button) return;
    // The selected look is an inline style from the render: trade it with the old tab's.
    [current.style.cssText, button.style.cssText] = [button.style.cssText, current.style.cssText];
    for (const tab of [current, button]) {
      const selected = tab === button;
      tab.ariaSelected = String(selected);
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")!)!.hidden = !selected;
    }
  } else if (button.classList.contains("mdx-accordion-header")) {
    const open = button.ariaExpanded !== "true";
    button.ariaExpanded = String(open);
    document.getElementById(button.getAttribute("aria-controls")!)!.hidden = !open;
    button.querySelector<SVGElement>(".mdx-accordion-chevron")!.style.transform =
      `rotate(${open ? 90 : 0}deg)`;
  } else if (button.ariaLabel === "Copy code") {
    const code = button.closest(".code-block-container")?.querySelector("pre")?.textContent ?? "";
    void navigator.clipboard.writeText(code).then(() => {
      button.firstChild!.textContent = "Copied";
      setTimeout(() => (button.firstChild!.textContent = "Copy"), 1600);
    });
  }
}

// Unselected tabs are out of the tab order, so the arrow keys must reach them.
function onKeydown(event: KeyboardEvent) {
  const tab = event.target as HTMLElement;
  if (tab.role !== "tab") return;
  const next =
    event.key === "ArrowRight"
      ? tab.nextElementSibling
      : event.key === "ArrowLeft"
        ? tab.previousElementSibling
        : null;
  if (next instanceof HTMLElement) {
    next.focus();
    next.click();
  }
}
</script>

<template>
  <main v-if="post" class="post">
    <RouterLink to="/blog">← Blog</RouterLink>
    <h1>{{ post.title }}</h1>
    <time :datetime="post.date">{{ post.date }}</time>
    <nav v-if="post.toc.length" aria-label="On this page">
      <ul>
        <li
          v-for="item in post.toc"
          :key="item.href"
          :style="{ marginLeft: `${item.level - 2}rem` }"
        >
          <a :href="item.href">{{ item.text }}</a>
        </li>
      </ul>
    </nav>
    <!-- Safe as v-html: compiled at build time from this repo's own content/ folder. -->
    <article v-html="post.html" @click="onClick" @keydown="onKeydown" />
  </main>
  <main v-else>
    <h1>Post not found</h1>
    <RouterLink to="/blog">Back to the blog</RouterLink>
  </main>
</template>

<!-- Not scoped: these rules style the v-html body. -->
<style>
/* DocuBook's components read these HSL triplets and fall back to a light theme without them. */
@media (prefers-color-scheme: dark) {
  .post {
    --background: 220 20% 10%;
    --foreground: 210 30% 92%;
    --card: 220 20% 13%;
    --card-foreground: 210 30% 92%;
    --muted: 220 15% 18%;
    --muted-foreground: 215 15% 65%;
    --border-color: 220 15% 25%;
  }
}

/* @docubook/core highlights with Prism but ships no token colours. */
.post .token.comment {
  color: light-dark(#6a737d, #8b949e);
}
.post .token.string {
  color: light-dark(#0a6e31, #7ee787);
}
.post .token.keyword,
.post .token.operator {
  color: light-dark(#cf222e, #ff7b72);
}
.post .token.function {
  color: light-dark(#6f42c1, #d2a8ff);
}
.post .token.number,
.post .token.boolean,
.post .token.builtin,
.post .token.class-name {
  color: light-dark(#b35900, #ffa657);
}
.post .code-line.line-number::before {
  content: attr(line);
  display: inline-block;
  width: 1.5rem;
  margin-right: 1rem;
  text-align: right;
  color: hsl(var(--muted-foreground, 220 15% 50%));
}
.post .code-line.highlight-line {
  display: block;
  background: hsl(var(--primary, 210 81% 56%) / 0.12);
}
</style>
