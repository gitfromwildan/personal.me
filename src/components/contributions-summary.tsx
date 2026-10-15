import Link from "next/link";
import { Icons } from "@/components/icons";
import BlurFade from "@/components/ui/blur-fade";
import { getCommitCount } from "@/lib/github";

export async function ContributionsSummary({
  user,
  delay = 0,
}: {
  user: string;
  delay?: number;
}) {
  const count = await getCommitCount(user);

  // API failed or hit a rate limit: render nothing, the project list still works.
  if (count === null) return null;

  return (
    <BlurFade delay={delay}>
      <div className="glass mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-border px-4 py-3">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            All Contribution
          </p>
          <p className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold tracking-tight text-emerald-600/90 dark:text-emerald-400/90">
              {count.toLocaleString("en-US")}
            </span>
            <span className="text-sm text-muted-foreground">commits</span>
          </p>
        </div>
        <Link
          href={`https://github.com/${user}`}
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
