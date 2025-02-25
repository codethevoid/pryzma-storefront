import { medusa } from "@/utils/medusa";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductShell } from "@/components/layout/product-shell";
import { Metadata } from "next";
import { Carousel } from "@/components/ui/carousel";
import { constructMetadata } from "@/utils/metadata";
import { shuffle } from "@/lib/helpers/shuffle";
import { cdnUrl, s3Url } from "@/utils/s3";
import { constructProductPageJsonLd } from "@/utils/construct-jsonld";
import { Button } from "@medusajs/ui";
import NextLink from "next/link";

export const dynamicParams = false;
type Params = Promise<{ category: string; handle: string }>;

export const generateStaticParams = async () => {
  const response = await medusa.store.product.list({ limit: 100 });
  return response.products.map((product) => ({
    category: product.collection?.handle,
    handle: product.handle,
  }));
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
    image: product.images?.[1]?.url || product.images?.[0]?.url,
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
    ...(data.products[0].type?.value !== "lubricant" &&
      data.products[0]?.type?.value !== "accessory" && {
        collection_id: data.products[0].collection?.id,
      }),
    ...((data.products[0]?.type?.value === "lubricant" ||
      data.products[0]?.type?.value === "accessory") && {
      collection_id: ["pcol_01JMXFFRX913AH8KQH9PF7K34P", "pcol_01JMXFGE959XSPYRAK22F987S4"], // lubricants and accessories, can eventually make this dynamic once we have more products in these collections
    }),
  });

  const shuffledRelatedProducts =
    data.products[0]?.type?.value === "lubricant"
      ? shuffle(relatedProducts.products.filter((p) => p.id !== data.products[0].id))
          .sort((a, b) => {
            if (a.type?.value === "lubricant" && b.type?.value !== "lubricant") return -1;
            if (a.type?.value !== "lubricant" && b.type?.value === "lubricant") return 1;
            return 0;
          })
          .slice(0, 10)
      : shuffle(relatedProducts.products.filter((p) => p.id !== data.products[0].id)).slice(0, 10);

  // replace all product images with cdn
  if (data.products[0]?.thumbnail) {
    data.products[0].thumbnail = data.products[0]?.thumbnail?.replace(s3Url, cdnUrl);
  }

  if (data.products[0]?.images) {
    data.products[0].images = data.products[0].images.map((image) => {
      const { url, ...rest } = image;
      return { ...rest, url: url.replace(s3Url, cdnUrl) };
    });
  }

  const jsonLD = constructProductPageJsonLd(data.products[0]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
      />
      <main className="min-h-[calc(100vh-330.5px)] p-4 pb-12">
        <div className="mx-auto max-w-screen-xl space-y-4">
          <Breadcrumbs product={data.products[0]} />
          <div className="space-y-16">
            <section aria-label="Product details">
              <ProductShell product={data.products[0]} />
            </section>

            <section aria-label="Related products">
              <Carousel
                title="You may also like"
                data={shuffledRelatedProducts}
                className="px-0"
                stack={false}
                action={
                  <Button size="small" asChild variant="secondary">
                    <NextLink href={`/products/${data.products[0].collection?.handle}`}>
                      All {data.products[0].collection?.title?.toLowerCase()}
                    </NextLink>
                  </Button>
                }
              />
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;
