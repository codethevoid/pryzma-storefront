import type { MetadataRoute } from "next";
import { medusa } from "@/utils/medusa";
import { productTypeMappings } from "@/lib/product-types";

const getCollectionRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  const response = await medusa.store.collection.list();
  return response.collections.map((collection) => ({
    url: `https://pryzma.io/products/${collection.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
};

const getCategoryRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  const response = await medusa.store.category.list();
  return response.product_categories.map((category) => ({
    url: `https://pryzma.io/collections/${category.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
};

const getProductRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  const response = await medusa.store.product.list({ limit: 100 });
  return response.products.map((product) => ({
    url: `https://pryzma.io/products/${productTypeMappings[product.type?.value as keyof typeof productTypeMappings]}/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [collectionRoutes, categoryRoutes, productRoutes] = await Promise.all([
    getCollectionRoutes(),
    getCategoryRoutes(),
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
    ...categoryRoutes,
    ...productRoutes,
  ];
};

export default sitemap;
