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
vp run build      # build apps/web: type-check .vue files, build, write every page as HTML
vp run -r test    # run every package's tests
vp run ready      # check + test + build everything
```

## Tests

The web app's tests (`apps/web/src/**/*.test.ts`) run in real browsers through Vitest's browser mode, once in Chromium and once in WebKit. They are set up in the `test` block of `apps/web/vite.config.ts`, and `.github/workflows/ci.yml` runs them, with the checks and the build, on every pull request and on pushes to `main`.

To run them on your machine, install the two browsers once with `vpx playwright install chromium webkit` in `apps/web`. Playwright has no browsers for macOS 12 and older: there the tests are skipped, unless a variable names a browser to use, `CHROMIUM_PATH` (any Chromium-based browser) or `WEBKIT_PATH`.

```bash
CHROMIUM_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" vp run -r test
```

## Versions

The versions every package shares are declared once, in the `catalog` of the root `package.json`: Vite+ (which brings Vite, Vitest, the linter and the formatter), Vue, TypeScript, Tailwind CSS and the Node types. A package asks for one with `"<name>": "catalog:"` in its own `package.json`, so an upgrade is one edit in the root followed by `vp install`.

Vite and Vitest come from Vite+: their catalog entries must match the versions that `vite-plus` release depends on (`npm view vite-plus dependencies`). Tailwind CSS is in the catalog but no package uses it yet.

Dependabot (`.github/dependabot.yml`) opens pull requests for newer versions once a week, for the packages and for the actions the CI workflow uses. It leaves `vite`, `vitest` and `@vitest/browser-playwright` alone, since those follow `vite-plus`, and does not move `@types/node` or `@typescript/typescript6` to a new major. Pull requests that fix a known vulnerability are turned on in the repository's settings; GitHub does not make them for Bun packages, which get the weekly update only.

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

`apps/web/posts.plugin.ts` has `@docubook/core` compile each post into a module whose default export is a React component. The `@docubook/markdown` components draw it, and they run as they are: at build time to make each post's HTML, and in the browser, where React takes that HTML over inside the one element of the Vue page that holds the post (`apps/web/src/components/blog/postIsland.ts`). Tabs, accordions, the copy button, diagrams and whatever else DocuBook adds work because they are DocuBook's own code. The site only restyles them, in the CSS of `apps/web/src/components/blog/PostBody.vue`.

That React script is the heaviest of the site (about 320 kB gzipped, most of it the icon set DocuBook looks icons up in by name), so it is fetched after a post is on screen, and ahead of time from the blog list. Each post also gets a reading time (its words at 200 a minute), shown in the table of contents.

## GitHub data

The commit count and the repo cards are not written in the code. `apps/web/src/composables/useGithub.ts` reads them from the public GitHub API in the visitor's browser and keeps them for an hour in `localStorage`. No token is used, so the commit count covers public commits only. If GitHub does not answer, the page shows a dash for the count and plain repo names.

## Deploy

Build command `vp run build`, output directory `apps/web/dist`.

Every page is written as its own HTML file at build time (`apps/web/prerender.ts`, the last step of the build): `index.html`, `blog.html` and `blog/<slug>.html`. A page is readable before any script has run, and Vue then takes it over in the browser.

The host must serve "clean URLs": answer `/blog/hello-world` with `blog/hello-world.html`. Netlify and Cloudflare Pages do so as they are, Vercel with `cleanUrls` turned on.

A new page needs a route in `apps/web/src/router.ts` and an entry in `routes` in `apps/web/src/entry-server.ts`, which lists what gets built. Posts are added to that list by themselves.

A path with no file of its own is the host's to answer. If it answers with `index.html`, the script sees that the HTML is the home page's, not that address's, and draws the right page itself.

## Not ported yet

The Next.js version is at commit `3034082` (`git show 3034082:<path>`):

- Site metadata (description, Open Graph, Twitter card): `src/app/layout.tsx`
- Security response headers: `next.config.mjs` (a static build needs these set on the host)

## Links

- [Live site](https://wildan.dev)
- [DocuBook](https://docubook.pro/) — My documentation framework
