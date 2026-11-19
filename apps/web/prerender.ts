// The last step of the build: writes every page of the site as its own HTML file, so a page is
// there to read before any script has run. Runs after `vp build --ssrManifest` (the site, into
// dist/) and `vp build --ssr` (the app as a module Node can run, into dist/server/).
import { readFileSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const server = new URL("./dist/server/entry-server.js", import.meta.url).href;
// What src/entry-server.ts exports.
const { render, routes } = (await import(server)) as {
  routes: string[];
  render: (url: string) => Promise<{
    html: string;
    title?: string;
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
// Which files (script, styles, fonts) each module ended up in.
const manifest: Record<string, string[]> = JSON.parse(
  await readFile("dist/.vite/ssr-manifest.json", "utf8"),
);

for (const url of routes) {
  const { html, title, lang, modules, preloadImage } = await render(url);
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
  const file = `dist${url === "/" ? "/index" : url}.html`;
  await mkdir(dirname(file), { recursive: true });
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

// Build leftovers that are no part of the site.
await rm("dist/server", { recursive: true });
await rm("dist/.vite", { recursive: true });
