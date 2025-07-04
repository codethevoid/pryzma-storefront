import type { MetadataRoute } from "next";
import { medusa } from "@/utils/medusa";
import fs from "fs";
import path from "path";
import { BlogPostMeta } from "@/types";

const getCollectionRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  const response = await medusa.store.category.list();
  return response.product_categories.map((category) => ({
    // check if category is a parent or child
    // if parent, then nest in /products
    // if child, then nest in /collections (it is subset of parent)
    url: !category.parent_category_id
      ? `https://pryzma.io/products/${category.handle}`
      : `https://pryzma.io/collections/${category.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));
};

const getProductRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  const response = await medusa.store.product.list({ limit: 200 });
  return response.products
    .filter((product) => product.collection?.handle !== "samples")
    .map((product) => ({
      url: `https://pryzma.io/products/${product.collection?.handle}/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
};

const getBlogPosts = async (): Promise<MetadataRoute.Sitemap> => {
  const categories = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  const posts = categories.map((cat) => {
    const paths = fs.readdirSync(path.join(process.cwd(), "content/blog", cat));
    return paths.map(async (post) => {
      const { metadata } = (await import(`@/content/blog/${cat}/${post}`)) as {
        metadata: BlogPostMeta;
      };
      if (!metadata) throw new Error(`Please add metadata to ${cat}/${post}`);
      return {
        url: `https://pryzma.io/blog/${cat}/${post.replace(".mdx", "")}`,
        lastModified: metadata.lastModified
          ? new Date(metadata.lastModified)
          : new Date(metadata.published),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });
  });

  return await Promise.all(posts.flat());
};

const getBlogCategories = async (): Promise<MetadataRoute.Sitemap> => {
  const categories = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  return categories.map((cat) => ({
    url: `https://pryzma.io/blog/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [collectionRoutes, productRoutes, blogPosts, blogCategories] = await Promise.all([
    getCollectionRoutes(),
    getProductRoutes(),
    getBlogPosts(),
    getBlogCategories(),
  ]);

  return [
    {
      url: "https://pryzma.io",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://pryzma.io/legal/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://pryzma.io/legal/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://pryzma.io/legal/returns",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://pryzma.io/products",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://pryzma.io/generate",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://pryzma.io/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...collectionRoutes,
    ...productRoutes,
    ...blogPosts,
    ...blogCategories,
  ];
};

export default sitemap;
