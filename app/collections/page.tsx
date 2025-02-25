import { medusa } from "@/utils/medusa";
import { CategoryHeader } from "@/components/ui/category-header";
import { CATEGORY_DATA } from "@/lib/category-data";
import { CollectionCard } from "@/components/ui/collection-card";
import { constructMetadata } from "@/utils/metadata";
import NextLink from "next/link";
import { TriangleRightMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";

export const metadata = constructMetadata({
  title: "Collections - Pryzma",
  description: "Browse our collections of keyboard switches, lubricants, and accessories.",
});

const getCollections = async () => {
  const response = await medusa.store.category.list();
  return response.product_categories;
};

const Collections = async () => {
  const collections = await getCollections();

  return (
    <main className="min-h-[calc(100vh-330.5px)]">
      <section aria-label="Collections header">
        <CategoryHeader
          title="Collections"
          description="Select a collection to view products."
          count={collections.filter((c) => CATEGORY_DATA[c.handle]).length}
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
            {collections
              .filter((c) => CATEGORY_DATA[c.handle])
              .map((collection) => (
                <CollectionCard
                  key={collection.id}
                  title={collection.name}
                  image={CATEGORY_DATA[collection.handle]?.meta.image}
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
