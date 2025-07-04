import { CheckoutClient } from "./client";
import { constructMetadata } from "@/utils/metadata";
import Script from "next/script";

export const metadata = constructMetadata({
  title: "Checkout - Pryzma",
});

const Checkout = async () => {
  return (
    <>
      <Script
        id="google-places-api"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initGooglePlaces`}
      />
      <div className="overflow-x-hidden lg:px-4">
        <div className="">
          <CheckoutClient />
        </div>
      </div>
    </>
  );
};

export default Checkout;
