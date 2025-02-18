import { medusa } from "@/utils/medusa";

export const getTagCount = async ({
  options,
  categoryId,
}: {
  options: Record<string, { category: string; label: string; value: string }[]>;
  categoryId?: string | string[];
}) => {
  const tagIds = Object.values(options)
    .flat()
    .map((tag) => tag.value);

  const tagCounts = await Promise.all(
    tagIds.map(async (tagId) => {
      const response = await medusa.store.product.list({
        tag_id: tagId,
        ...(categoryId && { category_id: categoryId }),
        limit: 1,
      });

      return [tagId, response.count];
    }),
  );

  return Object.fromEntries(tagCounts);
};
