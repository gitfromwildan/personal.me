const GITHUB_API = "https://api.github.com";

// Cache API responses for 12 hours. Used twice: by the Next.js fetch cache
// here, and by `export const revalidate` in app/page.tsx.
export const REVALIDATE_SECONDS = 43200;

export type RepoMeta = {
  fullName: string;
  url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string | null;
};

export async function getRepo(repo: string): Promise<RepoMeta | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };

    // Optional. Without a token GitHub allows 60 requests/hour per IP.
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`${GITHUB_API}/repos/${repo}`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS, tags: [`repo:${repo}`] },
    });

    if (!res.ok) return null;

    const data = await res.json();

    return {
      fullName: typeof data.full_name === "string" ? data.full_name : repo,
      url: typeof data.html_url === "string" ? data.html_url : githubUrl(repo),
      description: data.description ?? null,
      homepage: data.homepage || null,
      language: data.language ?? null,
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      pushedAt: data.pushed_at ?? null,
    };
  } catch {
    // Rate limit or network trouble: let the UI fall back to the repo name.
    return null;
  }
}

export function githubUrl(repo: string) {
  return `https://github.com/${repo}`;
}

// Contributions are a yearly metric, so cache them long: 7 days.
export const CONTRIBUTIONS_REVALIDATE_SECONDS = 604800;

export type ContributionSummary = {
  /**
   * "contributions" mirrors the GitHub profile graph, "commits" is the
   * public-only fallback used when no token is available.
   */
  metric: "contributions" | "commits";
  total: number;
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
};

/**
 * The same number shown by the contribution graph on the GitHub profile
 * (commits + PRs + issues + reviews, private repositories included) for
 * Jan 1 – Dec 31 of `year`.
 *
 * Requires a GITHUB_TOKEN owned by the account itself: only the owner may see
 * private contributions, so without one this can never match the profile. If
 * the token is missing or rejected it falls back to counting public commits
 * through the search API, and `metric` is flagged as "commits".
 */
export async function getContributions(
  user: string,
  year: number,
): Promise<ContributionSummary | null> {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    const summary = await getProfileContributions(user, year, token);
    if (summary) return summary;
  }

  const commits = await getCommitCount(user, year);
  if (commits === null) return null;

  return {
    metric: "commits",
    total: commits,
    commits,
    pullRequests: 0,
    issues: 0,
    reviews: 0,
  };
}

async function getProfileContributions(
  user: string,
  year: number,
  token: string,
): Promise<ContributionSummary | null> {
  const from = new Date(Date.UTC(year, 0, 1)).toISOString();
  const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
  const to = (
    endOfYear.getTime() > Date.now() ? new Date() : endOfYear
  ).toISOString();

  const query = `query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        contributionCalendar { totalContributions }
      }
    }
  }`;

  try {
    const res = await fetch(`${GITHUB_API}/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: user, from, to } }),
      // GraphQL is always POST, so caching has to be opted into explicitly.
      cache: "force-cache",
      next: {
        revalidate: CONTRIBUTIONS_REVALIDATE_SECONDS,
        tags: [`contributions:${user}:${year}`],
      },
    });

    if (!res.ok) return null;

    const { data } = await res.json();
    const collection = data?.user?.contributionsCollection;
    const total = collection?.contributionCalendar?.totalContributions;

    if (typeof total !== "number") return null;

    return {
      metric: "contributions",
      total,
      commits: collection.totalCommitContributions ?? 0,
      pullRequests: collection.totalPullRequestContributions ?? 0,
      issues: collection.totalIssueContributions ?? 0,
      reviews: collection.totalPullRequestReviewContributions ?? 0,
    };
  } catch {
    return null;
  }
}

/**
 * Number of public commits authored by `user` between Jan 1 and Dec 31 of
 * `year`, read from the search API's `total_count`. Search API needs no token
 * (10 requests/minute, safe because the result is cached for 7 days).
 * Returns null when the request fails.
 */
export async function getCommitCount(
  user: string,
  year: number,
): Promise<number | null> {
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `${GITHUB_API}/search/commits?q=author:${user}+author-date:${from}..${to}&per_page=1`,
      {
        headers,
        next: {
          revalidate: CONTRIBUTIONS_REVALIDATE_SECONDS,
          tags: [`contributions:${user}:${year}`],
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
