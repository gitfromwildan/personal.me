// The last step of the build: writes every page of the site as its own HTML file, so a page is
// there to read before any script has run. Runs after `vp build --ssrManifest` (the site, into
// dist/) and `vp build --ssr` (the app as a module Node can run, into dist/server/).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const server = new URL("./dist/server/entry-server.js", import.meta.url).href;
// What src/entry-server.ts exports.
const { render, routes } = (await import(server)) as {
  routes: string[];
  render: (url: string) => Promise<{ html: string; title?: string; modules: string[] }>;
};

/** Text made safe to put inside an HTML element. */
const escape = (text: string) =>
  text.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char]!);

// dist/index.html is both the shell every page is written into and where the home page goes,
// so it is read before anything is written.
const shell = await readFile("dist/index.html", "utf8");
// Which files (script, styles, fonts) each module ended up in.
const manifest: Record<string, string[]> = JSON.parse(
  await readFile("dist/.vite/ssr-manifest.json", "utf8"),
);

for (const url of routes) {
  const { html, title, modules } = await render(url);
  // The files of the page's own components that the shell does not already load: without the
  // styles the page would show unstyled until the script fetched them.
  const files = new Set(modules.flatMap((id) => manifest[id] ?? []));
  const head = [...files]
    .filter((file) => !shell.includes(file))
    .map((file) =>
      file.endsWith(".css")
        ? `<link rel="stylesheet" crossorigin href="${file}">`
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
    shell
      .replace(/(?<=<title>).*(?=<\/title>)/, (shellTitle) => (title ? escape(title) : shellTitle))
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
