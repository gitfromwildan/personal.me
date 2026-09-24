import Link from "next/link";
import { GitFork, Star } from "lucide-react";
import { Icons } from "@/components/icons";
import BlurFade from "@/components/ui/blur-fade";
import { getRepo, githubUrl } from "@/lib/github";

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
  const projects = await Promise.all(
    repos.map(async (repo) => ({ repo, meta: await getRepo(repo) })),
  );

  return (
    <ul className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {projects.map(({ repo, meta }, id) => {
        const name = meta?.fullName ?? repo;
        const source = meta?.url ?? githubUrl(repo);

        return (
          <li key={repo}>
            <BlurFade delay={delay + id * 0.05}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="flex items-baseline gap-2">
                  <Link
                    href={meta?.homepage ?? source}
                    target="_blank"
                    className="text-sm font-medium hover:underline"
                  >
                    {name}
                  </Link>
                  <Link
                    href={source}
                    target="_blank"
                    aria-label={`${name} source on GitHub`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icons.github className="size-3.5" />
                  </Link>
                </span>
                {meta && (
                  <span className="flex items-center gap-x-3 font-mono text-xs text-muted-foreground">
                    {meta.language && <span>{meta.language}</span>}
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3" aria-hidden="true" />
                      {meta.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="size-3" aria-hidden="true" />
                      {meta.forks}
                    </span>
                    {meta.pushedAt && <span>{timeAgo(meta.pushedAt)}</span>}
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
