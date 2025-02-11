import { CategoryHeader } from "@/components/ui/category-header";
import { medusa } from "@/utils/medusa";
import { StoreProduct } from "@medusajs/types";
import { ProductGridShell } from "@/components/layout/product-grid-shell";
import { SWITCH_FILTER_OPTIONS } from "@/utils/filter-options";

const categoryId = "pcat_01JK430HFRRN0GTZMP9Z38AND6";

const getTagCount = async () => {
  const tagIds = Object.values(SWITCH_FILTER_OPTIONS)
    .flat()
    .map((tag) => tag.value);

  const tagCounts = await Promise.all(
    tagIds.map(async (tagId) => {
      const response = await medusa.store.product.list({
        category_id: categoryId,
        tag_id: tagId,
        limit: 1,
      });

      return [tagId, response.count];
    }),
  );

  return Object.fromEntries(tagCounts);
};

const getSwitches = async (): Promise<{ products: StoreProduct[]; count: number }> => {
  const response = await medusa.store.product.list({
    category_id: categoryId,
    limit: 25,
    fields: "*variants.calculated_price",
  });

  return response;
};

const Switches = async () => {
  const [data, tagCounts] = await Promise.all([getSwitches(), getTagCount()]);

  return (
    <div>
      <CategoryHeader
        title="Switches"
        count={data.count}
        description={`Explore our collection of mechanical keyboard switches.`}
      />
      <div className="p-4">
        <div className="mx-auto max-w-screen-xl">
          <ProductGridShell
            initialData={data.products}
            initialCount={data.count}
            filterOptions={SWITCH_FILTER_OPTIONS}
            filterCounts={tagCounts}
            categoryId={categoryId}
            name="Switches"
          />
        </div>
      </div>
    </div>
  );
};

export default Switches;
