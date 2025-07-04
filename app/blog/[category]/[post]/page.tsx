import { BlogPostMeta } from "@/types";
import fs from "fs";
import path from "path";
import { constructMetadata } from "@/utils/metadata";
import { Heading, Text } from "@medusajs/ui";
import Image from "next/image";
import { authors } from "@/content/authors";
import { format } from "date-fns";
import NextLink from "next/link";
import { ScrollSpy } from "@/components/ui/custom/scroll-spy";
import { constructBlogPostJsonLd } from "@/utils/construct-jsonld";

type Params = Promise<{ category: string; post: string }>;

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const categories = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  const posts = categories.map((cat) => {
    const paths = fs.readdirSync(path.join(process.cwd(), "content/blog", cat));
    return paths.map((post) => ({
      category: cat,
      post: post.replace(".mdx", ""),
    }));
  });

  return posts.flat();
};

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { category, post } = await params;
  const { metadata } = (await import(`@/content/blog/${category}/${post}.mdx`)) as {
    metadata: BlogPostMeta;
  };
  if (!metadata) throw new Error(`Please add metadata to ${category}/${post}`);

  return constructMetadata({
    title: `${metadata.title} - Pryzma`,
    description: metadata.description,
    image: metadata.image,
  });
};

const getHeadings = (path: string) => {
  const content = fs.readFileSync(path, "utf-8");

  // get only h2 headings
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.replace("## ", "");
      const id = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return { id, text };
    });
};

const BlogPost = async ({ params }: { params: Params }) => {
  const { category, post } = await params;
  const { default: Post, metadata }: { default: React.ComponentType; metadata: BlogPostMeta } =
    await import(`@/content/blog/${category}/${post}.mdx`);

  const headings = getHeadings(path.join(process.cwd(), "content/blog", category, `${post}.mdx`));
  const jsonLd = constructBlogPostJsonLd({
    ...metadata,
    slug: `${category}/${post}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <header className="px-4">
          <div className="mx-auto grid max-w-screen-lg grid-cols-4 gap-6 pb-36">
            <div className="col-span-3 space-y-1 max-md:col-span-4">
              <nav className="flex items-center gap-2">
                <NextLink href={`/blog/${category}`}>
                  <Text
                    size="small"
                    className="text-subtle-foreground transition-colors hover:text-foreground"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </NextLink>
                <span className="relative top-[1px] text-xs text-subtle-foreground">•</span>
                <Text className="text-subtle-foreground" size="small">
                  {format(new Date(metadata.published), "MMMM do, yyyy")}
                </Text>
              </nav>
              {/* <Text className="text-subtle-foreground" size="small">
              {format(new Date(metadata.published), "MMMM do, yyyy")}
              </Text> */}
              <Heading className="text-2xl font-semibold tracking-tight max-md:text-xl">
                {metadata.title}
              </Heading>
              <Text className="text-[0.925rem] text-subtle-foreground max-md:text-sm">
                {metadata.description}
              </Text>
            </div>
          </div>
        </header>
        <div className="border-t bg-zinc-50 px-4 pb-24 dark:bg-zinc-900/50 max-md:px-0 max-md:pb-10">
          <div className="mx-auto grid max-w-screen-lg grid-cols-4 gap-6">
            <article className="relative -top-32 col-span-3 -mb-32 overflow-hidden rounded-lg border bg-background dark:bg-ui-bg-field max-md:col-span-4 max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:dark:bg-transparent">
              <figure className="aspect-[1200/630]">
                <Image
                  src={metadata.image}
                  alt={metadata.title}
                  height={630}
                  width={1200}
                  className="size-full object-cover"
                />
              </figure>
              <div
                className="prose prose-sm prose-zinc max-w-none p-6 dark:prose-invert prose-headings:mb-2 prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-[0.865rem] prose-p:text-subtle-foreground prose-li:text-[0.865rem] prose-li:text-subtle-foreground prose-img:my-6 max-md:px-4 max-md:pb-0 max-md:pt-6"
                data-mdx-container
              >
                <Post />
              </div>
            </article>
            <aside className="sticky top-[44px] col-span-1 h-fit space-y-8 pt-6 max-md:hidden">
              <section className="space-y-2">
                <Text className="text-subtle-foreground">Written by</Text>
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0 rounded-full border bg-zinc-100 p-0.5 shadow-sm dark:bg-zinc-800">
                    <Image
                      src={authors[metadata.author].image}
                      alt={metadata.author}
                      height={1000}
                      width={1000}
                      className="size-8 rounded-full"
                      quality={100}
                    />
                  </div>
                  <div>
                    <Text>{authors[metadata.author].name}</Text>
                    <Text size="small" className="text-subtle-foreground">
                      {authors[metadata.author].position}
                    </Text>
                  </div>
                </div>
              </section>
              <nav aria-label="Table of contents">
                <ScrollSpy headings={headings} />
              </nav>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogPost;
