import { Hero } from "@/components/landing/hero";
import { Featured } from "@/components/landing/featured";
import { Spotlight } from "@/components/ui/spotlight";
import { s3Url } from "@/utils/s3";
import { Carousel } from "@/components/ui/carousel";
import { StoreProduct } from "@medusajs/types";
import { medusa } from "@/utils/medusa";

const getProducts = async ({
  collectionId,
  categoryId,
}: {
  collectionId?: string;
  categoryId?: string;
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
  const [bestSellers, switches, lubricants, accessories] = await Promise.all([
    getProducts({ collectionId: "pcol_01JK5Y4111NV85V26H8Y90DKNT" }),
    getProducts({ categoryId: "pcat_01JK430HFRRN0GTZMP9Z38AND6" }),
    getProducts({ categoryId: "pcat_01JK431P8FYJ5K3VQ4YP970BAA" }),
    getProducts({ categoryId: "pcat_01JK432BYM1VEPYK9TTPGXQ8FE" }),
  ]);

  return (
    <div className="space-y-16 pb-20">
      <Hero />
      <Featured />
      <Carousel data={bestSellers} title="Best sellers" />
      <Spotlight
        title="Custom Switch Sampler"
        description="Build your own switch sampler"
        href="/products/switch-sampler"
        image={`${s3Url}/featured/IMG_2855.JPG`}
        actionText="Start building"
      />
      <Carousel data={switches} title="Switches" />
      <Carousel data={lubricants} title="Lubricants" />
      <Carousel data={accessories} title="Accessories" />
      <Spotlight
        title="KTT Strawberry v2 switches"
        description="Linear switches inspired by strawberries"
        href="/products/ktt-strawberry-v2-switches"
        image={`${s3Url}/featured/IMG_3405.JPG`}
      />
    </div>
  );
};

export default Home;
