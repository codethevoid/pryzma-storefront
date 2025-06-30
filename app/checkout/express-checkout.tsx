"use client";

import { OurShippingOption, shippingOptions } from "@/lib/shipping-options";
import { loadStripe, StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import { useCart } from "@/components/context/cart";
import { Elements, ExpressCheckoutElement, useElements } from "@stripe/react-stripe-js";
import { medusa } from "@/utils/medusa";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

const expressOptions = {
  emailRequired: true,
  shippingAddressRequired: true,
  billingAddressRequired: true,
  allowedShippingCountries: ["US"],
  shippingRates: [
    {
      id: shippingOptions[0].id,
      displayName: shippingOptions[0].name,
      amount: shippingOptions[0].amount * 100, // Stripe expects amounts in cents
      deliveryEstimate: {
        minimum: { unit: "day", value: 2 },
        maximum: { unit: "day", value: 5 },
      },
    },
    {
      id: shippingOptions[1].id,
      displayName: shippingOptions[1].name,
      amount: shippingOptions[1].amount * 100, // Stripe expects amounts in cents
      deliveryEstimate: {
        minimum: { unit: "day", value: 1 },
        maximum: { unit: "day", value: 3 },
      },
    },
  ],
};

export const ExpressCheckout = () => {
  const { cart } = useCart();

  if (!cart) {
    return <div className="h-8 w-full animate-pulse rounded-md bg-zinc-500/15" />;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: (cart.item_subtotal + shippingOptions[0].amount) * 100,
        currency: "usd",
      }}
    >
      <ExpressButtons />
    </Elements>
  );
};

const ExpressButtons = () => {
  const { cart } = useCart();
  const elements = useElements();
  const [selectedShippingOption, setSelectedShippingOption] = useState<OurShippingOption>(
    shippingOptions[0],
  );

  if (!cart) return <></>;

  const onConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    console.log(event);
  };

  return (
    <ExpressCheckoutElement
      onConfirm={onConfirm}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options={expressOptions}
      onShippingAddressChange={async ({ resolve, address }) => {
        // update the cart with the new shipping address so we can calculate tax
        const response = await medusa.store.cart.update(cart.id, {
          shipping_address: {
            city: address.city,
            province: address.state,
            postal_code: address.postal_code,
            country_code: "us",
          },
        });
        const amount =
          Math.round(selectedShippingOption.amount * 100) +
          Math.round(response.cart.item_subtotal * 100) +
          Math.round(response.cart.tax_total * 100);
        console.log("New amount:", amount);
        elements?.update({
          amount,
          currency: "usd",
        });
        resolve({});
      }}
      onShippingRateChange={async ({ resolve, shippingRate }) => {
        elements?.update({
          amount: Number(shippingRate.amount) + Math.round(cart?.item_subtotal * 100),
          currency: "usd",
        });
        setSelectedShippingOption(
          shippingOptions.find((option) => option.id === shippingRate.id) as OurShippingOption,
        );
        resolve({});
      }}
      onCancel={() => {
        elements?.update({
          amount: cart.item_subtotal + Math.round(shippingOptions[0].amount) * 100,
          currency: "usd",
        });
        setSelectedShippingOption(shippingOptions[0]);
      }}
    />
  );
};
