"use client";

import { shippingOptions } from "@/lib/shipping-options";
import { loadStripe, StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import { ExtendedStoreCart, useCart } from "@/components/context/cart";
import { Elements, ExpressCheckoutElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { medusa } from "@/utils/medusa";
import { StoreCart } from "@medusajs/types";
import { useState } from "react";
import { toast } from "@medusajs/ui";
import { useRouter } from "next/navigation";

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
        amount: Math.round(cart.total * 100),
        currency: "usd",
      }}
    >
      <ExpressButtons />
    </Elements>
  );
};

const ExpressButtons = () => {
  const { cart, setCart, fields, refreshCart } = useCart();
  const elements = useElements();
  const stripe = useStripe();
  const router = useRouter();
  const [isInitial, setIsInitial] = useState(true);

  if (!cart) return <></>;

  const getAmount = (updatedCart: StoreCart) => {
    return Math.round(updatedCart.total * 100);
  };

  const getLineItems = (updatedCart: StoreCart) => {
    if (!updatedCart) return [];
    const subtotal = Math.round(updatedCart.original_item_subtotal * 100);
    const shipping = Math.round(updatedCart.original_shipping_subtotal * 100);
    const tax = Math.round(updatedCart.original_tax_total * 100);
    const discount = Math.round(updatedCart.discount_total * 100);
    return [
      { name: "Subtotal", amount: subtotal },
      { name: "Shipping", amount: shipping },
      ...(tax > 0 ? [{ name: "Taxes", amount: tax }] : []),
      ...(discount > 0 ? [{ name: "Discount", amount: -discount }] : []),
    ];
  };

  const updateShippingMethod = async (shippingMethodId: string): Promise<ExtendedStoreCart> => {
    const response = await medusa.store.cart.addShippingMethod(
      cart.id,
      { option_id: shippingMethodId },
      { fields },
    );
    setCart(response.cart as ExtendedStoreCart);
    return response.cart as ExtendedStoreCart;
  };

  const getPaymentDetails = async (updatedCart: StoreCart) => {
    const response = await medusa.store.payment.initiatePaymentSession(updatedCart, {
      provider_id: "pp_stripe_stripe",
    });

    const clientSecret = response.payment_collection.payment_sessions?.[0]?.data
      ?.client_secret as string;
    const paymentIntentId = response.payment_collection.payment_sessions?.[0]?.data?.id as string;

    return { clientSecret, paymentIntentId };
  };

  const getConfirmToken = async (paymentIntentId: string, cartId: string) => {
    const response = await fetch("/api/checkout/token", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId, cartId }),
    });

    if (!response.ok) return null;
    const { token } = await response.json();
    return token;
  };

  const onConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    const { shippingAddress, billingDetails, paymentFailed } = event;
    if (!stripe || !elements || !cart) {
      return paymentFailed({ reason: "fail" });
    }

    // if no shipping address or billing details
    if (!shippingAddress || !billingDetails) {
      return paymentFailed({ reason: "fail" });
    }

    // if shipping is not the United States
    if (shippingAddress.address.country.toLowerCase() !== "us") {
      return paymentFailed({ reason: "invalid_shipping_address" });
    }
    console.log(event);

    // update address and billing details on medusa cart
    const updatedCart = await medusa.store.cart.update(cart.id, {
      ...(billingDetails.email && { email: billingDetails.email }),
      billing_address: {
        ...(billingDetails.phone && { phone: billingDetails.phone }),
        first_name: billingDetails.name.split(" ")[0],
        ...(billingDetails.name.split(" ").length > 1 && {
          last_name: billingDetails.name.split(" ")[1],
        }),
        address_1: billingDetails.address.line1,
        ...(billingDetails.address.line2 && { address_2: billingDetails.address.line2 }),
        city: billingDetails.address.city,
        province: billingDetails.address.state,
        postal_code: billingDetails.address.postal_code,
        country_code: "us",
      },
      shipping_address: {
        ...(billingDetails.phone && { phone: billingDetails.phone }),
        first_name: shippingAddress.name.split(" ")[0],
        ...(shippingAddress.name.split(" ").length > 1 && {
          last_name: shippingAddress.name.split(" ")[1],
        }),
        address_1: shippingAddress.address.line1,
        ...(shippingAddress.address.line2 && { address_2: shippingAddress.address.line2 }),
        city: shippingAddress.address.city,
        province: shippingAddress.address.state,
        postal_code: shippingAddress.address.postal_code,
        country_code: "us",
      },
    });

    console.log(updatedCart);
    if (!updatedCart?.cart) return paymentFailed({ reason: "fail" });

    // initialize a payment with medusa
    const { clientSecret, paymentIntentId } = await getPaymentDetails(updatedCart.cart);

    if (!clientSecret || !paymentIntentId) {
      console.log("Failed to initialize payment");
      return paymentFailed({ reason: "fail" });
    }

    // generate confirm token
    const token = await getConfirmToken(paymentIntentId, cart.id);
    if (!token) {
      return paymentFailed({ reason: "fail" });
    }

    // capture payment with stripe
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `https://pryzma.io/checkout/process?token=${token}`,
      },
      redirect: "if_required",
    });

    if (error) {
      return toast.error(error.message || "Failed to process payment");
    }

    try {
      await fetch("/api/checkout/token/revoke", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
    } catch {}

    // complete order in medusa
    const completed = await medusa.store.cart.complete(updatedCart.cart.id);
    if (completed.type === "order" && completed.order) {
      const { order } = completed;
      router.push(`/orders/${order.id}`);
      refreshCart();
    } else if (completed.type === "cart") {
      toast.error(completed.error.message || "Failed to complete order");
    }

    return toast.error("Failed to complete order");
  };

  return (
    <ExpressCheckoutElement
      onConfirm={onConfirm}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options={{ ...expressOptions }}
      onShippingAddressChange={async ({ resolve, address }) => {
        console.log("Shipping address changed");
        const response = await medusa.store.cart.update(cart.id, {
          shipping_address: {
            city: address.city,
            province: address.state,
            postal_code: address.postal_code,
            country_code: "us",
          },
        });

        let updatedCart = response.cart;
        if (isInitial) {
          console.log("Initial checkout");
          updatedCart = await updateShippingMethod(shippingOptions[0].id);
          setIsInitial(false);
        }

        elements?.update({ amount: getAmount(updatedCart), currency: "usd" });
        resolve({ lineItems: getLineItems(updatedCart) });
      }}
      onShippingRateChange={async ({ resolve, shippingRate }) => {
        const updatedCart = await updateShippingMethod(shippingRate.id);
        elements?.update({ amount: getAmount(updatedCart), currency: "usd" });
        resolve({ lineItems: getLineItems(updatedCart) });
      }}
      onCancel={() => {
        elements?.update({ amount: Math.round(cart.total * 100), currency: "usd" });
        setIsInitial(true);
      }}
    />
  );
};
