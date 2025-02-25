import { CategoryHeader } from "@/components/ui/category-header";
import { medusa } from "@/utils/medusa";
import { StoreProduct } from "@medusajs/types";
import { ProductGridShell } from "@/components/layout/product-grid-shell";
import { getTagCount } from "@/lib/helpers/get-tag-count";
import { constructMetadata } from "@/utils/metadata";
import { Metadata } from "next";
import { COLLECTION_DATA } from "@/lib/category-data";
import { Suspense } from "react";
import { ProductGridFallback } from "@/components/ui/product-grid-fallback";
import { constructCategoryPageJsonLd } from "@/utils/construct-jsonld";

export const dynamicParams = false;
type Params = Promise<{ collection: string }>;

export const generateStaticParams = async () => {
  const response = await medusa.store.collection.list();
  return response.collections.map((collection) => ({ collection: collection.handle }));
};

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { collection } = await params;
  const collectionData = COLLECTION_DATA[collection];
  return constructMetadata(collectionData.meta);
};

const getInitialData = async (
  collectionId: string,
): Promise<{ products: StoreProduct[]; count: number }> => {
  const response = await medusa.store.product.list({
    collection_id: collectionId,
    limit: 24,
    fields: "*variants.calculated_price",
  });

  return response;
};

const CollectionPage = async ({ params }: { params: Params }) => {
  const { collection } = await params;
  const collectionData = COLLECTION_DATA[collection];

  // fetch data for category
  const response = await medusa.store.collection.list({
    handle: collection,
    limit: 1,
  });
  const collectionId = response.collections[0].id;

  // fetch initial products for category
  const data = await getInitialData(collectionId);

  // fetch filter options and tag counts
  const filterOptions = collectionData.filters || undefined;
  const tagCounts = filterOptions
    ? await getTagCount({ options: filterOptions, collectionId })
    : undefined;

  const jsonLd = constructCategoryPageJsonLd({
    products: data.products,
    name: response.collections[0].title,
    description: collectionData.description,
    url: `https://pryzma.io/products/${response.collections[0].handle}`,
    image: collectionData.meta.image,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-[calc(100vh-330.5px)]">
        <section aria-label="Category header">
          <CategoryHeader
            title={response.collections[0].title}
            count={data.count}
            description={collectionData.description}
          />
        </section>
        <section aria-label="Product grid" className="p-4 pb-12">
          <div className="mx-auto max-w-screen-xl">
            <Suspense
              fallback={
                <ProductGridFallback
                  initialData={data.products}
                  filterCounts={tagCounts}
                  filterOptions={filterOptions}
                  name={response.collections[0].title}
                />
              }
            >
              <ProductGridShell
                initialData={data.products}
                initialCount={data.count}
                filterOptions={filterOptions}
                filterCounts={tagCounts}
                collectionId={collectionId}
                name={response.collections[0].title}
                quickAdd={collectionData.quickAdd}
              />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
};

export default CollectionPage;
