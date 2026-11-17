import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite-plus";

// Blog posts are the Markdown files in the repo-root content/ folder.
const CONTENT_DIR = fileURLToPath(new URL("../../content", import.meta.url));
const ID = "virtual:posts";

type Frontmatter = { title?: string; summary?: string; date?: string | Date };

/**
 * Exposes `virtual:posts`: every post compiled by @docubook/core and rendered to static HTML with
 * the @docubook/markdown components. Both are React packages, so React runs here at build time
 * only and the Vue app receives plain HTML.
 */
export default function posts(): Plugin {
  return {
    name: "posts",
    resolveId: (id) => (id === ID ? `\0${ID}` : undefined),
    async load(id) {
      if (id !== `\0${ID}`) return;
      // Imported here, not at the top: lint and format load the config without ever needing these.
      const { createElement } = await import("react");
      const { renderToStaticMarkup } = await import("react-dom/server");
      const core = await import("@docubook/core");
      const components = (await import("@docubook/markdown")).createMdxComponents();

      const files = readdirSync(CONTENT_DIR).filter((file) => /\.mdx?$/.test(file));
      const posts = await Promise.all(
        files.map(async (file) => {
          const path = join(CONTENT_DIR, file);
          // shortcut: only existing posts are watched, restart dev after adding or deleting one.
          this.addWatchFile(path);
          const raw = readFileSync(path, "utf8");
          const { frontmatter, strippedContent } =
            core.extractFrontmatterWithContent<Frontmatter>(raw);
          const date = new Date(frontmatter.date ?? NaN);
          if (!frontmatter.title || Number.isNaN(date.getTime())) {
            throw new Error(`content/${file}: frontmatter needs a title and a valid date`);
          }
          // DocuBook v2 authoring: Markdown plus directives (:::card). JSX tags are not components.
          const { compiledSource } = await core.serialize(strippedContent, {
            format: "md",
            mdxOptions: {
              remarkPlugins: core.createDefaultRemarkPlugins(),
              rehypePlugins: core.createDefaultRehypePlugins(),
            },
          });
          // Reading time: the words of the Markdown source, code included, minus directive and fence
          // lines, at 200 a minute.
          const words = strippedContent
            .replace(/^\s*(:{2,}|```).*$/gm, "")
            .match(/[\p{L}\p{N}]+/gu);
          return {
            slug: file.replace(/\.mdx?$/, ""),
            title: frontmatter.title,
            summary: frontmatter.summary ?? "",
            date: date.toISOString().slice(0, 10),
            minutes: Math.max(1, Math.ceil((words?.length ?? 0) / 200)),
            toc: core.extractTocsFromRawMdx(raw),
            html: renderToStaticMarkup(
              createElement(core.MDXRemote, { compiledSource, frontmatter, components }),
            ),
          };
        }),
      );
      posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
      // shortcut: every post's HTML ships in one module, split per post when the blog grows.
      return `export const posts = ${JSON.stringify(posts)};`;
    },
  };
}
