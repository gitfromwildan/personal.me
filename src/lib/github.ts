const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = `${GITHUB_API}/graphql`;

// Cache API responses for 12 hours. Used twice: by the Next.js fetch cache
// here, and by `export const revalidate` in app/page.tsx.
export const REVALIDATE_SECONDS = 43200;

// Repo activity changes slowly, so cache it longer than the repo list: 7 days.
export const CONTRIBUTIONS_REVALIDATE_SECONDS = 604800;

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  // Optional. Without a token GitHub allows 60 requests/hour per IP.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

export type RepoMeta = {
  fullName: string;
  url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  /** Date of the newest commit on the default branch, ISO 8601. */
  lastCommitAt: string | null;
};

function toRepoMeta(data: any, fallback: string): RepoMeta {
  return {
    fullName: typeof data.full_name === "string" ? data.full_name : fallback,
    url:
      typeof data.html_url === "string"
        ? data.html_url
        : (data.url ?? githubUrl(fallback)),
    description: data.description ?? null,
    // REST uses `homepage`, GraphQL uses `homepageUrl`.
    homepage: data.homepage || data.homepageUrl || null,
    language:
      typeof data.language === "string"
        ? data.language
        : (data.language?.name ?? null),
    stars: data.stargazers_count ?? data.stargazerCount ?? 0,
    forks: data.forks_count ?? data.forkCount ?? 0,
    // GraphQL gives the real newest commit; REST only exposes last push.
    lastCommitAt:
      data.lastCommitAt ?? data.committedDate ?? data.pushed_at ?? null,
  };
}

/**
 * Metadata for a single repo through the REST repos endpoint. Used as the
 * fallback when no token is available, since GraphQL requires auth.
 */
export async function getRepo(repo: string): Promise<RepoMeta | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${repo}`, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS, tags: [`repo:${repo}`] },
    });

    if (!res.ok) return null;

    return toRepoMeta(await res.json(), repo);
  } catch {
    // Rate limit or network trouble: let the UI fall back to the repo name.
    return null;
  }
}

/**
 * Metadata for many repos in a single GraphQL request, batched with field
 * aliases so N repos cost one round-trip instead of N. Requires a token;
 * returns null entries for repos that fail so callers fall back per repo.
 *
 * GraphQL has no commit search, so the all-time commit count still uses REST
 * (see getCommitCount).
 */
export async function getReposBatch(
  repos: readonly string[],
): Promise<(RepoMeta | null)[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token || repos.length === 0) return repos.map(() => null);

  const parts = repos.map((repo, i) => {
    const [owner, name] = repo.split("/");
    return `r${i}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) {
      nameWithOwner
      url
      description
      homepageUrl
      stargazerCount
      forkCount
      pushedAt
      primaryLanguage { name }
      defaultBranchRef {
        target {
          ... on Commit { committedDate }
        }
      }
    }`;
  });

  const query = `query {
    ${parts.join("\n")}
  }`;

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      // GraphQL is always POST, so caching has to be opted into explicitly.
      cache: "force-cache",
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: repos.map((repo) => `repo:${repo}`),
      },
    });

    if (!res.ok) return repos.map(() => null);

    const { data } = await res.json();

    return repos.map((repo, i) => {
      const node = data?.[`r${i}`];
      if (!node) return null;

      return toRepoMeta(
        {
          full_name: node.nameWithOwner,
          url: node.url,
          description: node.description,
          homepageUrl: node.homepageUrl,
          language: node.primaryLanguage,
          stargazerCount: node.stargazerCount,
          forkCount: node.forkCount,
          lastCommitAt: node.defaultBranchRef?.target?.committedDate,
          pushed_at: node.pushedAt,
        },
        repo,
      );
    });
  } catch {
    return repos.map(() => null);
  }
}

export function githubUrl(repo: string) {
  return `https://github.com/${repo}`;
}

/**
 * Number of commits authored by `user` across all time, read from the search
 * API's `total_count`. No date filter is applied, so every commit the account
 * ever authored counts; the query intentionally omits `is:public` so commits in
 * private repositories are included too — provide a GITHUB_TOKEN owned by the
 * account to have those returned. Search API is rate limited to 10
 * requests/minute, safe because the result is cached for 7 days.
 *
 * GraphQL cannot replace this: its `search` only covers issues, repositories,
 * users and discussions — never commits.
 *
 * Note: the search API caps results at 1000, so very active accounts may see a
 * capped total. Returns null when the request fails.
 */
export async function getCommitCount(user: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/search/commits?q=author:${user}&sort=author-date&order=desc&per_page=1`,
      {
        headers: githubHeaders(),
        next: {
          revalidate: CONTRIBUTIONS_REVALIDATE_SECONDS,
          tags: [`contributions:${user}`],
        },
      },
    );

    if (!res.ok) return null;

    const data = await res.json();

    return typeof data.total_count === "number" ? data.total_count : null;
  } catch {
    return null;
  }
}
