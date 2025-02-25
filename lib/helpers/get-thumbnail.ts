import { cache } from "react";
import { medusa } from "@/utils/medusa";
import { s3Url, cdnUrl } from "@/utils/s3";

export const getThumbnail = cache(async (categoryId: string) => {
  const response = await medusa.store.product.list({
    category_id: categoryId,
    limit: 100,
  });

  return (
    response.products[
      Math.floor(Math.random() * response.products.length)
    ]?.images?.[1]?.url?.replace(s3Url, cdnUrl) ||
    response.products[
      Math.floor(Math.random() * response.products.length)
    ]?.images?.[0]?.url?.replace(s3Url, cdnUrl) ||
    ""
  );
});
