# Personal Portfolio

Personal portfolio and blog, being rebuilt as a **Vite + Vue** app inside a **Vite+** monorepo. The previous Next.js version is in the git history.

## Tech Stack

- [Vite+](https://viteplus.dev/) — toolchain: dev server, build, test, lint, format, task runner
- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Bun](https://bun.sh/) — package manager (workspaces)

## Getting Started

Requires the `vp` CLI ([install](https://viteplus.dev/guide/)). Node.js and Bun versions are pinned by the repo and downloaded by `vp` on first use.

```bash
vp install        # install all workspace dependencies
vp run dev        # start apps/web
vp check          # format, lint, type-check .ts (not .vue)
vp run build      # build apps/web (vue-tsc type-checks .vue files here)
vp run ready      # check + test + build everything
```

## Project Structure

```
apps/
└── web/          # the site (Vite + Vue)
packages/
└── utils/        # shared TypeScript library starter
content/          # MDX blog posts
public/           # static assets, served by apps/web
UI-personal.pen   # design file (pen.dev)
```

## Deploy

Build command `vp run build`, output directory `apps/web/dist`.

## Not ported yet

The Next.js version is at commit `3034082` (`git show 3034082:<path>`):

- Blog rendering: `src/components/markdown/`, `src/lib/mdx.tsx`, `src/lib/plugin.ts`, `src/data/blog.ts`
- GitHub stats: `src/lib/github.ts`
- Site metadata (description, Open Graph, Twitter card): `src/app/layout.tsx`
- Security response headers: `next.config.mjs` (a static build needs these set on the host)

## Links

- [Live site](https://wildan.dev)
- [DocuBook](https://docubook.pro/) — My documentation framework
