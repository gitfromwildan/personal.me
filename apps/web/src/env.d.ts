declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}

// Built by posts.plugin.ts from the repo-root content/ folder.
declare module "virtual:posts" {
  export const posts: {
    slug: string;
    title: string;
    summary: string;
    /** YYYY-MM-DD */
    date: string;
    toc: { level: number; text: string; href: string }[];
    html: string;
  }[];
}
