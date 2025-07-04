import { constructMetadata } from "@/utils/metadata";
import fs from "fs";
import path from "path";
import type { BlogPostMeta } from "@/types";
import { BlogCard } from "@/components/ui/blog-card";
import { constructBlogCategoryJsonLd } from "@/utils/construct-jsonld";

export const metadata = constructMetadata({
  title: "Blog - Pryzma",
  description:
    "Blog posts from the Pryzma team and community. Discover the latest in the keyboard industry.",
});

const getPosts = async (): Promise<BlogPostMeta[]> => {
  const categories = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  const posts = categories.map((cat) => {
    const paths = fs.readdirSync(path.join(process.cwd(), "content/blog", cat));
    return paths.map(async (post) => {
      const { metadata } = await import(`@/content/blog/${cat}/${post}`);
      if (!metadata) throw new Error(`Please add metadata to ${cat}/${post}`);
      return {
        ...(metadata as BlogPostMeta),
        slug: `/blog/${cat}/${post.replace(".mdx", "")}`,
      };
    });
  });

  const flatPosts = await Promise.all(posts.flat());
  return flatPosts.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );
};

const BlogHome = async () => {
  const posts = await getPosts();
  const jsonLd = constructBlogCategoryJsonLd(undefined, posts);
  console.log(jsonLd);
  return (
    <div className="min-h-[calc(100vh-375px)] px-4 pb-24">
      <div className="mx-auto grid max-w-screen-lg grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} meta={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogHome;
