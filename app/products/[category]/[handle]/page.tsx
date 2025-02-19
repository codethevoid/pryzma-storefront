import { medusa } from "@/utils/medusa";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductShell } from "@/components/layout/product-shell";
import { Metadata } from "next";
import { Carousel } from "@/components/ui/carousel";
import { constructMetadata } from "@/utils/metadata";
import { shuffle } from "@/lib/helpers/shuffle";

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

  return constructMetadata({
    title: `${product.title} - Pryzma`,
    description:
      product.type?.value === "sample"
        ? product.title
        : ((product.description?.split("\n")[0] || "") as string),
    image: product.thumbnail ? product.thumbnail : product.images?.[0]?.url,
  });
};

const ProductPage = async ({ params }: { params: Params }) => {
  const { handle } = await params;

  const data = await medusa.store.product.list({
    handle,
    limit: 1,
    fields: "*variants.calculated_price,+variants.inventory_quantity",
  });

  const relatedProducts = await medusa.store.product.list({
    limit: 100,
    fields: "*variants.calculated_price,+variants.inventory_quantity",
    type_id: data.products[0].type?.id,
  });

  const shuffledRelatedProducts = shuffle(
    relatedProducts.products.filter((p) => p.id !== data.products[0].id),
  ).slice(0, 10);

  return (
    <div className="min-h-[calc(100vh-330.5px)] p-4 pb-12">
      <div className="mx-auto max-w-screen-xl space-y-4">
        <Breadcrumbs product={data.products[0]} />
        <div className="space-y-16">
          <ProductShell product={data.products[0]} />
          <Carousel title="You may also like" data={shuffledRelatedProducts} className="px-0" />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
