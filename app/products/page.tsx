import { CategoryHeader } from "@/components/ui/category-header";
import { medusa } from "@/utils/medusa";
import { StoreProduct } from "@medusajs/types";
import { ProductGridShell } from "@/components/layout/product-grid-shell";
import { PRODUCT_FILTER_OPTIONS } from "@/lib/filter-options";
import { getTagCount } from "@/lib/helpers/get-tag-count";
import { CATEGORY_IDS } from "@/lib/identifiers";
import { constructMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import { ProductGridFallback } from "@/components/ui/product-grid-fallback";
import { constructCategoryPageJsonLd } from "@/utils/construct-jsonld";
import { cdnUrl } from "@/utils/s3";

export const metadata = constructMetadata({
  title: "Products - Pryzma",
  description: "Shop our collection of keyboard switches, lubricants, and accessories.",
});

const getProducts = async (): Promise<{ products: StoreProduct[]; count: number }> => {
  const response = await medusa.store.product.list({
    limit: 24,
    fields: "*variants.calculated_price",
    category_id: [CATEGORY_IDS.SWITCHES, CATEGORY_IDS.LUBRICANTS, CATEGORY_IDS.ACCESSORIES], // omit samples
  });

  return response;
};

const Products = async () => {
  const [data, tagCounts] = await Promise.all([
    getProducts(),
    getTagCount({
      options: PRODUCT_FILTER_OPTIONS,
      categoryId: [CATEGORY_IDS.SWITCHES, CATEGORY_IDS.LUBRICANTS, CATEGORY_IDS.ACCESSORIES], // omit samples
    }),
  ]);

  const jsonLd = constructCategoryPageJsonLd({
    products: data.products,
    name: "Products",
    description: metadata.description as string,
    url: "https://pryzma.io/products",
    image: `${cdnUrl}/uploads/IMG_3607-01JMG08DXZ1EH8C6PCECABGKCK.JPG`,
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
            title="Products"
            count={data.count}
            description="Browse switches, lubricants and accessories."
          />
        </section>
        <section aria-label="Product grid" className="p-4 pb-12">
          <div className="mx-auto max-w-screen-xl">
            <Suspense
              fallback={
                <ProductGridFallback
                  initialData={data.products}
                  filterCounts={tagCounts}
                  filterOptions={PRODUCT_FILTER_OPTIONS}
                  name={undefined}
                />
              }
            >
              <ProductGridShell
                initialData={data.products}
                initialCount={data.count}
                filterOptions={PRODUCT_FILTER_OPTIONS}
                filterCounts={tagCounts}
                categoryId={[
                  CATEGORY_IDS.SWITCHES,
                  CATEGORY_IDS.LUBRICANTS,
                  CATEGORY_IDS.ACCESSORIES,
                ]}
              />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
};

export default Products;
