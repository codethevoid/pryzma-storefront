import { CATEGORY_DATA } from "@/lib/category-data";
import { medusa } from "@/utils/medusa";
import { getTagCount } from "@/lib/helpers/get-tag-count";
import { constructCategoryPageJsonLd } from "@/utils/construct-jsonld";
import { CategoryHeader } from "@/components/ui/category-header";
import { ProductGridFallback } from "@/components/ui/product-grid-fallback";
import { ProductGridShell } from "@/components/layout/product-grid-shell";
import { Suspense } from "react";
import { constructMetadata } from "@/utils/metadata";

export const dynamicParams = false;
type Params = Promise<{ handle: string }>;

export const generateStaticParams = async () => {
  const response = await medusa.store.category.list();
  return response.product_categories.map((category) => ({ handle: category.handle }));
};

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { handle } = await params;
  const response = await medusa.store.category.list({
    handle,
    limit: 1,
  });

  const data = CATEGORY_DATA[handle];
  return constructMetadata(
    data?.meta || { title: `${response.product_categories[0].name} - Pryzma` },
  );
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
  const { handle } = await params;

  // fetch data for category
  const response = await medusa.store.category.list({
    handle,
    limit: 1,
  });

  const categoryId = response.product_categories[0].id;

  // fetch initial products for category
  const data = await getInitialData(categoryId);
  console.log(data);

  // get filter options and tag counts
  const filterOptions = CATEGORY_DATA[handle]?.filters || undefined;
  const tagCounts = filterOptions
    ? await getTagCount({ options: filterOptions, categoryId })
    : undefined;

  const jsonLd = constructCategoryPageJsonLd({
    products: data.products,
    name: response.product_categories[0].name,
    description: CATEGORY_DATA[handle]?.description || "",
    url: `https://pryzma.io/collections/${response.product_categories[0].handle}`,
    image: CATEGORY_DATA[handle]?.meta.image || "",
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
            description={CATEGORY_DATA[handle]?.description || ""}
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
                isCollection
                name={response.product_categories[0].name}
                quickAdd={CATEGORY_DATA[handle]?.quickAdd || false}
              />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
};

export default CategoryPage;
