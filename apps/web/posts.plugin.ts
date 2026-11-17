import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite-plus";

// Blog posts are the Markdown files in the repo-root content/ folder: English at the top of
// it, and each other language in a folder named by its code, in a file of the same name. A
// post that has no file in a language is shown there in English.
const CONTENT_DIR = fileURLToPath(new URL("../../content", import.meta.url));
const LOCALES = ["en", "id"];

// The modules this plugin makes:
const LIST = "virtual:posts"; // what the site knows about every post, in each language
const BODIES = "virtual:posts/bodies"; // every post's body as a React component, by language and slug
const BODY = "virtual:posts/body/"; // + language/slug: one post's body, as DocuBook compiled it

type Frontmatter = { title?: string; summary?: string; date?: string | Date };

// The English files say which posts there are.
const slugs = () =>
  readdirSync(CONTENT_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ""));

/** The file a post is read from in a language: that language's own, or else the English one. */
function fileOf(slug: string, locale: string) {
  const folders = locale === "en" ? [CONTENT_DIR] : [join(CONTENT_DIR, locale), CONTENT_DIR];
  const paths = folders.flatMap((folder) => [".mdx", ".md"].map((ext) => join(folder, slug + ext)));
  return paths.find((path) => existsSync(path))!;
}

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
      const read = (slug: string, locale: string) => {
        const path = fileOf(slug, locale);
        // shortcut: only existing files are watched, restart dev after adding or deleting one.
        this.addWatchFile(path);
        const raw = readFileSync(path, "utf8");
        return { path, raw, ...core.extractFrontmatterWithContent<Frontmatter>(raw) };
      };

      if (id === `\0${LIST}`) {
        const list = (locale: string) => {
          const posts = slugs().map((slug) => {
            const { path, raw, frontmatter, strippedContent } = read(slug, locale);
            const date = new Date(frontmatter.date ?? NaN);
            if (!frontmatter.title || Number.isNaN(date.getTime())) {
              throw new Error(`${path}: frontmatter needs a title and a valid date`);
            }
            // Reading time: the words of the Markdown source, code included, minus directive
            // and fence lines, at 200 a minute.
            const words = strippedContent
              .replace(/^\s*(:{2,}|```).*$/gm, "")
              .match(/[\p{L}\p{N}]+/gu);
            return {
              slug,
              title: frontmatter.title,
              summary: frontmatter.summary ?? "",
              date: date.toISOString().slice(0, 10),
              minutes: Math.max(1, Math.ceil((words?.length ?? 0) / 200)),
              toc: core.extractTocsFromRawMdx(raw),
            };
          });
          return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
        };
        const lists = `export const postsIn = ${JSON.stringify(
          Object.fromEntries(LOCALES.map((locale) => [locale, list(locale)])),
        )};`;
        if (!options?.ssr) return lists;
        // While the pages are built ahead of time, a post also comes with the HTML its body
        // renders to: the page is built with it, and React takes it over in the browser.
        return [
          'import { createElement } from "react";',
          'import { renderToString } from "react-dom/server";',
          'import { createMdxComponents } from "@docubook/markdown";',
          `import { bodies } from "${BODIES}";`,
          "const components = createMdxComponents();",
          lists,
          "for (const [locale, posts] of Object.entries(postsIn))",
          "  for (const post of posts)",
          "    post.html = renderToString(createElement(bodies[locale][post.slug], { components }));",
        ].join("\n");
      }

      if (id === `\0${BODIES}`) {
        const names = slugs();
        const body = (locale: string, i: number) => `Body_${locale}_${i}`;
        // shortcut: every post's body ships in one module, split per post when the blog grows.
        return [
          ...LOCALES.flatMap((locale) =>
            names.map((slug, i) => `import ${body(locale, i)} from "${BODY}${locale}/${slug}";`),
          ),
          `export const bodies = {${LOCALES.map(
            (locale) =>
              `${locale}: {${names.map((slug, i) => `${JSON.stringify(slug)}: ${body(locale, i)}`).join(",")}}`,
          ).join(",")}};`,
        ].join("\n");
      }

      const [locale, slug] = id.slice(`\0${BODY}`.length).split("/");
      if (!LOCALES.includes(locale) || !slugs().includes(slug))
        throw new Error(`No post for ${id}`);
      // DocuBook v2 authoring: Markdown plus directives (:::card). JSX tags are not components.
      const { compiledSource } = await core.serialize(read(slug, locale).strippedContent, {
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
