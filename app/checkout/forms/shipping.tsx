"use client";

import { shippingOptions } from "@/lib/shipping-options";
import { Text, RadioGroup, Button } from "@medusajs/ui";
import { ExtendedStoreCart, useCart } from "@/components/context/cart";
import { useEffect } from "react";
import { medusa } from "@/utils/medusa";
import { useState } from "react";
import { formatCurrency } from "@/utils/format-currency";

export const ShippingForm = ({
  setStep,
}: {
  setStep: (step: "general" | "shipping" | "payment") => void;
}) => {
  const { cart, setCart, fields, isLoadingShipping, setIsLoadingShipping } = useCart();
  const [shippingMethod, setShippingMethod] = useState<string | null>();

  useEffect(() => {
    if (!cart) return;
    setShippingMethod(cart.shipping_methods?.[0]?.shipping_option_id as string);
  }, [cart]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Text weight="plus">Shipping method</Text>
        <RadioGroup
          value={shippingMethod || ""}
          onValueChange={async (value) => {
            if (!cart) return;
            setIsLoadingShipping(true);
            setShippingMethod(value);
            if (value === cart.shipping_methods?.[0]?.shipping_option_id) return;
            const response = await medusa.store.cart.addShippingMethod(
              cart.id,
              { option_id: value },
              { fields },
            );

            setCart(response.cart as ExtendedStoreCart);
            setIsLoadingShipping(false);
          }}
        >
          {shippingOptions.map((option) => (
            <div className="relative w-full" key={option.id}>
              <RadioGroup.ChoiceBox
                label={option.name}
                value={option.id}
                description={option.description}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50"
              ></RadioGroup.ChoiceBox>
              <div className="absolute right-3 top-3">
                <Text size="small" className="text-subtle-foreground">
                  {formatCurrency("usd", option.amount)}
                </Text>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
      <Button
        onClick={() => {
          setStep("payment");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={!cart?.shipping_methods?.length}
        isLoading={isLoadingShipping}
      >
        Continue to payment
      </Button>
    </div>
  );
};
