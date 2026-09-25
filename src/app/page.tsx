import { AuroraText } from "@/components/ui/aurora-text";
import BlurFade from "@/components/ui/blur-fade";
import BlurFadeText from "@/components/ui/blur-fade-text";
import { HyperText } from "@/components/ui/hyper-text";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { ContributionsSummary } from "@/components/contributions-summary";
import { ProjectsList } from "@/components/projects-list";
import { SkillsList } from "@/components/skills-list";
import { Quote } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

// GitHub login is derived from the link in the data instead of being written twice.
// Splitting on `/` keeps a trailing slash or extra path out of the API query.
const GITHUB_USER =
  new URL(DATA.contact.social.GitHub.url).pathname
    .split("/")
    .filter(Boolean)[0] ?? "";
const CONTRIBUTIONS_YEAR = new Date().getFullYear();

// Keep in sync with REVALIDATE_SECONDS in src/lib/github.ts.
export const revalidate = 43200;

export default function PageHome() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <HyperText className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {`Hi, I'm ${DATA.name.split(" ")[0]}`}
              </HyperText>
              <BlurFadeText
                className="max-w-[600px] text-sm leading-relaxed text-muted-foreground sm:text-base"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <figure className="relative rounded-xl border border-border border-l-[3px] border-l-primary/60 bg-muted px-5 py-4 sm:px-6 dark:bg-muted/30">
            <Quote
              className="absolute right-4 top-4 size-5 text-primary/20"
              aria-hidden="true"
            />
            <blockquote className="prose max-w-full text-pretty font-sans text-base leading-relaxed text-muted-foreground sm:text-lg dark:prose-invert">
              <Markdown
                components={{
                  a: ({ ...props }) => (
                    <Link
                      href={props.href || "#"}
                      target="_blank"
                      className="underline decoration-muted-foreground underline-offset-4 hover:text-primary transition-colors"
                      {...props}
                    />
                  ),
                }}
              >
                {DATA.summary}
              </Markdown>
            </blockquote>
            <figcaption className="mt-3 font-sans text-sm text-muted-foreground">
              — {DATA.name} · {DATA.location}
            </figcaption>
          </figure>
        </BlurFade>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2>
              {" "}
              <AuroraText className="text-xl font-bold">
                Work Experience
              </AuroraText>
            </h2>
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <ResumeCard
                key={work.company}
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2>
              {" "}
              <AuroraText className="text-xl font-bold">Skills</AuroraText>
            </h2>
          </BlurFade>
          <SkillsList groups={DATA.skills} delay={BLUR_FADE_DELAY * 10} />
        </div>
      </section>
      <section id="projects">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-white/60 dark:bg-white/10 px-3 py-1 text-sm backdrop-blur-md border border-zinc-200 dark:border-white/10 text-foreground shadow-sm">
                  Open Source
                </div>
                <h2>
                  <AuroraText className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    What I&apos;m building
                  </AuroraText>
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Built and maintained in public — the details come straight
                  from GitHub.
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="space-y-4">
            <ContributionsSummary
              user={GITHUB_USER}
              year={CONTRIBUTIONS_YEAR}
              delay={BLUR_FADE_DELAY * 11}
            />
            <ProjectsList repos={DATA.projects} delay={BLUR_FADE_DELAY * 12} />
          </div>
        </div>
      </section>
      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-white/60 dark:bg-white/10 px-3 py-1 text-sm backdrop-blur-md border border-zinc-200 dark:border-white/10 text-foreground shadow-sm">
                Contact
              </div>
              <h2>
                <AuroraText className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get in Touch
                </AuroraText>
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Want to chat? Just shoot me a dm{" "}
                <Link
                  href={DATA.contact.social.Telegram.url}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                >
                  with a direct question on threads
                </Link>{" "}
                and I&apos;ll respond whenever I can. I will ignore all
                soliciting.
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
