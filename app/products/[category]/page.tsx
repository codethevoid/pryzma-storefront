import { CategoryHeader } from "@/components/ui/category-header";
import { medusa } from "@/utils/medusa";
import { StoreProduct } from "@medusajs/types";
import { ProductGridShell } from "@/components/layout/product-grid-shell";
import { getTagCount } from "@/lib/helpers/get-tag-count";
import { constructMetadata } from "@/utils/metadata";
import { Metadata } from "next";
import { FILTERS } from "@/lib/filter-options";
import { Suspense } from "react";
import { ProductGridFallback } from "@/components/ui/product-grid-fallback";
import { constructCategoryPageJsonLd } from "@/utils/construct-jsonld";
import { getThumbnail } from "@/lib/helpers/get-thumbnail";

export const dynamicParams = false;
type Params = Promise<{ category: string }>;

export const generateStaticParams = async () => {
  const response = await medusa.store.category.list();
  return response.product_categories
    .filter((cat) => !cat.parent_category_id)
    .map((category) => ({ category: category.handle }));
};

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { category: handle } = await params;
  const response = await medusa.store.category.list({
    handle,
    limit: 1,
  });
  const thumbnail = await getThumbnail(response.product_categories[0].id);
  return constructMetadata({
    title: `${response.product_categories[0].name} - Pryzma`,
    description:
      response.product_categories[0].description ||
      `Shop the ${response.product_categories[0].name} collection.`,
    image:
      response.product_categories[0].handle === "samples"
        ? "https://cdn.pryzma.io/featured/IMG_2855.JPG"
        : thumbnail,
  });
};

const getInitialData = async (
  categoryId: string,
): Promise<{ products: StoreProduct[]; count: number }> => {
  const response = await medusa.store.product.list({
    category_id: categoryId,
    limit: 24,
    fields: "*variants.calculated_price",
  });

  return response;
};

const CollectionPage = async ({ params }: { params: Params }) => {
  const { category: handle } = await params;

  // fetch data for category
  const response = await medusa.store.category.list({
    handle,
    limit: 1,
  });
  const categoryId = response.product_categories[0].id;

  // fetch initial products for category
  const data = await getInitialData(categoryId);

  // fetch filter options and tag counts
  const filterOptions = FILTERS[handle as keyof typeof FILTERS] || undefined;
  const tagCounts = filterOptions
    ? await getTagCount({ options: filterOptions, categoryId })
    : undefined;

  const jsonLd = constructCategoryPageJsonLd({
    products: data.products,
    name: response.product_categories[0].name,
    description:
      response.product_categories[0].description ||
      `Shop the ${response.product_categories[0].name} collection.`,
    url: `https://pryzma.io/products/${response.product_categories[0].handle}`,
    image:
      response.product_categories[0].handle === "samples"
        ? "https://cdn.pryzma.io/featured/IMG_2855.JPG"
        : await getThumbnail(categoryId),
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
            title={response.product_categories[0].name}
            count={data.count}
            description={
              response.product_categories[0].description ||
              `Shop the ${response.product_categories[0].name} collection.`
            }
          />
        </section>
        <section
          aria-label="Product grid"
          className="p-4 pb-12 max-sm:px-0 max-sm:pb-0 max-sm:pt-2"
        >
          <div className="mx-auto max-w-screen-xl">
            <Suspense
              fallback={
                <ProductGridFallback
                  initialData={data.products}
                  filterCounts={tagCounts}
                  filterOptions={filterOptions}
                  name={response.product_categories[0].name}
                />
              }
            >
              <ProductGridShell
                initialData={data.products}
                initialCount={data.count}
                filterOptions={filterOptions}
                filterCounts={tagCounts}
                categoryId={categoryId}
                name={response.product_categories[0].name}
                quickAdd={handle === "samples"}
              />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
};

export default CollectionPage;
