// The last step of the build: writes every page of the site as its own HTML file, so a page is
// there to read before any script has run. Runs after `vp build --ssrManifest` (the site, into
// dist/) and `vp build --ssr` (the app as a module Node can run, into dist/server/).
import { readFileSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { Renderer } from "@takumi-rs/core";

const server = new URL("./dist/server/entry-server.js", import.meta.url).href;
// What src/entry-server.ts exports.
const { render, routes, site, inOtherLocale, ICONS } = (await import(server)) as {
  routes: string[];
  ICONS: Record<string, readonly [number, string, "stroke"?]>;
  site: string;
  inOtherLocale: (url: string) => string;
  render: (url: string) => Promise<{
    html: string;
    title?: string;
    card?: { page: string; title: string; summary: string };
    lang: string;
    modules: string[];
    preloadImage?: { src: string; srcset: string; sizes: string };
  }>;
};

/** Text made safe to put inside an HTML element, or an attribute in double quotes. */
const escape = (text: string) =>
  text.replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!,
  );

// dist/index.html is both the shell every page is written into and where the home page goes,
// so it is read before anything is written.
const shell = await readFile("dist/index.html", "utf8");

// A page's styles go into the page itself: as files of their own, the page could not be shown
// before each had been asked for and had arrived. `data-href` says which file they are.
const styles = (file: string) =>
  `<style data-href="${file}">${readFileSync(`dist${file}`, "utf8")}</style>`;
// The script that fetches a page on demand also fetches the styles that page needs, unless it
// finds a link to them. So each gets one, switched off and added by script: a browser fetches
// neither such a link nor, as it would one written in the page, ahead of reading it.
const links = `<script>
      for (const { dataset } of document.querySelectorAll("style[data-href]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("disabled", "");
        link.href = dataset.href;
        document.head.append(link);
      }
    </script>`;
// The shell's own stylesheet comes last in the head, so the script after it sees them all.
const page = shell.replace(
  /<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/,
  (_, file: string) => styles(file) + links,
);
if (page === shell) throw new Error("No stylesheet in dist/index.html to put into the pages.");
// The site's name, as the shell's own title gives it.
const siteName = shell.match(/<title>(.*)<\/title>/)![1];

// A page's social card, in the 404 page's deep water (see pages/NotFound.vue): light rays, a
// field of dots, the hero's hardware adrift on glass tiles and bubbles, the page's name on a
// glass chip and its title and summary in the middle. Colours are the dark theme's (see
// styles/tokens.css). Takumi carries Geist, the site's font; Geist Mono is given to it.
const renderer = new Renderer();
await renderer.registerFont(
  await readFile(
    "node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
  ),
);
const OG = { width: 1200, height: 630 };
const avatar = `data:image/webp;base64,${(await readFile("../../public/avatar.webp")).toString("base64")}`;
const icon = (name: string) => {
  const [box, d, stroke] = ICONS[name];
  const paint = stroke ? 'fill="none" stroke="#d4d4d4"' : 'fill="#d4d4d4"';
  return `<svg width="44%" height="44%" viewBox="0 0 ${box} ${box}" ${paint} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
};
// [left, width, tilt]; [icon, left, top, size, tilt]; [left, top, size]: pixels.
const rays = [
  [108, 140, 16],
  [372, 80, 8],
  [732, 170, -7],
  [996, 96, -15],
];
const tiles = [
  ["satellite-dish", 110, 70, 96, -12],
  ["mikrotik", 1010, 60, 84, 10],
  ["cctv", 1030, 400, 104, -8],
  ["typescript", 70, 430, 76, 14],
] as const;
const bubbles = [
  [300, 120, 26],
  [830, 90, 42],
  [980, 300, 20],
  [200, 520, 14],
  [900, 540, 32],
];
const decor = [
  ...rays.map(
    ([left, width, tilt]) =>
      `<div style="position:absolute;left:${left}px;top:-60px;width:${width}px;height:560px;transform-origin:top;transform:rotate(${tilt}deg);opacity:0.6;filter:blur(14px);background:linear-gradient(180deg, #ffffff38, #38bdf84d 40%, transparent)"></div>`,
  ),
  `<div style="position:absolute;inset:0;background:radial-gradient(circle, #ffffff1a 1px, transparent 1.5px) center / 28px 28px;mask-image:radial-gradient(ellipse 62% 58% at 50% 45%, #000, transparent)"></div>`,
  ...tiles.map(
    ([name, left, top, size, tilt]) =>
      `<div style="position:absolute;left:${left}px;top:${top}px;width:${size}px;height:${size}px;border-radius:${size * 0.26}px;transform:rotate(${tilt}deg);display:flex;align-items:center;justify-content:center;opacity:0.8;border:1px solid #ffffff30;box-shadow:0 18px 36px #00000080;background:linear-gradient(125deg, #ffffff22 15%, transparent 37%), linear-gradient(140deg, #38bdf81f 15%, transparent 68%), linear-gradient(180deg, #ffffff16, #ffffff0f)">${icon(name)}</div>`,
  ),
  ...bubbles.map(
    ([left, top, size]) =>
      `<div style="position:absolute;left:${left}px;top:${top}px;width:${size}px;height:${size}px;border-radius:50%;opacity:0.85;border:1px solid #ffffff38;box-shadow:0 8px 16px #00000080;background:radial-gradient(circle at 34% 28%, #d1fae5b3, #10b98124 20%, #10b98124 58%, #34d39973)"></div>`,
  ),
].join("");
const cardImage = (card: { page: string; title: string; summary: string }) =>
  renderer.render(
    `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;width:100%;height:100%;padding:0 170px;position:relative;font-family:Geist;color:#fafafa;text-align:center;background:radial-gradient(ellipse 60% 70% at 50% 0%, #22d3ee33, transparent), radial-gradient(circle at 0% 100%, #10b9814d, transparent 40%), radial-gradient(circle at 100% 80%, #38bdf833, transparent 45%), #07080b">
      ${decor}
      <div style="display:flex;align-items:center;gap:12px;padding:10px 22px 10px 18px;border-radius:999px;background:#ffffff1f;border:1px solid #ffffff38;box-shadow:0 8px 18px #00000080;font-family:'Geist Mono';font-size:22px;letter-spacing:0.08em;text-transform:uppercase">
        <div style="width:10px;height:10px;border-radius:50%;background:#34d399"></div>${escape(card.page)}
      </div>
      <div style="font-size:${card.title.length > 48 ? 52 : 66}px;font-weight:600;line-height:1.1;letter-spacing:-0.038em;line-clamp:3">${escape(card.title)}</div>
      <div style="font-size:26px;line-height:1.5;color:#bec3cd;line-clamp:3">${escape(card.summary)}</div>
      <div style="display:flex;align-items:center;gap:14px;margin-top:6px;font-size:23px;color:#d4d4d4">
        <img src="${avatar}" style="width:42px;height:42px;border-radius:50%;border:1px solid #ffffff47">${escape(siteName)}<span style="color:#6b7280">·</span><span style="color:#34d399">${escape(site.replace(/^https?:\/\//, ""))}</span>
      </div>
    </div>`,
    OG,
  );
// The pages a search engine should list: every one with a card (the 404 page has none).
const listed: string[] = [];

// Which files (script, styles, fonts) each module ended up in.
const manifest: Record<string, string[]> = JSON.parse(
  await readFile("dist/.vite/ssr-manifest.json", "utf8"),
);

for (const url of routes) {
  const { html, title, card, lang, modules, preloadImage } = await render(url);
  // The files of the page's own components that the shell does not already load: without the
  // styles the page would show unstyled until the script fetched them.
  const files = new Set(modules.flatMap((id) => manifest[id] ?? []));
  const head = [...files]
    .filter((file) => !shell.includes(file))
    .map((file) =>
      file.endsWith(".css")
        ? styles(file)
        : file.endsWith(".js")
          ? `<link rel="modulepreload" crossorigin href="${file}">`
          : "",
    )
    .join("");

  // A file named after the address: /blog/hello-world is dist/blog/hello-world.html. A host that
  // serves "clean URLs" answers the address with it directly, where a folder with an index.html
  // in it costs a redirect to the address with a slash on the end.
  const name = url === "/" ? "/index" : url;
  const file = `dist${name}.html`;
  await mkdir(dirname(file), { recursive: true });

  // What crawlers and link previews read: the summary, the page's one address and its other
  // language's, and its card, drawn here as dist/og/<page>.png.
  let meta = '<meta name="robots" content="noindex">';
  if (card) {
    const image = `/og${name}.png`;
    await mkdir(dirname(`dist${image}`), { recursive: true });
    await writeFile(`dist${image}`, await cardImage(card));
    listed.push(url);
    const other = inOtherLocale(url);
    const en = lang === "en" ? url : other;
    const attrs = (tag: string, pairs: [string, string][]) =>
      pairs.map(([key, value]) => `<${tag}="${key}" content="${escape(value)}">`).join("");
    meta =
      `<meta name="description" content="${escape(card.summary)}">` +
      `<link rel="canonical" href="${site}${url}">` +
      [
        [lang, url],
        [lang === "en" ? "id" : "en", other],
        ["x-default", en],
      ]
        .map(
          ([hreflang, href]) =>
            `<link rel="alternate" hreflang="${hreflang}" href="${site}${href}">`,
        )
        .join("") +
      attrs("meta property", [
        ["og:type", url.includes("/blog/") ? "article" : "website"],
        ["og:site_name", siteName],
        ["og:locale", lang === "id" ? "id_ID" : "en_US"],
        ["og:url", site + url],
        ["og:title", title ?? card.title],
        ["og:description", card.summary],
        ["og:image", site + image],
        ["og:image:width", `${OG.width}`],
        ["og:image:height", `${OG.height}`],
        ["og:image:alt", card.title],
      ]) +
      attrs("meta name", [["twitter:card", "summary_large_image"]]);
  }
  await writeFile(
    file,
    // Replacements are given as functions: in a plain string, a "$" from the page (there are
    // some in the posts' shell examples) could be read as an instruction to replace().
    page
      .replace(/(?<=<html lang=")[^"]*/, () => lang)
      .replace(/(?<=<title>).*(?=<\/title>)/, (shellTitle) => (title ? escape(title) : shellTitle))
      // The page's largest image is asked for straight after its title: the browser finds it in
      // the first bytes of the page, not after the styles the page carries in its head.
      .replace(
        "</title>",
        () =>
          "</title>" +
          meta +
          (preloadImage
            ? `<link rel="preload" as="image" fetchpriority="high" href="${escape(preloadImage.src)}" imagesrcset="${escape(preloadImage.srcset)}" imagesizes="${escape(preloadImage.sizes)}">`
            : ""),
      )
      .replace("<!--app-head-->", () => head)
      // The page says which address it was built for, so the script only takes over HTML that
      // is this address's own (see main.ts).
      .replace('<div id="app"><!--app-html-->', () => `<div id="app" data-page="${url}">${html}`),
  );
  console.log(`prerendered ${url} -> ${file}`);
}

// Where the listed pages are, for search engines, and where to find that list.
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${listed
    .map((url) => `  <url><loc>${site}${url}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);
await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

// Build leftovers that are no part of the site.
await rm("dist/server", { recursive: true });
await rm("dist/.vite", { recursive: true });
