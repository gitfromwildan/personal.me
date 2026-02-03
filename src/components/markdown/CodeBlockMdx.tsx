"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    SiJavascript,
    SiTypescript,
    SiPython,
    SiGo,
    SiPhp,
    SiRuby,
    SiSwift,
    SiKotlin,
    SiHtml5,
    SiCss3,
    SiSass,
    SiPostgresql,
    SiGraphql,
    SiJson,
    SiYaml,
    SiToml,
    SiDocker,
    SiNginx,
    SiGit,
    SiGnubash,
    SiMarkdown,
    SiReact,
} from "react-icons/si";
import { VscTerminalBash, VscFile } from "react-icons/vsc";

// Language to icon mapping
const languageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    javascript: SiJavascript,
    js: SiJavascript,
    typescript: SiTypescript,
    ts: SiTypescript,
    jsx: SiReact,
    tsx: SiReact,
    python: SiPython,
    py: SiPython,
    go: SiGo,
    golang: SiGo,
    php: SiPhp,
    ruby: SiRuby,
    rb: SiRuby,
    swift: SiSwift,
    kotlin: SiKotlin,
    kt: SiKotlin,
    html: SiHtml5,
    css: SiCss3,
    sass: SiSass,
    scss: SiSass,
    sql: SiPostgresql,
    graphql: SiGraphql,
    gql: SiGraphql,
    json: SiJson,
    yaml: SiYaml,
    yml: SiYaml,
    toml: SiToml,
    dockerfile: SiDocker,
    docker: SiDocker,
    nginx: SiNginx,
    gitignore: SiGit,
    git: SiGit,
    bash: SiGnubash,
    sh: SiGnubash,
    shell: SiGnubash,
    zsh: SiGnubash,
    terminal: VscTerminalBash,
    markdown: SiMarkdown,
    md: SiMarkdown,
    mdx: SiMarkdown,
};

// Language color mapping for icon styling
const languageColors: Record<string, string> = {
    javascript: "text-yellow-400",
    js: "text-yellow-400",
    typescript: "text-blue-500",
    ts: "text-blue-500",
    jsx: "text-cyan-400",
    tsx: "text-cyan-400",
    python: "text-blue-400",
    py: "text-blue-400",
    go: "text-cyan-500",
    golang: "text-cyan-500",
    php: "text-purple-400",
    ruby: "text-red-500",
    rb: "text-red-500",
    swift: "text-orange-500",
    kotlin: "text-purple-500",
    kt: "text-purple-500",
    html: "text-orange-500",
    css: "text-blue-500",
    sass: "text-pink-500",
    scss: "text-pink-500",
    sql: "text-blue-400",
    graphql: "text-pink-500",
    gql: "text-pink-500",
    json: "text-yellow-500",
    yaml: "text-red-400",
    yml: "text-red-400",
    toml: "text-gray-400",
    dockerfile: "text-blue-500",
    docker: "text-blue-500",
    nginx: "text-green-500",
    gitignore: "text-orange-500",
    git: "text-orange-500",
    bash: "text-green-400",
    sh: "text-green-400",
    shell: "text-green-400",
    zsh: "text-green-400",
    terminal: "text-gray-400",
    markdown: "text-white",
    md: "text-white",
    mdx: "text-white",
};

interface CodeBlockTitleProps {
    language?: string;
    filename?: string;
}

/**
 * Code Block Title Bar Component
 * 
 * Displays a title bar above code blocks with:
 * - Language icon
 * - Filename or language name
 * - Copy button
 * 
 * Usage in MDX (automatically applied via rehype-pretty-code):
 * ```javascript:main.js
 * console.log("Hello");
 * ```
 */
interface CodeBlockTitleBarProps {
    language?: string;
    filename?: string;
    onCopy?: () => void;
    copied?: boolean;
}

export function CodeBlockTitleBar({ language, filename, onCopy, copied }: CodeBlockTitleBarProps) {
    // Parse language - it might come as "javascript:main.js" format
    let parsedLang = language || "";
    let parsedFilename = filename;

    if (parsedLang.includes(":")) {
        const parts = parsedLang.split(":");
        parsedLang = parts[0];
        parsedFilename = parsedFilename || parts[1];
    }

    const lang = parsedLang.toLowerCase();
    const IconComponent = languageIcons[lang] || VscFile;
    const iconColor = languageColors[lang] || "text-muted-foreground";

    // Show filename if provided, otherwise show language name
    const displayName = parsedFilename || parsedLang || "code";
    return (
        <div className="code-block-title">
            <div className="flex items-center gap-2">
                <IconComponent className={cn("w-4 h-4", iconColor)} />
                <span className="text-muted-foreground ml-1 font-medium">{displayName}</span>
            </div>
            {onCopy && (
                <button
                    onClick={onCopy}
                    className="code-block-copy-btn"
                    aria-label={copied ? "Copied!" : "Copy code"}
                >
                    {copied ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
}

// Keep backward compatibility
export function CodeBlockTitle({ language, filename }: CodeBlockTitleProps) {
    return <CodeBlockTitleBar language={language} filename={filename} />;
}

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
    children?: React.ReactNode;
    "data-language"?: string;
    "data-theme"?: string;
}

/**
 * Enhanced Pre Component
 * 
 * Wraps the default <pre> element to add:
 * - Title bar with language icon and filename
 * - Copy button
 * - Enhanced styling for code blocks
 * 
 * The language and filename are extracted from the code fence:
 * ```javascript:main.js showLineNumbers {3-4}
 * 
 * Exception: When using 4 backticks (plaintext), no title bar is rendered,
 * only a floating copy button is shown.
 */
export function Pre({ children, className, ...props }: PreProps) {
    const [copied, setCopied] = React.useState(false);
    const preRef = React.useRef<HTMLPreElement>(null);
    // console.log("Pre props:", props);
    // console.log("Pre children props:", (children as any)?.props);

    // Extract language from data attribute
    const language = props["data-language"];

    // Try to extract filename from data-filename (injected by remark-code-title)
    // or from raw-meta if available
    const injectedFilename = (props as any)["data-filename"];
    const rawMeta = (props as any)["data-raw-meta"] || "";
    const titleMatch = rawMeta.match(/title="([^"]+)"/);
    const filename = injectedFilename || (titleMatch ? titleMatch[1] : undefined);

    // Determine if we should show the full title bar
    // Skip title bar for plaintext or when no language is specified (4 backticks case)
    const showTitleBar = language && language !== "plaintext" && language !== "text";

    const handleCopy = async () => {
        if (preRef.current) {
            const code = preRef.current.textContent || "";
            try {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    // Floating copy button component for plaintext blocks
    const FloatingCopyButton = () => (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 code-block-copy-btn"
            aria-label={copied ? "Copied!" : "Copy code"}
        >
            {copied ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );

    return (
        <div className="code-block-wrapper">
            {showTitleBar ? (
                <CodeBlockTitleBar
                    language={language}
                    filename={filename}
                    onCopy={handleCopy}
                    copied={copied}
                />
            ) : (
                <FloatingCopyButton />
            )}
            <pre
                ref={preRef}
                className={cn(
                    showTitleBar ? "!rounded-t-none" : "!rounded-lg",
                    "!mt-0",
                    className
                )}
                {...props}
            >
                {children}
            </pre>
        </div>
    );
}

/**
 * Copy Button Component
 * 
 * A button to copy code block contents to clipboard
 */
export function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-md bg-neutral-700/50 hover:bg-neutral-600/50 transition-colors text-neutral-300 hover:text-white opacity-0 group-hover:opacity-100"
            aria-label={copied ? "Copied!" : "Copy code"}
        >
            {copied ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );
}

const CodeBlockComponents = { CodeBlockTitle, Pre, CopyButton };
export default CodeBlockComponents;
