"use client";

import { useEffect, useRef, useState } from "react";
import BlurFade from "@/components/ui/blur-fade";
import Markdown from "react-markdown";

// Skills revealed before the first scroll, split evenly across categories.
const INITIAL_TOTAL = 4;

export type Skill = {
  name: string;
  description: string;
  percentage: number;
};

export function SkillsList({
  groups,
  delay = 0,
}: {
  groups: Record<string, readonly Skill[]>;
  delay?: number;
}) {
  const entries = Object.entries(groups);
  const [perGroup, setPerGroup] = useState(() =>
    Math.max(1, Math.floor(INITIAL_TOTAL / Math.max(1, entries.length))),
  );
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = entries.some(([, skills]) => skills.length > perGroup);

  // A single sentinel sits at the end of the whole list: each time it enters
  // the viewport, every category reveals one more row until all are shown.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMore || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPerGroup((count) => count + 1);
        }
      },
      { rootMargin: "0px 0px -25% 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      {entries.map(([title, skills], groupIndex) => {
        const visible = skills.slice(0, perGroup);

        return (
          <div key={title}>
            <BlurFade delay={delay + groupIndex * 0.08}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {title}
                </h3>
                {skills.length > perGroup && (
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {visible.length}/{skills.length}
                  </span>
                )}
              </div>
            </BlurFade>
            <ul className="flex flex-col gap-4">
              {visible.map((skill, id) => (
                <li key={skill.name}>
                  <BlurFade delay={delay + groupIndex * 0.08 + id * 0.05}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="font-mono text-xs text-emerald-600/90 dark:text-emerald-400/90">
                        {skill.percentage}%
                      </span>
                    </div>
                    <div className="mt-1 text-pretty text-xs text-muted-foreground sm:text-sm">
                      <Markdown>{skill.description}</Markdown>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-emerald-600/90 dark:bg-emerald-400/90"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </BlurFade>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
    </div>
  );
}
