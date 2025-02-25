import { medusa } from "@/utils/medusa";
import { CategoryHeader } from "@/components/ui/category-header";
import { s3Url, cdnUrl } from "@/utils/s3";
import { CollectionCard } from "@/components/ui/collection-card";
import { constructMetadata } from "@/utils/metadata";
import NextLink from "next/link";
import { TriangleRightMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";
import { getThumbnail } from "@/lib/helpers/get-thumbnail";

export const metadata = constructMetadata({
  title: "Collections - Pryzma",
  description: "Browse our collections of keyboard switches, lubricants, and accessories.",
});

const getCollections = async () => {
  const response = await medusa.store.category.list();
  return response.product_categories.filter((cat) => cat.parent_category_id);
};

const getThumbnails = async () => {
  const collections = await getCollections();
  return Promise.all(
    collections.map(async (collection) => {
      const thumbnail = await getThumbnail(collection.id);
      return {
        handle: collection.handle,
        thumbnail,
      };
    }),
  );
};

const Collections = async () => {
  const collections = await getCollections();
  const thumbnails = await getThumbnails();

  return (
    <main className="min-h-[calc(100vh-330.5px)]">
      <section aria-label="Collections header">
        <CategoryHeader
          title="Collections"
          description="Select a collection to view products."
          count={collections.length}
          hideCountDescription
        />
      </section>
      <section aria-label="Collections grid" className="p-4 pb-12">
        <div className="mx-auto max-w-screen-xl space-y-4">
          <div className="flex items-center gap-1.5">
            <NextLink href="/">
              <Text
                size="small"
                className="text-subtle-foreground transition-colors hover:text-foreground"
              >
                Home
              </Text>
            </NextLink>
            <TriangleRightMini className="relative top-[1px] text-subtle-foreground" />
            <Text size="small" className="cursor-default text-subtle-foreground">
              Collections
            </Text>
          </div>
          <div
            className={"grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:gap-3 max-sm:grid-cols-2"}
          >
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                title={collection.name}
                image={
                  thumbnails
                    .find((t) => t.handle === collection.handle)
                    ?.thumbnail?.replace(s3Url, cdnUrl) || ""
                }
                handle={collection.handle}
                className="w-auto min-w-fit max-w-none max-md:w-auto max-md:min-w-fit max-md:max-w-none"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Collections;
