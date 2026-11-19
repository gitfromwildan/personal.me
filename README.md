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

The versions every package shares are declared once, in the `catalog` of the root `package.json`: Vite+ (which brings Vite, Vitest, the linter and the formatter), Vue and the packages that go with it (its router, vue-i18n, vue-tsc, the Vite plugin and the tsconfig), TypeScript, Tailwind CSS and the Node types. A package asks for one with `"<name>": "catalog:"` in its own `package.json`, so an upgrade is one edit in the root followed by `vp install`.

Vite and Vitest come from Vite+: their catalog entries must match the versions that `vite-plus` release depends on (`npm view vite-plus dependencies`).

Dependabot (`.github/dependabot.yml`) opens pull requests for newer versions once a week, for the packages and for the actions the CI workflow uses. It leaves `vite`, `vitest` and `@vitest/browser-playwright` alone, since those follow `vite-plus`, and does not move `@types/node` or `@typescript/typescript6` to a new major. Pull requests that fix a known vulnerability are turned on in the repository's settings; GitHub does not make them for Bun packages, which get the weekly update only.

## Project Structure

```
apps/
└── web/          # the site (Vite + Vue)
    └── src/
        ├── data/              # every piece of copy the pages show, one file per section
        ├── styles/tokens.css  # the design's tokens as Tailwind theme variables, light and dark
        ├── style.css          # Tailwind, its overrides, and shared classes: .glass, .chip, .btn, ...
        ├── components/ui/     # shared pieces: glass text, tube, meter, icons
        ├── components/home/   # one component per home page section
        ├── components/blog/   # post card, header, body, table of contents, navigation
        ├── composables/       # GitHub data, theme
        └── pages/             # Home, Blog list, Blog post
packages/
└── utils/        # shared TypeScript library starter
content/          # blog posts (Markdown + DocuBook directives); content/id/ holds their Indonesian
public/           # static assets, served by apps/web
```

## Styling

The site is styled with [Tailwind CSS](https://tailwindcss.com/) 4, through its Vite plugin. Utilities in the templates do the work; what Tailwind already has is used as it is, and changed by overriding it rather than replaced:

- The design's colours, fonts, breakpoints (640, 860 and 1000px) and type scale are theme variables in `apps/web/src/styles/tokens.css`: `bg-stage`, `text-ink`, `max-md:`, `text-sm`. Each is also a CSS variable, `var(--color-ink)`. The type scale carries no line height: text keeps its parent's unless a `leading-*` says otherwise.
- Tailwind's own pieces are overridden where the design differs: `container` is the 1120px page column at every width, `animate-ping` is the 404 page's sonar, and `dark:` follows the `data-theme` attribute the dock's switch sets, not the system.
- Pieces the pages share (`.glass`, `.chip`, `.btn`, `.bead`, `.mono-label`, ...) are in the `components` layer of `apps/web/src/style.css`, so a utility on the element overrides them: `class="glass rounded-[26px]"`.
- What utilities cannot say (keyframes, gradients of several layers, pseudo-elements, the hero's artboard) stays in a component's `<style scoped>`, written with Tailwind's own means: `@reference "../../style.css"`, `@apply`, `@variant motion-reduce`, `@variant awake` (once the visitor first moves, see `main.ts`), and the theme's variables.

## Languages

The site is in English and in Indonesian, with [vue-i18n](https://vue-i18n.intlify.dev/) holding the language being shown and the copy in each. The address decides the language: `/id/...` is Indonesian, everything else English. Both are built ahead of time, so `/id/blog` is its own HTML file, and the dock's language switch is a link to the same page in the other language.

English is written in `apps/web/src/data/`, one file per section. `apps/web/src/data/id/` holds the Indonesian of each section in a file of the same name; its type is checked against the English, so a section cannot go missing. Components read both through `DATA` (`DATA.hero.status`), which answers in the current language. Labels with a number in them, such as "6 skills", go through vue-i18n's `t()`.

The posts are in both languages too: `content/<slug>.mdx` is the English post and `content/id/<slug>.mdx` its Indonesian, under the same name and so at the same address after `/id`. A post with no Indonesian file is shown in English on the Indonesian pages until it has one. To add a language, add its folder next to `id/`, list it in `data/messages.ts`, and teach `localeOf` in `i18n.ts` and the route prefix in `router.ts` its address.

## Blog

Each file in `content/` is a post, served at `/blog/<file name>`; `/blog` lists them, newest first. Frontmatter needs `title` and `date` (`YYYY-MM-DD`), `summary` is optional.

Posts use DocuBook v2 syntax: Markdown plus directives such as `:::card`, `::::tabs`, `::::steps`, `::::accordions`. JSX tags (`<Card>`) are not components and are dropped.

`apps/web/posts.plugin.ts` has `@docubook/core` compile each post into a module whose default export is a React component. The `@docubook/markdown` components draw it, and they run as they are: at build time to make each post's HTML, and in the browser, where React takes that HTML over inside the one element of the Vue page that holds the post (`apps/web/src/components/blog/postIsland.ts`). Tabs, accordions, the copy button, diagrams and whatever else DocuBook adds work because they are DocuBook's own code. The site only restyles them, in the CSS of `apps/web/src/components/blog/PostBody.vue`.

That React script is the heaviest of the site (about 320 kB gzipped, most of it the icon set DocuBook looks icons up in by name), so it is fetched after a post is on screen, and ahead of time from the blog list. Each post also gets a reading time (its words at 200 a minute), shown in the table of contents.

## GitHub data

The commit count and the repo cards are not written in the code. `apps/web/src/composables/useGithub.ts` reads them from the public GitHub API in the visitor's browser and keeps them for an hour in `localStorage`. No token is used, so the commit count covers public commits only. If GitHub does not answer, the page shows a dash for the count and plain repo names.

## Deploy

The site is deployed on Vercel, set up by `vercel.json` at the root of the repo:

- Vercel installs with Bun, which it picks from `bun.lock`, and builds with `bun run build` (which is `vp run build`), into `apps/web/dist`. It runs Node 22, the major that `engines.node` in the root `package.json` allows and that `.node-version` pins for everyone else;
- `cleanUrls` answers `/blog/hello-world` with `blog/hello-world.html`, and sends an address ending in `.html` on to the one without;
- `trailingSlash: false` sends `/blog/` on to `/blog`;
- everything under `/assets/` is cached for a year and never asked for again: those files carry a hash of their content in their name, so a changed file is a new address. The images in `public/` are kept for four hours before being checked again;
- the blog list is kept by the browser for ten minutes and a post for an hour, in either language, before it checks for a newer copy. The home page keeps Vercel's default, which is to check every time.

Every page is written as its own HTML file at build time (`apps/web/prerender.ts`, the last step of the build): `index.html`, `blog.html` and `blog/<slug>.html`. A page is readable before any script has run, and Vue then takes it over in the browser.

On another host, the same is needed of it: it must serve "clean URLs", as Netlify and Cloudflare Pages do without being told.

A new page needs a route in `apps/web/src/router.ts` and an entry in `routes` in `apps/web/src/entry-server.ts`, which lists what gets built. Posts are added to that list by themselves.

A path with no file of its own is the host's to answer. If it answers with `index.html`, the script sees that the HTML is the home page's, not that address's, and draws the right page itself.

## Not ported yet

The Next.js version is at commit `3034082` (`git show 3034082:<path>`):

- Site metadata (description, Open Graph, Twitter card): `src/app/layout.tsx`
- Security response headers: `next.config.mjs` (a static build needs these set on the host)

## Links

- [Live site](https://wildan.dev)
- [DocuBook](https://docubook.pro/) — My documentation framework
