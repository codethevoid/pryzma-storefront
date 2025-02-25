import { CategoryHeader } from "@/components/ui/category-header";
import { medusa } from "@/utils/medusa";
import { ProductGridShell } from "@/components/layout/product-grid-shell";
import { PRODUCT_FILTER_OPTIONS } from "@/lib/filter-options";
import { getTagCount } from "@/lib/helpers/get-tag-count";
import { constructMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import { ProductGridFallback } from "@/components/ui/product-grid-fallback";
import { constructCategoryPageJsonLd } from "@/utils/construct-jsonld";
import { cdnUrl } from "@/utils/s3";

export const metadata = constructMetadata({
  title: "Products - Pryzma",
  description: "Shop our collection of keyboard switches, lubricants, and accessories.",
});

const getProducts = async () => {
  const categories = await medusa.store.category.list({});
  const ids = categories.product_categories
    .filter((cat) => !cat.parent_category_id && cat.handle !== "samples")
    .map((category) => category.id);
  const products = await medusa.store.product.list({
    category_id: ids,
    limit: 24,
    fields: "*variants.calculated_price",
  });

  return { products, ids };
};

const Products = async () => {
  const [data, tagCounts] = await Promise.all([
    getProducts(),
    getTagCount({
      options: PRODUCT_FILTER_OPTIONS,
      handle: ["switches", "lubricants", "accessories"],
    }),
  ]);

  const jsonLd = constructCategoryPageJsonLd({
    products: data.products.products,
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
            count={data.products.count}
            description="Browse switches, lubricants and accessories."
          />
        </section>
        <section aria-label="Product grid" className="p-4 pb-12">
          <div className="mx-auto max-w-screen-xl">
            <Suspense
              fallback={
                <ProductGridFallback
                  initialData={data.products.products}
                  filterCounts={tagCounts}
                  filterOptions={PRODUCT_FILTER_OPTIONS}
                  name={undefined}
                />
              }
            >
              <ProductGridShell
                initialData={data.products.products}
                initialCount={data.products.count}
                filterOptions={PRODUCT_FILTER_OPTIONS}
                filterCounts={tagCounts}
                categoryId={data.ids}
              />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
};

export default Products;
