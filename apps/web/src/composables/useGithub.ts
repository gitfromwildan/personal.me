import { ref } from "vue";
import { DATA } from "../data";

const API = "https://api.github.com";
// Both calls use the search API (10 requests a minute per visitor without a token), so cache them.
const TTL = 60 * 60 * 1000;

export type Repo = {
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
};

const user = DATA.contact.social.GitHub.handle;

/** All-time number of public commits authored by the site owner, null until loaded or if GitHub fails. */
export const commitCount = ref<number | null>(null);
/** GitHub data for DATA.projects.repos, keyed by "owner/name". A repo is missing until loaded or if GitHub fails. */
export const repos = ref<Record<string, Repo>>({});

async function load<T>(key: string, path: string, pick: (json: any) => T): Promise<T | null> {
  let hit: { at: number; value: T } | null = null;
  try {
    hit = JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    // No usable cache: fetch.
  }
  if (hit && Date.now() - hit.at < TTL) return hit.value;
  try {
    const res = await fetch(API + path, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const value = pick(await res.json());
    try {
      localStorage.setItem(key, JSON.stringify({ at: Date.now(), value }));
    } catch {
      // Storage full or blocked: the value is still shown.
    }
    return value;
  } catch {
    // Rate limited or offline: an old number beats none.
    return hit?.value ?? null;
  }
}

let started = false;

/** Fetches once per page load, however many components call it. */
export function loadGithub() {
  if (started) return;
  started = true;

  void load("github:commits", `/search/commits?q=author:${user}&per_page=1`, (json) =>
    typeof json.total_count === "number" ? json.total_count : null,
  ).then((count) => (commitCount.value = count));

  const query = DATA.projects.repos.map((repo) => `repo:${repo}`).join("+");
  void load("github:repos", `/search/repositories?q=${query}`, (json) =>
    Object.fromEntries(
      (json.items as any[]).map((item): [string, Repo] => [
        item.full_name,
        {
          url: item.html_url,
          description: item.description,
          language: item.language,
          stars: item.stargazers_count,
          forks: item.forks_count,
          pushedAt: item.pushed_at,
        },
      ]),
    ),
  ).then((found) => (repos.value = found ?? {}));
}

export const githubUrl = (repo: string) => `https://github.com/${repo}`;
