"use client";

import { useCart } from "@/components/context/cart";
import { IconBadge, Text } from "@medusajs/ui";
import { Envelope, MapPin, FlyingBox } from "@medusajs/icons";
import { formatCurrency } from "@/utils/format-currency";

type Props = {
  setStep: (step: "general" | "shipping" | "payment") => void;
  step: "general" | "shipping" | "payment";
};

export const CheckoutDetails = ({ setStep, step }: Props) => {
  const { cart } = useCart();
  return (
    <div className="w-full rounded-md bg-zinc-50 shadow-borders-base dark:bg-zinc-900/50">
      <div className="flex justify-between border-b px-4 py-2.5">
        <div className="flex items-start gap-6">
          <div className="flex w-20 shrink-0 items-center gap-2 max-md:w-16">
            <IconBadge className="max-md:hidden">
              <Envelope />
            </IconBadge>
            <Text weight="plus" size="small" className="max-md:relative max-md:top-[3px]">
              Contact
            </Text>
          </div>

          <Text size="xsmall" className="mt-1 text-subtle-foreground">
            {cart?.email}
          </Text>
        </div>
        <Text
          size="xsmall"
          className="ml-2 mt-1 shrink-0 cursor-pointer text-blue-500 hover:underline dark:text-blue-400"
          onClick={() => setStep("general")}
        >
          Edit
        </Text>
      </div>
      <div className="flex justify-between px-4 py-2.5">
        <div className="flex items-start gap-6">
          <div className="flex w-20 shrink-0 items-center gap-2 max-md:w-16">
            <IconBadge className="max-md:hidden">
              <MapPin />
            </IconBadge>
            <Text weight="plus" size="small" className="max-md:relative max-md:top-[3px]">
              Ship to
            </Text>
          </div>

          <Text size="xsmall" className="mt-1 text-subtle-foreground">
            {cart?.shipping_address?.address_1}
            {cart?.shipping_address?.address_2 ? `, ${cart?.shipping_address?.address_2}` : ""}
            {`, ${cart?.shipping_address?.city}`}, {cart?.shipping_address?.province}{" "}
            {/* {
              usStates.find((state) => state.abbreviation === cart?.shipping_address?.province)
                ?.name
            }{" "} */}
            {cart?.shipping_address?.postal_code}, USA
          </Text>
        </div>

        <Text
          size="xsmall"
          className="ml-2 mt-1 shrink-0 cursor-pointer text-blue-500 hover:underline dark:text-blue-400"
          onClick={() => setStep("general")}
        >
          Edit
        </Text>
      </div>
      {(cart?.shipping_methods?.length || 0) > 0 && step === "payment" && (
        <div className="flex justify-between border-t px-4 py-2.5">
          <div className="flex items-start gap-6">
            <div className="flex w-20 shrink-0 items-center gap-2 max-md:w-16">
              <IconBadge className="shrink-0 max-md:hidden">
                <FlyingBox />
              </IconBadge>
              <Text weight="plus" size="small" className="max-md:relative max-md:top-[3px]">
                Shipping
              </Text>
            </div>

            <Text size="xsmall" className="mt-1 text-subtle-foreground">
              {cart?.shipping_methods?.[0]?.name} -{" "}
              <Text as="span" size="xsmall" className="text-foreground">
                {formatCurrency("usd", cart?.shipping_methods?.[0]?.amount as number)}
              </Text>
            </Text>
          </div>

          {step === "payment" && (
            <Text
              size="xsmall"
              className="ml-2 mt-1 shrink-0 cursor-pointer text-blue-500 hover:underline dark:text-blue-400"
              onClick={() => setStep("shipping")}
            >
              Edit
            </Text>
          )}
        </div>
      )}
    </div>
  );
};
