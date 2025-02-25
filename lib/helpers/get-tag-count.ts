import { medusa } from "@/utils/medusa";

const getHandleIds = async ({ handle }: { handle: string | string[] }) => {
  const ids: string[] = [];
  if (typeof handle === "string") {
    const categoryResponse = await medusa.store.category.list({
      handle,
      limit: 1,
    });
    ids.push(categoryResponse.product_categories[0].id);
  } else {
    for (const i of handle) {
      const categoryResponse = await medusa.store.category.list({
        handle: i,
        limit: 1,
      });
      ids.push(categoryResponse.product_categories[0].id);
    }
  }
  return ids;
};

export const getTagCount = async ({
  options,
  categoryId,
  collectionId,
  handle,
}: {
  options: Record<string, { category: string; label: string; value: string }[]>;
  categoryId?: string | string[];
  collectionId?: string | string[];
  handle?: string | string[];
}) => {
  const tagIds = Object.values(options)
    .flat()
    .map((tag) => tag.value);

  const tagCounts = await Promise.all(
    tagIds.map(async (tagId) => {
      const response = await medusa.store.product.list({
        tag_id: tagId,
        ...(categoryId && { category_id: categoryId }),
        ...(collectionId && { collection_id: collectionId }),
        ...(handle && { category_id: await getHandleIds({ handle }) }),
        limit: 1,
      });

      return [tagId, response.count];
    }),
  );

  return Object.fromEntries(tagCounts);
};
