# Personal Portfolio

Personal portfolio and blog, being rebuilt as a **Vite + Vue** app inside a **Vite+** monorepo. The previous Next.js version is in the git history.

## Tech Stack

- [Vite+](https://viteplus.dev/) — toolchain: dev server, build, test, lint, format, task runner
- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Bun](https://bun.sh/) — package manager (workspaces)
- [DocuBook](https://docubook.pro/) (`@docubook/core`, `@docubook/markdown`) — compiles the blog posts

## Getting Started

Requires the `vp` CLI ([install](https://viteplus.dev/guide/)). Node.js and Bun versions are pinned by the repo and downloaded by `vp` on first use.

```bash
vp install        # install all workspace dependencies
vp run dev        # start apps/web
vp check          # format, lint, type-check .ts (not .vue)
vp run build      # build apps/web (vue-tsc type-checks .vue files here)
vp run ready      # check + test + build everything
```

## Versions

The versions every package shares are declared once, in the `catalog` of the root `package.json`: Vite+ (which brings Vite, Vitest, the linter and the formatter), Vue, TypeScript, Tailwind CSS and the Node types. A package asks for one with `"<name>": "catalog:"` in its own `package.json`, so an upgrade is one edit in the root followed by `vp install`.

Vite and Vitest come from Vite+: their catalog entries must match the versions that `vite-plus` release depends on (`npm view vite-plus dependencies`). Tailwind CSS is in the catalog but no package uses it yet.

## Project Structure

```
apps/
└── web/          # the site (Vite + Vue)
    └── src/
        ├── data/              # every piece of copy the pages show, one file per section
        ├── styles/tokens.css  # colour tokens from the design, light and dark
        ├── style.css          # shared classes: .glass, .chip, .btn, .section, ...
        ├── components/ui/     # shared pieces: glass text, tube, meter, icons
        ├── components/home/   # one component per home page section
        ├── components/blog/   # post card, header, body, table of contents, navigation
        ├── composables/       # GitHub data, theme
        └── pages/             # Home, Blog list, Blog post
packages/
└── utils/        # shared TypeScript library starter
content/          # blog posts (Markdown + DocuBook directives)
public/           # static assets, served by apps/web
```

## Blog

Each file in `content/` is a post, served at `/blog/<file name>`; `/blog` lists them, newest first. Frontmatter needs `title` and `date` (`YYYY-MM-DD`), `summary` is optional.

Posts use DocuBook v2 syntax: Markdown plus directives such as `:::card`, `::::tabs`, `::::steps`, `::::accordions`. JSX tags (`<Card>`) are not components and are dropped.

`apps/web/posts.plugin.ts` compiles the posts with `@docubook/core` and renders them to static HTML with the `@docubook/markdown` components while Vite builds. Both packages are React based, so React is a build-time dependency only and is not in the browser bundle. `apps/web/src/components/blog/PostBody.vue` handles the clicks for tabs, accordions and the copy button, and restyles the DocuBook components to match the site. Each post also gets a reading time (its words at 200 a minute), shown in the table of contents.

## GitHub data

The commit count and the repo cards are not written in the code. `apps/web/src/composables/useGithub.ts` reads them from the public GitHub API in the visitor's browser and keeps them for an hour in `localStorage`. No token is used, so the commit count covers public commits only. If GitHub does not answer, the page shows a dash for the count and plain repo names.

## Deploy

Build command `vp run build`, output directory `apps/web/dist`.

The app is a single-page app: the host must serve `index.html` for paths it has no file for, or a direct visit to `/blog/<slug>` returns 404.

## Not ported yet

The Next.js version is at commit `3034082` (`git show 3034082:<path>`):

- Site metadata (description, Open Graph, Twitter card): `src/app/layout.tsx`
- Security response headers: `next.config.mjs` (a static build needs these set on the host)

## Links

- [Live site](https://wildan.dev)
- [DocuBook](https://docubook.pro/) — My documentation framework
