import { medusa } from "@/utils/medusa";
import { CategoryHeader } from "@/components/ui/category-header";
import { s3Url, cdnUrl } from "@/utils/s3";
import { CollectionCard } from "@/components/ui/collection-card";
import { constructMetadata } from "@/utils/metadata";
import NextLink from "next/link";
import { TriangleRightMini } from "@medusajs/icons";
import { Text, clx } from "@medusajs/ui";
import { getThumbnail } from "@/lib/helpers/get-thumbnail";
import { StoreProductCategory } from "@medusajs/types";

export const metadata = constructMetadata({
  title: "Collections - Pryzma",
  description: "Browse our collections of keyboard switches, lubricants, and accessories.",
});

const getCollections = async () => {
  const response = await medusa.store.category.list();
  return response.product_categories.filter((cat) => cat.parent_category_id);
};

const getThumbnails = async (collections: StoreProductCategory[]) => {
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
  const thumbnails = await getThumbnails(collections);

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
      <section
        aria-label="Collections grid"
        className="p-4 pb-12 max-sm:px-0 max-sm:pb-0 max-sm:pt-2"
      >
        <div className="mx-auto max-w-screen-xl space-y-4 max-sm:space-y-2">
          <div className="flex items-center gap-1.5 max-sm:px-4">
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
            className={
              "grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:gap-3 max-sm:grid-cols-2 max-sm:gap-0 max-sm:border-t"
            }
          >
            {collections.map((collection, i) => (
              <CollectionCard
                key={collection.id}
                title={collection.name}
                image={
                  thumbnails
                    .find((t) => t.handle === collection.handle)
                    ?.thumbnail?.replace(s3Url, cdnUrl) || ""
                }
                handle={collection.handle}
                className={clx(
                  "w-auto min-w-fit max-w-none last:border-b-0 max-md:w-auto max-md:min-w-fit max-md:max-w-none max-sm:rounded-none max-sm:border-b max-sm:bg-transparent max-sm:p-3 max-sm:shadow-none max-sm:odd:border-r",
                  collections.length % 2 === 0 &&
                    i === collections.length - 2 &&
                    "max-sm:border-b-0",
                  i === 0 && collections.length === 1 && "max-sm:!border-b",
                )}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Collections;
