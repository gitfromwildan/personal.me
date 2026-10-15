import Link from "next/link";
import { GitFork, Star } from "lucide-react";
import { Icons } from "@/components/icons";
import BlurFade from "@/components/ui/blur-fade";
import { getRepo, getReposBatch, githubUrl } from "@/lib/github";

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);

  if (days <= 0) return "today";
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);

  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`;
}

export async function ProjectsList({
  repos,
  delay = 0,
}: {
  repos: readonly string[];
  delay?: number;
}) {
  // One GraphQL round-trip for every repo when a token is available; each
  // repo the batch cannot resolve falls back to its own REST request.
  const batch = await getReposBatch(repos);
  const projects = await Promise.all(
    repos.map(async (repo, i) => ({
      repo,
      meta: batch[i] ?? (await getRepo(repo)),
    })),
  );

  return (
    <ul className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {projects.map(({ repo, meta }, id) => {
        const name = meta?.fullName ?? repo;
        const source = meta?.url ?? githubUrl(repo);

        return (
          <li key={repo}>
            <BlurFade delay={delay + id * 0.05}>
              <div className="flex flex-col gap-y-1.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-3">
                <span className="flex min-w-0 items-baseline gap-2">
                  <Link
                    href={meta?.homepage ?? source}
                    target="_blank"
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {name}
                  </Link>
                  <Link
                    href={source}
                    target="_blank"
                    aria-label={`${name} source on GitHub`}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icons.github className="size-3.5" />
                  </Link>
                </span>
                {meta && (
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                    {meta.language && (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="size-2 shrink-0 rounded-full bg-muted-foreground/60"
                        />
                        {meta.language}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3" aria-hidden="true" />
                      {meta.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="size-3" aria-hidden="true" />
                      {meta.forks}
                    </span>
                    {meta.lastCommitAt && (
                      <span className="whitespace-nowrap">
                        last commit · {timeAgo(meta.lastCommitAt)}
                      </span>
                    )}
                  </span>
                )}
              </div>
              {meta?.description && (
                <p className="mt-1 text-pretty text-xs text-muted-foreground sm:text-sm">
                  {meta.description}
                </p>
              )}
            </BlurFade>
          </li>
        );
      })}
    </ul>
  );
}
