import type { MetadataRoute } from "next";
import { medusa } from "@/utils/medusa";

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
    priority: 0.8,
  }));
};

const getProductRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  const response = await medusa.store.product.list({ limit: 100 });
  return response.products.map((product) => ({
    url: `https://pryzma.io/products/${product.collection?.handle}/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [collectionRoutes, productRoutes] = await Promise.all([
    getCollectionRoutes(),
    getProductRoutes(),
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
    ...collectionRoutes,
    ...productRoutes,
  ];
};

export default sitemap;
