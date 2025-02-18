import { CheckoutClient } from "./client";
import { constructMetadata } from "@/utils/metadata";

export const metadata = constructMetadata({
  title: "Checkout - Pryzma",
});

const Checkout = () => {
  return (
    <div className="px-4 max-md:px-0">
      <div className="mx-auto max-w-screen-xl">
        <CheckoutClient />
      </div>
    </div>
  );
};

export default Checkout;
