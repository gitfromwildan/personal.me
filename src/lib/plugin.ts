import { visit } from "unist-util-visit";
import { Node } from "unist";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';

// --- Interfaces ---

interface ElementNode extends Node {
    tagName: string;
    properties?: Record<string, any>;
    children?: ElementNode[];
}

interface CodeNode extends Node {
    lang?: string;
    meta?: string;
    data?: {
        hProperties?: Record<string, string>;
    };
}

// --- Plugins ---

export function rehypeCopyAttrs() {
    return (tree: Node) => {
        visit(tree, "element", (node: ElementNode) => {
            // Case 1: pre > code (Standard rehype-copy-attrs behavior)
            if (node.tagName === "pre" && node.children && node.children.length > 0) {
                const codeNode = node.children.find((c) => c.tagName === "code");
                if (codeNode && codeNode.properties && codeNode.properties["data-filename"]) {
                    if (!node.properties) node.properties = {};
                    node.properties["data-filename"] = codeNode.properties["data-filename"];
                }
            }

            // Case 2: figure > pre (rehype-pretty-code output)
            if (node.tagName === "figure" && node.properties && (node.properties["data-filename"] || node.properties["dataFilename"])) {
                const filename = node.properties["data-filename"] || node.properties["dataFilename"];
                const preNode = node.children?.find((c) => c.tagName === "pre");
                if (preNode) {
                    if (!preNode.properties) preNode.properties = {};
                    preNode.properties["data-filename"] = filename;
                }
            }
        });
    };
}

export function remarkCodeTitle() {
    return (tree: Node) => {
        visit(tree, "code", (node: CodeNode) => {
            const language = node.lang || "";
            const [lang, title] = language.split(":");

            if (title) {
                node.lang = lang;
                if (!node.data) node.data = {};
                if (!node.data.hProperties) node.data.hProperties = {};

                // Pass the filename as a data attribute to the HTML element
                node.data.hProperties["data-filename"] = title;

                // Also inject into meta so CodeBlockMdx can read it via data-raw-meta fallback
                node.meta = (node.meta || "") + ` title="${title}"`;
            }
        });
    };
}

// --- Repro / Utilities ---

export async function runRepro() {
    const code = 'const a = 1;';

    const file = await unified()
        .use(remarkParse)
        .use(remarkCodeTitle) // Added
        .use(remarkRehype)
        .use(rehypeCopyAttrs) // Run before to move code->pre
        .use(rehypePrettyCode, {
            theme: {
                light: 'github-light',
                dark: 'github-dark',
            },
            keepBackground: false,
            defaultColor: false,
        } as any)
        .use(() => rehypeCopyAttrs()) // Moved after, wrapped to avoid dedup
        .use(rehypeStringify)
        .process(`\`\`\`js:main.js\n${code}\n\`\`\``);

    // console.log("HTML Output:", String(file));
    return file;
}
