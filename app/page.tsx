import { Hero } from "@/components/landing/hero";
import { Featured } from "@/components/landing/featured";
import { Spotlight } from "@/components/ui/spotlight";
import { cdnUrl } from "@/utils/s3";
import { Carousel } from "@/components/ui/carousel";
import { StoreProduct } from "@medusajs/types";
import { medusa } from "@/utils/medusa";
import { COLLECTION_IDS, CATEGORY_IDS } from "@/lib/identifiers";
import { constructMetadata } from "@/utils/metadata";

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
    <div className="space-y-16 pb-20">
      <Hero />
      <Featured />
      <Carousel data={bestSellers} title="Best sellers" />
      <Spotlight
        title="Custom Switch Sampler"
        description="Build your own switch sampler"
        href="/products/samples"
        image={`${cdnUrl}/featured/IMG_2855.JPG`}
        actionText="Start building"
      />
      <Carousel data={switches} title="Switches" />
      {/* <Carousel data={lubricants} title="Lubricants" /> */}
      <Carousel data={accessories} title="Accessories" />
      <Spotlight
        title="KTT Strawberry v2 switches"
        description="Linear switches inspired by strawberries"
        href="/products/switches/ktt-strawberry-v2-switches"
        image={`${cdnUrl}/featured/IMG_3405.JPG`}
      />
    </div>
  );
};

export default Home;
