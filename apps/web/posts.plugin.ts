import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite-plus";

// Blog posts are the Markdown files in the repo-root content/ folder.
const CONTENT_DIR = fileURLToPath(new URL("../../content", import.meta.url));

// The modules this plugin makes:
const LIST = "virtual:posts"; // what the site knows about every post
const BODIES = "virtual:posts/bodies"; // every post's body by slug, as a React component
const BODY = "virtual:posts/body/"; // + slug: one post's body, as DocuBook compiled it

type Frontmatter = { title?: string; summary?: string; date?: string | Date };

const files = () => readdirSync(CONTENT_DIR).filter((file) => /\.mdx?$/.test(file));
const slugOf = (file: string) => file.replace(/\.mdx?$/, "");

/**
 * Makes the posts importable. @docubook/core compiles each one into a module whose default
 * export is a React component, to be rendered with the @docubook/markdown components: those are
 * DocuBook's own, and the site runs them as they are (see PostBody.vue) instead of imitating
 * what they do.
 */
export default function posts(): Plugin {
  const require = createRequire(import.meta.url);
  // A compiled post imports @mdx-js/react, which is installed for @docubook/core, not for this
  // app: it is looked up from where the core is.
  const mdxReact = createRequire(require.resolve("@docubook/core")).resolve("@mdx-js/react");

  return {
    name: "posts",
    resolveId(id) {
      if (id === "@mdx-js/react") return mdxReact;
      if (id === LIST || id === BODIES || id.startsWith(BODY)) return `\0${id}`;
    },
    async load(id, options) {
      if (!id.startsWith(`\0${LIST}`)) return;
      // Imported here, not at the top: lint and format load the config without ever needing it.
      const core = await import("@docubook/core");
      const read = (file: string) => {
        const path = join(CONTENT_DIR, file);
        // shortcut: only existing posts are watched, restart dev after adding or deleting one.
        this.addWatchFile(path);
        const raw = readFileSync(path, "utf8");
        return { raw, ...core.extractFrontmatterWithContent<Frontmatter>(raw) };
      };

      if (id === `\0${LIST}`) {
        const posts = files().map((file) => {
          const { raw, frontmatter, strippedContent } = read(file);
          const date = new Date(frontmatter.date ?? NaN);
          if (!frontmatter.title || Number.isNaN(date.getTime())) {
            throw new Error(`content/${file}: frontmatter needs a title and a valid date`);
          }
          // Reading time: the words of the Markdown source, code included, minus directive and
          // fence lines, at 200 a minute.
          const words = strippedContent
            .replace(/^\s*(:{2,}|```).*$/gm, "")
            .match(/[\p{L}\p{N}]+/gu);
          return {
            slug: slugOf(file),
            title: frontmatter.title,
            summary: frontmatter.summary ?? "",
            date: date.toISOString().slice(0, 10),
            minutes: Math.max(1, Math.ceil((words?.length ?? 0) / 200)),
            toc: core.extractTocsFromRawMdx(raw),
          };
        });
        posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
        const list = `export const posts = ${JSON.stringify(posts)}`;
        if (!options?.ssr) return `${list};`;
        // While the pages are built ahead of time, a post also comes with the HTML its body
        // renders to: the page is built with it, and React takes it over in the browser.
        return [
          'import { createElement } from "react";',
          'import { renderToString } from "react-dom/server";',
          'import { createMdxComponents } from "@docubook/markdown";',
          `import { bodies } from "${BODIES}";`,
          "const components = createMdxComponents();",
          `${list}.map((post) => ({`,
          "  ...post,",
          "  html: renderToString(createElement(bodies[post.slug], { components })),",
          "}));",
        ].join("\n");
      }

      if (id === `\0${BODIES}`) {
        const slugs = files().map(slugOf);
        // shortcut: every post's body ships in one module, split per post when the blog grows.
        return [
          ...slugs.map((slug, i) => `import Body${i} from "${BODY}${slug}";`),
          `export const bodies = {${slugs.map((slug, i) => `${JSON.stringify(slug)}: Body${i}`).join(",")}};`,
        ].join("\n");
      }

      const file = files().find((file) => `\0${BODY}${slugOf(file)}` === id);
      if (!file) throw new Error(`No post for ${id}`);
      // DocuBook v2 authoring: Markdown plus directives (:::card). JSX tags are not components.
      const { compiledSource } = await core.serialize(read(file).strippedContent, {
        format: "md",
        // A module, for the bundler: the other format is a string for the browser to evaluate.
        outputFormat: "program",
        mdxOptions: {
          remarkPlugins: core.createDefaultRemarkPlugins(),
          rehypePlugins: core.createDefaultRehypePlugins(),
        },
      });
      return compiledSource;
    },
  };
}
