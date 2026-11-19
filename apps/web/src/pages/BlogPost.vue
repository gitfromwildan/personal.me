<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  watchEffect,
} from "vue";
import { postsIn } from "virtual:posts";
import PostBody from "../components/blog/PostBody.vue";
import PostHeader from "../components/blog/PostHeader.vue";
import PostNav from "../components/blog/PostNav.vue";
import PostToc from "../components/blog/PostToc.vue";
import PageBlobs from "../components/ui/PageBlobs.vue";
import { hasToc, narrow, tocOpen } from "../composables/useDockToc";
import { usePageTitle } from "../composables/usePageTitle";
import { useReadingProgress } from "../composables/useReadingProgress";
import { i18n } from "../i18n";

// What an address with no post behind it shows. Fetched only then: a post that exists does
// not bring the not-found page's script and styles along.
const NotFound = defineAsyncComponent(() => import("./NotFound.vue"));

const props = defineProps<{ slug: string }>();
// The posts in the language being shown: the page is made anew when that changes.
const posts = postsIn[i18n.global.locale.value];

const index = computed(() => posts.findIndex((p) => p.slug === props.slug));
const post = computed(() => posts[index.value]);
usePageTitle(() => post.value?.title);

const article = ref<HTMLElement | null>(null);
const { progress, active, update } = useReadingProgress(
  article,
  () => post.value?.toc.map((item) => item.href) ?? [],
);
// Going to the next post reuses this page: measure again once its body is in the DOM.
watch(post, () => {
  tocOpen.value = false;
  void nextTick(update);
});

// Tells the dock there is a table of contents to offer on narrow screens. Withdrawn before
// this page goes, not after: a change of language makes the page anew (see App.vue), and the
// new one has already claimed the dock by the time the old one's unmounted hooks run.
watchEffect(() => (hasToc.value = Boolean(post.value)));
onBeforeUnmount(() => {
  hasToc.value = false;
  tocOpen.value = false;
});

// The page-wide colour blobs.
const blobs = [
  { color: "--color-blob-c", width: 380, height: 240, top: 150, right: 100 },
  { color: "--color-blob-a", width: 520, height: 520, top: 900, right: -180 },
  { color: "--color-blob-b", width: 520, height: 520, top: 1500, left: -300 },
  { color: "--color-blob-d", width: 520, height: 520, top: 2300, right: -200 },
];
</script>

<template>
  <main v-if="post" class="stage">
    <PageBlobs :blobs="blobs" />

    <PostHeader :post="post" />

    <div
      class="post-columns container grid grid-cols-[minmax(0,47rem)_18rem] items-start justify-between gap-10 pt-18 pb-14 max-lg:grid-cols-[minmax(0,1fr)] max-lg:py-10"
    >
      <div ref="article">
        <!-- Keyed: each post gets its own React root. -->
        <PostBody :key="post.slug" :slug="post.slug" :html="post.html" @drawn="update" />
      </div>
      <!-- Beside the article when there is room, otherwise in the dock's popover (see
           useDockToc.ts). Until Vue has moved it there, it is still here in the built page: out
           of sight. Sticky, and capped to the window: a sticky card taller than it could never
           be scrolled to its end. -->
      <Teleport to="#dock-toc" defer :disabled="!narrow">
        <PostToc
          class="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto max-lg:static max-lg:max-h-none max-lg:[.post-columns>&]:hidden"
          :toc="post.toc"
          :minutes="post.minutes"
          :progress="progress"
          :active="active"
        />
      </Teleport>
    </div>

    <PostNav :next="posts[index + 1]" />
  </main>

  <NotFound v-else />
</template>
