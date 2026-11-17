<script setup lang="ts">
import "@docubook/markdown/styles.css";

// The post as static HTML, rendered at build time by DocuBook's React components
// (posts.plugin.ts) from this repo's own content/ folder, which is why v-html is safe here.
defineProps<{ html: string }>();

// Nothing hydrates that HTML, so the components' controls (tabs, accordion, copy button) are
// driven from these two handlers.
function onClick(event: MouseEvent) {
  const button = (event.target as Element).closest("button");
  if (!button) return;
  if (button.role === "tab") {
    const current = button.parentElement!.querySelector<HTMLElement>('[aria-selected="true"]')!;
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
  } else if (button.ariaLabel === "Copy code") {
    const code = button.closest(".code-block-container")?.querySelector("pre")?.textContent ?? "";
    // The button's text is for the eye, its live region is what a screen reader announces.
    const say = (text: string) => {
      button.firstChild!.textContent = text;
      button.querySelector("[aria-live]")!.textContent = text;
    };
    // Without clipboard access (plain http, permission denied) the button just stays as it is.
    void navigator.clipboard?.writeText(code).then(
      () => {
        say("Copied");
        setTimeout(() => say("Copy"), 1600);
      },
      () => {},
    );
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
  <article class="post-body" v-html="html" @click="onClick" @keydown="onKeydown" />
</template>

<!--
  Not scoped: these rules style the v-html body. DocuBook's components carry their look as inline
  styles, so matching them to this site's design takes !important throughout.
-->
<style>
/* The HSL triplets DocuBook's components read, for the parts not restyled below. */
.post-body {
  --primary: 163 94% 24%;
  --foreground: 0 0% 4%;
  --muted-foreground: 221 9% 37%;
  --border-color: 220 15% 85%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 4%;
  --background: 220 24% 93%;
  --muted: 220 16% 90%;
  /* DocuBook bleeds code blocks over this gutter on phones. Here they stay in the column. */
  --docubook-content-gutter: 0px;
  color: var(--ink-2);
  font-size: 1.125rem;
  line-height: 1.72;
}

:root[data-theme="dark"] .post-body {
  --primary: 158 64% 52%;
  --foreground: 0 0% 98%;
  --muted-foreground: 220 13% 78%;
  --border-color: 210 5% 19%;
  --card: 220 5% 8%;
  --card-foreground: 0 0% 98%;
  --background: 225 22% 4%;
  --muted: 220 5% 12%;
}

/* Prose */
.post-body p,
.post-body > :is(ul, ol:not([data-mdx-wrapper]), blockquote) {
  max-width: 40rem;
  margin: 0 0 1.375rem;
}

.post-body > p:first-child {
  color: var(--ink);
  font-size: 1.25rem;
  line-height: 1.7;
}

.post-body :is(h2, h3, h4) {
  margin: 0 0 1.375rem;
  padding-top: 1.625rem;
  color: var(--ink);
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  scroll-margin-top: 1rem;
}

.post-body h2 {
  font-size: 1.875rem;
  letter-spacing: -0.027em;
}

.post-body a:not([data-card-hover], [aria-hidden]) {
  color: var(--accent);
  text-underline-offset: 3px;
}

.post-body > blockquote {
  padding-left: 1rem;
  border-left: 2px solid var(--accent);
  color: var(--ink);
}

/* Callouts tint their text with their own colour, which is too faint to read on the glass. */
.post-body .mdx-callout-content {
  color: var(--ink-2) !important;
}

.post-body :not(pre) > code {
  padding: 1px 7px;
  border-radius: 6px;
  background: var(--code-chip);
  outline: 1px solid var(--glass-line);
  outline-offset: -0.5px;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 0.86em;
}

/* Blocks keep the article's rhythm whatever margins they bring. */
.post-body
  :is(
    .code-block-container,
    ol[data-mdx-wrapper],
    .mdx-accordion-group,
    .docubook-card-group-container,
    [data-card-hover],
    aside,
    div:has(> [role="tablist"])
  ) {
  margin-block: 0 1.375rem !important;
}

.post-body
  :is(
    [role="tabpanel"],
    li,
    li > div,
    .mdx-accordion-content,
    .mdx-callout-content,
    [data-card-hover]
  )
  > :last-child,
.post-body .docubook-card-group [data-card-hover],
.post-body [data-card-hover] p {
  margin-bottom: 0 !important;
}

/* Card: glass, icon tile beside the text */
.post-body [data-card-hover] {
  padding: 1.25rem !important;
  border: 1px solid var(--rim-lo) !important;
  border-radius: 20px !important;
  background: linear-gradient(180deg, var(--glass-hi), var(--glass-lo)) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 30px var(--glass-shadow);
}

/* DocuBook's own hover border and blue shadow, in this site's colours. */
.post-body [data-card-hover]:hover {
  border-color: var(--accent) !important;
  box-shadow: 0 18px 36px var(--glass-shadow) !important;
}

.post-body [data-card-hover] > svg {
  display: none;
}

/* The arrow that marks a card as a link. */
.post-body a[data-card-hover] {
  padding-right: 3.25rem !important;
}

.post-body a[data-card-hover]::after {
  content: "";
  position: absolute;
  top: calc(50% - 9px);
  right: 1.25rem;
  width: 18px;
  height: 18px;
  background: var(--ink);
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 7h10v10M7 17 17 7'/%3E%3C/svg%3E");
}

.post-body [data-card-hover] > div > div {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.post-body [data-card-icon] {
  width: 2.75rem !important;
  height: 2.75rem !important;
  margin: 0 !important;
  border-radius: 14px !important;
  background: var(--chip) !important;
  color: var(--accent) !important;
}

.post-body [data-card-hover] > div > div > div > :first-child {
  margin-bottom: 0.25rem !important;
  color: var(--ink) !important;
  font-size: 1.0625rem !important;
}

.post-body [data-card-hover] p {
  max-width: none;
  color: var(--s-muted);
  font-size: 0.9375rem;
  line-height: 1.55;
}

/* Tabs: a glass pill holding the tab buttons */
.post-body [role="tablist"] {
  display: inline-flex !important;
  gap: 4px !important;
  margin-bottom: 1rem;
  padding: 4px;
  border: 0 !important;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--glass-hi), var(--glass-lo));
  box-shadow:
    0 8px 18px var(--glass-shadow),
    inset 0 0 0 1px var(--rim-lo);
}

.post-body [role="tab"] {
  padding: 0.5rem 1rem !important;
  border: 0 !important;
  border-radius: 999px;
  background: none !important;
  color: var(--s-muted) !important;
  font-family: inherit;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
}

.post-body [role="tab"][aria-selected="true"] {
  background: var(--ink) !important;
  color: var(--bg) !important;
}

.post-body [role="tabpanel"] {
  margin-top: 0 !important;
  font-size: 1.0625rem;
}

/* Code block: dark in both themes */
.post-body .code-block-container {
  border: 1px solid var(--rim-lo) !important;
  border-radius: 16px !important;
  background: var(--code-bg);
}

.post-body :is([role="tabpanel"], li, .mdx-accordion-content) .code-block-container {
  margin-block: 0.75rem !important;
}

.post-body .code-block-header {
  padding: 0.5rem 1rem !important;
  border-bottom: 1px solid #ffffff14 !important;
  background: none !important;
}

.post-body .code-block-header,
.post-body .code-block-header div,
.post-body .code-block-header button {
  color: var(--code-dim) !important;
  font-family: var(--font-mono) !important;
  font-size: 0.6875rem !important;
  letter-spacing: 0.07em;
}

.post-body .code-block-header button {
  border: 0 !important;
  background: none !important;
}

.post-body .code-block-header button:hover {
  color: var(--code-ink) !important;
}

.post-body .code-block-body {
  background: none !important;
}

.post-body pre {
  padding: 0.875rem 1rem !important;
  color: var(--code-ink);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.65;
}

/* @docubook/core highlights with Prism but ships no token colours. */
.post-body .token.comment {
  color: var(--code-dim);
}
.post-body .token.string {
  color: #7ee787;
}
.post-body .token:is(.keyword, .operator) {
  color: #ff7b72;
}
.post-body .token.function {
  color: #d2a8ff;
}
.post-body .token:is(.number, .boolean, .builtin, .class-name) {
  color: #ffa657;
}

.post-body .code-line.line-number::before {
  content: attr(line);
  display: inline-block;
  width: 1.5rem;
  margin-right: 1rem;
  color: var(--code-dim);
  text-align: right;
}

.post-body .code-line.highlight-line {
  display: block;
  background: #ffffff14;
}

/* Steps: numbered beads on a liquid rail */
.post-body ol[data-mdx-wrapper] > li {
  margin-left: 0 !important;
  padding: 3px 0 1.75rem 3.125rem !important;
}

.post-body ol[data-mdx-wrapper] > li:last-of-type {
  padding-bottom: 0 !important;
}

.post-body ol[data-mdx-wrapper] > li > span:first-child {
  width: 2rem !important;
  height: 2rem !important;
  border: 0 !important;
  border-radius: 999px !important;
  background: var(--bead-fill) !important;
  outline: 1.5px solid var(--accent);
  outline-offset: -0.75px;
  box-shadow: 0 5px 12px var(--glass-shadow);
  color: #065f46 !important;
  font-family: var(--font-mono);
  font-size: 0.8125rem !important;
}

.post-body ol[data-mdx-wrapper] > li > div:first-of-type {
  margin-bottom: 0.75rem !important;
  color: var(--ink) !important;
  font-size: 1.1875rem !important;
  font-weight: 600 !important;
  letter-spacing: -0.016em;
}

.post-body ol[data-mdx-wrapper] > li > div:last-child {
  color: var(--ink-2) !important;
  font-size: 1.0625rem;
}

/* DocuBook's own rail runs to the end of the last step. Drawn per step instead, bead to bead. */
.post-body ol[data-mdx-wrapper] > span {
  display: none;
}

.post-body ol[data-mdx-wrapper] > li:not(:last-of-type)::before {
  content: "";
  position: absolute;
  top: 1rem;
  bottom: -1rem;
  left: 12px;
  z-index: -1;
  width: 8px;
  background: var(--liquid-lo);
}

.post-body ol[data-mdx-wrapper] > li:first-of-type::before {
  border-radius: 4px 4px 0 0;
}

.post-body ol[data-mdx-wrapper] > li:nth-last-of-type(2)::before {
  background: linear-gradient(180deg, var(--liquid-lo), var(--liquid-hi));
}

/* Accordions: one glass card each, chevron on the right */
.post-body .mdx-accordion-group {
  gap: 1rem;
  overflow: visible !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: none !important;
}

.post-body .mdx-accordion {
  border: 1px solid var(--rim-lo) !important;
  border-radius: 16px !important;
  background: linear-gradient(180deg, var(--glass-hi), var(--glass-lo)) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 24px var(--glass-shadow);
}

.post-body .mdx-accordion-header {
  padding: 1rem 1.25rem !important;
  color: var(--ink) !important;
  font-size: 0.9375rem !important;
  font-weight: 600 !important;
}

/* Points down when closed and up when open. */
.post-body .mdx-accordion-chevron {
  order: 1;
  transform: rotate(90deg) !important;
  transition: transform 0.2s;
}

.post-body .mdx-accordion-header[aria-expanded="true"] .mdx-accordion-chevron {
  transform: rotate(-90deg) !important;
}

.post-body .mdx-accordion-icon {
  color: var(--accent) !important;
}

.post-body .mdx-accordion-content {
  padding: 0 1.25rem 1rem !important;
  background: none !important;
  color: var(--ink-2) !important;
  font-size: 1.0625rem;
}

/* On phones DocuBook also squares the block and drops its side borders: keep the card. */
@media (max-width: 639.98px) {
  .post-body div.code-block-container.not-prose {
    border-inline: 1px solid var(--rim-lo) !important;
    border-radius: 16px !important;
  }
}

@media (max-width: 860px) {
  .post-body {
    font-size: 1rem;
  }

  .post-body > p:first-child {
    font-size: 1.125rem;
  }

  .post-body h2 {
    font-size: 1.5rem;
  }
}
</style>
