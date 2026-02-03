import BlurFade from "@/components/ui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import Link from "next/link";
import { formatDateDMY } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AuroraText } from "@/components/ui/aurora-text";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <AuroraText className="font-medium text-2xl mb-2 tracking-tighter">Blog</AuroraText>
        <h2 className="font-small text-lg mb-8 tracking-tighter">My thoughts on software development, life, and more.</h2>
      </BlurFade>
      {posts
        .sort((a, b) => {
          if (
            new Date(a.metadata.date) > new Date(b.metadata.date)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post, id) => (
          <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
            <Link
              className="group relative flex flex-col space-y-2 rounded-xl border border-border/40 bg-background/50 p-4 backdrop-blur-sm transition-all hover:bg-accent/40 hover:border-border/80 hover:shadow-sm mb-4"
              href={`/blog/${post.slug}`}
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
                    {post.metadata.title}
                  </p>
                  <span className="text-xs text-muted-foreground/60 shrink-0 mt-1 pl-2">
                    {formatDateDMY(post.metadata.date)}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
                  {post.metadata.summary}
                </p>
              </div>
            </Link>
          </BlurFade>
        ))}
    </section>
  );
}
