import { constructMetadata } from "@/utils/metadata";
import fs from "fs";
import { Metadata } from "next";
import path from "path";
import { BlogPostMeta } from "@/types";
import { BlogCard } from "@/components/ui/blog-card";
import { constructBlogCategoryJsonLd } from "@/utils/construct-jsonld";

type Params = Promise<{ category: string }>;

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const categories = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  return categories.map((cat) => ({ category: cat }));
};

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { category } = await params;
  return constructMetadata({
    title: `${category.charAt(0).toUpperCase() + category.slice(1).split("-").join(" ")} - Pryzma`,
    description:
      "Blog posts from the Pryzma team and community. Discover the latest in the keyboard industry.",
  });
};

const getPosts = async (category: string): Promise<BlogPostMeta[]> => {
  const postPaths = fs.readdirSync(path.join(process.cwd(), "content/blog", category));
  if (postPaths.length === 0) return [];

  const posts = await Promise.all(
    postPaths.map(async (post) => {
      const { metadata } = await import(`@/content/blog/${category}/${post}`);
      if (!metadata) throw new Error(`Please add metadata to ${category}/${post}`);
      return {
        ...(metadata as BlogPostMeta),
        slug: `/blog/${category}/${post.replace(".mdx", "")}`,
      };
    }),
  );

  return posts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
};

const BlogCategory = async ({ params }: { params: Params }) => {
  const { category } = await params;
  const posts = await getPosts(category);
  const jsonLd = constructBlogCategoryJsonLd(category, posts);
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

export default BlogCategory;
