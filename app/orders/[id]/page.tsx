import { OrderClient } from "./client";
import { constructMetadata } from "@/utils/metadata";

export const metadata = constructMetadata({
  title: "Order Overview - Pryzma",
});

type Params = Promise<{ id: string }>;

const OrderPage = async ({ params }: { params: Params }) => {
  const { id } = await params;

  return (
    <div className="px-4 max-md:px-0">
      <OrderClient id={id} />
    </div>
  );
};

export default OrderPage;
