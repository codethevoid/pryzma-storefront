import { OrderClient } from "./client";
import { constructMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import { Loader } from "@medusajs/icons";

export const metadata = constructMetadata({
  title: "Order Overview - Pryzma",
});

type Params = Promise<{ id: string }>;

const OrderPage = async ({ params }: { params: Params }) => {
  const { id } = await params;

  return (
    <div className="px-4 max-md:px-0">
      <Suspense
        fallback={
          <div className="flex h-[calc(100vh-330.5px)] min-h-[250px] items-center justify-center">
            <Loader className="animate-spin" />
          </div>
        }
      >
        <OrderClient id={id} />
      </Suspense>
    </div>
  );
};

export default OrderPage;
