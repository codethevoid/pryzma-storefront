import { Hero } from "@/components/landing/hero";
import { Featured } from "@/components/landing/featured";
import { Spotlight } from "@/components/ui/spotlight";
import { cdnUrl } from "@/utils/s3";
import { Carousel } from "@/components/ui/carousel";
import { StoreProduct } from "@medusajs/types";
import { medusa } from "@/utils/medusa";
import { COLLECTION_IDS, CATEGORY_IDS } from "@/lib/identifiers";
import { constructMetadata } from "@/utils/metadata";
import { homePageJsonLd } from "@/utils/construct-jsonld";

export const metadata = constructMetadata({});

const getProducts = async ({
  collectionId,
  categoryId,
}: {
  collectionId?: string;
  categoryId?: string | string[];
}): Promise<StoreProduct[]> => {
  const response = await medusa.store.product.list({
    limit: 10,
    fields: "*variants.calculated_price",
    ...(collectionId && { collection_id: collectionId }),
    ...(categoryId && { category_id: categoryId }),
  });

  return response.products || [];
};

const Home = async () => {
  const [bestSellers, switches, accessories] = await Promise.all([
    getProducts({ collectionId: COLLECTION_IDS.BEST_SELLERS }),
    getProducts({ categoryId: CATEGORY_IDS.SWITCHES }),
    // getProducts({ categoryId: CATEGORY_IDS.LUBRICANTS }),
    getProducts({ categoryId: [CATEGORY_IDS.LUBRICANTS, CATEGORY_IDS.ACCESSORIES] }),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />
      <main className="space-y-16 pb-20 max-md:space-y-8">
        <section aria-label="Hero">
          <Hero />
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
            image={`${cdnUrl}/featured/sampler.webp`}
            actionText="Start building"
          />
        </section>

        <section aria-label="Switches">
          <Carousel data={switches} title="Switches" />
        </section>

        <section aria-label="Accessories">
          <Carousel data={accessories} title="Accessories" />
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
