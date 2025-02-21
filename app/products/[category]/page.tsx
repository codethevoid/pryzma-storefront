import { CategoryHeader } from "@/components/ui/category-header";
import { medusa } from "@/utils/medusa";
import { StoreProduct } from "@medusajs/types";
import { ProductGridShell } from "@/components/layout/product-grid-shell";
import { getTagCount } from "@/lib/helpers/get-tag-count";
import { constructMetadata } from "@/utils/metadata";
import { Metadata } from "next";
import { CATEGORY_DATA } from "@/lib/category-data";
import { Suspense } from "react";
import { ProductGridFallback } from "@/components/ui/product-grid-fallback";

export const dynamicParams = false;
type Params = Promise<{ category: keyof typeof CATEGORY_DATA }>; // category is the handle

export const generateStaticParams = async () => {
  const response = await medusa.store.category.list();
  return response.product_categories.map((category) => ({ category: category.handle }));
};

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { category } = await params;
  const categoryData = CATEGORY_DATA[category];
  return constructMetadata(categoryData.meta);
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

const CategoryPage = async ({ params }: { params: Params }) => {
  const { category } = await params;
  const categoryData = CATEGORY_DATA[category];

  // fetch data for category
  const response = await medusa.store.category.list({
    handle: category,
    limit: 1,
  });
  const categoryId = response.product_categories[0].id;

  // fetch initial products for category
  const data = await getInitialData(categoryId);

  // fetch filter options and tag counts
  const filterOptions = categoryData.filters || undefined;
  const tagCounts = filterOptions
    ? await getTagCount({ options: filterOptions, categoryId })
    : undefined;

  return (
    <div className="min-h-[calc(100vh-330.5px)]">
      <CategoryHeader
        title={response.product_categories[0].name}
        count={data.count}
        description={categoryData.description}
      />
      <div className="p-4 pb-12">
        <div className="mx-auto max-w-screen-xl">
          <Suspense
            fallback={
              <ProductGridFallback
                initialData={data.products}
                filterCounts={tagCounts}
                filterOptions={filterOptions}
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
              quickAdd={categoryData.quickAdd}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
