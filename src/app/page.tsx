import { AuroraText } from "@/components/ui/aurora-text";
import BlurFade from "@/components/ui/blur-fade";
import BlurFadeText from "@/components/ui/blur-fade-text";
import { HyperText } from "@/components/ui/hyper-text";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Image from 'next/image';
import Markdown from "react-markdown";
import { ProjectCard } from "@/components/project-card";

const BLUR_FADE_DELAY = 0.04;

export default function PageHome() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <HyperText
                className="text-3xl font-bold tracking-tighter sm:text-5xl"
              >
                {`Hi, I'm ${DATA.name.split(" ")[0]}`}
              </HyperText>
              <BlurFadeText
                className="max-w-[600px] md:text-xl"
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
          <h2> <AuroraText className="text-xl font-bold">About</AuroraText></h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown
            className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert"
            components={{
              a: ({ node, ...props }) => (
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
        </BlurFade>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2> <AuroraText className="text-xl font-bold">Skills</AuroraText></h2>
          </BlurFade>
          <div className="flex flex-wrap gap-2 items-center">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill.icon} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <div className="flex items-center gap-1 p-1 border rounded-2xl bg-gray-100 dark:bg-slate-50">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    width={48}
                    height={48}
                    className="w-[52px] h-[52px]"
                  />
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2> <AuroraText className="text-xl font-bold">Work Experience</AuroraText></h2>
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
      <section id="projects">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-white/60 dark:bg-white/10 px-3 py-1 text-sm backdrop-blur-md border border-zinc-200 dark:border-white/10 text-foreground shadow-sm">
                  My Projects
                </div>
                <h2>
                  <AuroraText className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Check out my latest work
                  </AuroraText>
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  I&apos;ve worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites.
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {DATA.projects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              >
                <ProjectCard
                  href={project.href}
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                />
              </BlurFade>
            ))}
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
                  with a direct question on telegram
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
