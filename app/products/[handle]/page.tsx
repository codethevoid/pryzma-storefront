import { medusa } from "@/utils/medusa";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductShell } from "@/components/layout/product-shell";
import { Metadata } from "next";

export const dynamicParams = false;
type Params = Promise<{ handle: string }>;

export const generateStaticParams = async () => {
  const response = await medusa.store.product.list({ limit: 100 });
  return response.products.map((product) => ({ handle: product.handle }));
};

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { handle } = await params;
  const response = await medusa.store.product.list({
    handle,
    limit: 1,
  });

  const product = response.products[0];

  return {
    title: `${product.title} - Pryzma`,
    description: product.description,
  };
};

const ProductPage = async ({ params }: { params: Params }) => {
  const { handle } = await params;

  const data = await medusa.store.product.list({
    handle,
    limit: 1,
    fields: "*variants.calculated_price,+variants.inventory_quantity",
  });

  const product = data.products[0];

  return (
    <div className="p-4">
      <div className="mx-auto max-w-screen-xl space-y-4">
        <Breadcrumbs product={product} />
        <ProductShell product={product} />
      </div>
    </div>
  );
};

export default ProductPage;
