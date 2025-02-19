import { CategoryHeader } from "@/components/ui/category-header";
import { medusa } from "@/utils/medusa";
import { StoreProduct } from "@medusajs/types";
import { ProductGridShell } from "@/components/layout/product-grid-shell";
import { PRODUCT_FILTER_OPTIONS } from "@/lib/filter-options";
import { getTagCount } from "@/lib/helpers/get-tag-count";
import { CATEGORY_IDS } from "@/lib/identifiers";
import { constructMetadata } from "@/utils/metadata";

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

  return (
    <div>
      <CategoryHeader
        title="Products"
        count={data.count}
        description="Browse switches, lubricants and accessories."
      />
      <div className="p-4 pb-12">
        <div className="mx-auto max-w-screen-xl">
          <ProductGridShell
            initialData={data.products}
            initialCount={data.count}
            filterOptions={PRODUCT_FILTER_OPTIONS}
            filterCounts={tagCounts}
            categoryId={[CATEGORY_IDS.SWITCHES, CATEGORY_IDS.LUBRICANTS, CATEGORY_IDS.ACCESSORIES]}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
