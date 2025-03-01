import { medusa } from "@/utils/medusa";
import { getTagCount } from "@/lib/helpers/get-tag-count";
import { constructCategoryPageJsonLd } from "@/utils/construct-jsonld";
import { CategoryHeader } from "@/components/ui/category-header";
import { ProductGridFallback } from "@/components/ui/product-grid-fallback";
import { ProductGridShell } from "@/components/layout/product-grid-shell";
import { Suspense } from "react";
import { constructMetadata } from "@/utils/metadata";
import { FILTERS } from "@/lib/filter-options";
import { getThumbnail } from "@/lib/helpers/get-thumbnail";

/**
 * This page is used to display what we call "collections" on the website.
 * The difference is that these are called categories in Medusa.
 * These are essentially categories that we have created to group products together.
 *
 * We use this page to display the products in a grid and to display the category header.
 *
 * We also use this page to generate the JSON-LD for the category.
 *
 */

export const dynamicParams = false;
type Params = Promise<{ category: string }>;

export const generateStaticParams = async () => {
  const response = await medusa.store.category.list();
  return response.product_categories
    .filter((cat) => cat.parent_category_id)
    .map((category) => ({ category: category.handle }));
};

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { category } = await params;
  const response = await medusa.store.category.list({
    handle: category,
    limit: 1,
  });

  const thumbnail = await getThumbnail(response.product_categories[0].id);

  return constructMetadata({
    title: `${response.product_categories[0].name} - Pryzma`,
    description:
      response.product_categories[0].description ||
      `Shop the ${response.product_categories[0].name} collection.`,
    image: thumbnail,
  });
};

const getInitialData = async (categoryId: string) => {
  const response = await medusa.store.product.list({
    category_id: categoryId,
    limit: 24,
    fields: "*variants.calculated_price",
  });

  return response;
};

const CategoryPage = async ({ params }: { params: Params }) => {
  const { category } = await params;

  // fetch data for category
  const response = await medusa.store.category.list({
    handle: category,
    limit: 1,
  });

  const categoryId = response.product_categories[0].id;

  // fetch initial products for category
  const data = await getInitialData(categoryId);

  // get filter options and tag counts
  const filterOptions = FILTERS[category as keyof typeof FILTERS] || undefined;
  const tagCounts = filterOptions
    ? await getTagCount({ options: filterOptions, categoryId })
    : undefined;

  const jsonLd = constructCategoryPageJsonLd({
    products: data.products,
    name: response.product_categories[0].name,
    description:
      response.product_categories[0].description ||
      `Shop the ${response.product_categories[0].name} collection.`,
    url: `https://pryzma.io/collections/${response.product_categories[0].handle}`,
    image: await getThumbnail(categoryId),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-[calc(100vh-330.5px)]">
        <section aria-label="Collection header">
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
                  categoryHandle={category}
                  isCollection
                />
              }
            >
              <ProductGridShell
                initialData={data.products}
                initialCount={data.count}
                filterOptions={filterOptions}
                filterCounts={tagCounts}
                categoryId={categoryId}
                categoryHandle={category}
                isCollection
                name={response.product_categories[0].name}
                quickAdd={response.product_categories[0].handle === "samples"}
              />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
};

export default CategoryPage;
