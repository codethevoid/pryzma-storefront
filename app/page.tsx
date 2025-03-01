import { Hero } from "@/components/landing/hero";
import { Featured } from "@/components/landing/featured";
import { Spotlight } from "@/components/ui/spotlight";
import { cdnUrl } from "@/utils/s3";
import { Carousel } from "@/components/ui/carousel";
import { StoreProduct } from "@medusajs/types";
import { medusa } from "@/utils/medusa";
import { constructMetadata } from "@/utils/metadata";
// import { homePageJsonLd } from "@/utils/construct-jsonld";
import { Button } from "@medusajs/ui";
import NextLink from "next/link";

export const metadata = constructMetadata({});

const getProducts = async ({
  handle,
  limit = 10,
}: {
  handle: string | string[];
  limit?: number;
}): Promise<StoreProduct[]> => {
  const ids: string[] = [];
  if (typeof handle === "string") {
    const categoryResponse = await medusa.store.category.list({
      handle,
      limit: 1,
    });
    ids.push(categoryResponse.product_categories[0].id);
  } else {
    for (const i of handle) {
      const categoryResponse = await medusa.store.category.list({
        handle: i,
        limit: 1,
      });
      ids.push(categoryResponse.product_categories[0].id);
    }
  }
  const response = await medusa.store.product.list({
    limit,
    fields: "*variants.calculated_price",
    category_id: ids,
  });

  return response.products || [];
};

const Home = async () => {
  const [bestSellers, switches, accessories] = await Promise.all([
    getProducts({ handle: "best-sellers" }),
    getProducts({ handle: "switches" }),
    getProducts({ handle: ["lubricants", "accessories"] }),
  ]);

  return (
    <>
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      /> */}
      <main className="space-y-12 pb-20 max-md:space-y-8">
        <section aria-label="Hero">
          <Hero
            image={`${cdnUrl}/uploads/gateron-melodic-clicky-switches-01JN6B3VJQAE2DSXBW3VD27P3S.webp`}
            title="Gateron Melodic"
            description="Clicky switches with a unique sound"
            href="/products/switches/gateron-melodic-switches"
          />
        </section>

        <section aria-label="Featured products">
          <Featured />
        </section>

        <section aria-label="Best sellers">
          <Carousel data={bestSellers} title="Best sellers" />
        </section>

        <section aria-label="Custom switch sampler spotlight">
          <Spotlight
            title="Custom Switch Sampler"
            description="Build your own switch sampler"
            href="/products/samples"
            image={`${cdnUrl}/featured/IMG_2855.webp`}
            actionText="Start building"
          />
        </section>

        <section aria-label="Switches">
          <Carousel
            data={switches}
            title="Switches"
            description="Mechanical keyboard switches come in a variety of styles to match your typing preferences. We offer linear, tactile, clicky, and silent switches."
            action={
              <Button variant="secondary" size="small" asChild>
                <NextLink href="/products/switches">Shop switches</NextLink>
              </Button>
            }
          />
        </section>

        <section aria-label="Accessories">
          <Carousel
            data={accessories}
            title="Accessories"
            description="We offer a wide range of accessories to enhance your mechanical keyboard experience. Shop for lubricants, tools, stabilizers, and more."
            action={
              <Button variant="secondary" size="small" asChild>
                <NextLink href="/products/accessories">Shop accessories</NextLink>
              </Button>
            }
          />
        </section>

        <section aria-label="Featured switch spotlight">
          <Spotlight
            title="KTT Strawberry v2 switches"
            description="Linear switches inspired by strawberries"
            href="/products/switches/ktt-strawberry-v2-switches"
            image={`${cdnUrl}/uploads/IMG_3405-01JMQZ73D13NYF9FMMXCD9WWMM.webp`}
          />
        </section>
      </main>
    </>
  );
};

export default Home;
