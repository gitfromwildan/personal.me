declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}

// Built by posts.plugin.ts from the repo-root content/ folder.
declare module "virtual:posts" {
  /** Every post in each language, newest first. */
  export const postsIn: Record<
    import("./data/messages").Locale,
    {
      slug: string;
      title: string;
      summary: string;
      /** YYYY-MM-DD */
      date: string;
      /** Reading time. */
      minutes: number;
      toc: { level: number; text: string; href: string }[];
      /** The body as HTML. Only there while the pages are built ahead of time. */
      html?: string;
    }[]
  >;
}

declare module "virtual:posts/bodies" {
  import type { ComponentType } from "react";
  /** Each post's body by language and slug, as the React component DocuBook compiled it to. */
  export const bodies: Record<
    import("./data/messages").Locale,
    Record<string, ComponentType<{ components?: Record<string, unknown> }>>
  >;
}
