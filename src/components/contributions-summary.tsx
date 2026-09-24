import Link from "next/link";
import { Icons } from "@/components/icons";
import BlurFade from "@/components/ui/blur-fade";
import { getContributions } from "@/lib/github";

export async function ContributionsSummary({
  user,
  year,
  delay = 0,
}: {
  user: string;
  year: number;
  delay?: number;
}) {
  const summary = await getContributions(user, year);

  // API failed or hit a rate limit: render nothing, the project list still works.
  if (!summary) return null;

  const isProfileMetric = summary.metric === "contributions";

  const breakdown: string[] = [
    `${summary.commits.toLocaleString("en-US")} commits`,
  ];
  if (isProfileMetric) {
    if (summary.pullRequests) breakdown.push(`${summary.pullRequests} PRs`);
    if (summary.issues) breakdown.push(`${summary.issues} issues`);
    if (summary.reviews) breakdown.push(`${summary.reviews} reviews`);
  }

  return (
    <BlurFade delay={delay}>
      <div className="glass mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-border px-4 py-3">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {isProfileMetric ? "Contributions" : "Public commits"} · Jan – Dec{" "}
            {year}
          </p>
          <p className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold tracking-tight text-emerald-600/90 dark:text-emerald-400/90">
              {summary.total.toLocaleString("en-US")}
            </span>
            <span className="text-sm text-muted-foreground">
              {isProfileMetric ? "contributions" : "commits"}
            </span>
          </p>
          {isProfileMetric && breakdown.length > 1 && (
            <p className="font-mono text-xs text-muted-foreground">
              {breakdown.join(" · ")}
            </p>
          )}
        </div>
        <Link
          href={`https://github.com/${user}?from=${year}-01-01&to=${year}-12-31`}
          target="_blank"
          className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icons.github className="size-3.5" />
          View on GitHub
        </Link>
      </div>
    </BlurFade>
  );
}
