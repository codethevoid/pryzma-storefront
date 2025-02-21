"use client";

import { useCart } from "@/components/context/cart";
import { clx, Input } from "@medusajs/ui";
import NextLink from "next/link";
import { Text, Button, Badge, ProgressTabs, toast, IconBadge } from "@medusajs/ui";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";
import { GeneralForm } from "./forms/general";
import { useState } from "react";
import { CheckoutDetails } from "./details";
import { ShippingForm } from "./forms/shipping";
import { medusa } from "@/utils/medusa";
import type { ExtendedStoreCart } from "@/components/context/cart";
import { XMark, Loader, ShoppingBag } from "@medusajs/icons";
import { PaymentForm } from "./forms/payment";
import { StoreCart } from "@medusajs/types";
import { SummaryAccordion } from "./summary-accordion";
import { cdnUrl, s3Url } from "@/utils/s3";

export const CheckoutClient = () => {
  const { cart, setCart, fields, setIsLoadingClientSecret, isLoadingShipping } = useCart();
  const [step, setStep] = useState<"general" | "shipping" | "payment">("general");
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromoCode, setIsApplyingPromoCode] = useState(false);
  const [isRemovingPromoCode, setIsRemovingPromoCode] = useState(false);

  if (!cart) {
    return (
      <div className="flex h-[calc(100vh-330.5px)] min-h-[250px] items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (cart.items?.length === 0) {
    return (
      <div className="flex h-[calc(100vh-330.5px)] min-h-[250px] items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <IconBadge size="large" className="mx-auto">
            <ShoppingBag />
          </IconBadge>
          <Text size="small" className="text-center">
            Your cart is empty
          </Text>
          <Button asChild size="small">
            <NextLink href="/products">Start shopping</NextLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 max-lg:grid-cols-[1fr_1fr_340px] max-md:flex max-md:flex-col-reverse md:min-h-[calc(100vh-330.5px)]">
      <div className="col-span-2 items-end">
        <ProgressTabs
          defaultValue="general"
          value={step}
          onValueChange={(value) => setStep(value as "general" | "shipping" | "payment")}
          activationMode="manual"
        >
          <ProgressTabs.List className="">
            <ProgressTabs.Trigger
              value="general"
              status={cart?.email && cart?.shipping_address ? "completed" : "not-started"}
            >
              General
            </ProgressTabs.Trigger>
            <ProgressTabs.Trigger
              value="shipping"
              status={cart?.shipping_methods?.length ? "completed" : "not-started"}
              disabled={!cart || !cart?.email || !cart?.shipping_address}
            >
              Shipping
            </ProgressTabs.Trigger>
            <ProgressTabs.Trigger
              value="payment"
              status="not-started"
              className="border-r-0"
              disabled={
                !cart ||
                !cart?.email ||
                !cart?.shipping_address ||
                !cart?.shipping_methods?.length ||
                isLoadingShipping
              }
            >
              Payment
            </ProgressTabs.Trigger>
          </ProgressTabs.List>
          <ProgressTabs.Content value="general">
            <GeneralForm setStep={setStep} step={step} />
          </ProgressTabs.Content>
          <ProgressTabs.Content value="shipping">
            <div className="space-y-6 p-8 pl-0 max-md:p-4 max-md:pb-12">
              <CheckoutDetails setStep={setStep} step={step} />
              <ShippingForm setStep={setStep} />
            </div>
          </ProgressTabs.Content>
          <ProgressTabs.Content value="payment">
            <div className="space-y-6 p-8 pl-0 max-md:p-4 max-md:pb-12">
              <CheckoutDetails setStep={setStep} step={step} />
              <PaymentForm />
            </div>
          </ProgressTabs.Content>
        </ProgressTabs>
      </div>
      <SummaryAccordion
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        isApplyingPromoCode={isApplyingPromoCode}
        setIsApplyingPromoCode={setIsApplyingPromoCode}
        isRemovingPromoCode={isRemovingPromoCode}
        setIsRemovingPromoCode={setIsRemovingPromoCode}
        step={step}
      />
      <div className="col-span-1 space-y-4 border-l p-8 pr-0 max-md:hidden">
        <div className="space-y-5">
          <div className="space-y-3">
            {cart?.items?.map((item) => (
              <div key={item.id} className={clx("flex gap-4")}>
                <div className="relative">
                  <div className="relative aspect-[1/1.2] w-12 shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.thumbnail?.replace(s3Url, cdnUrl) as string}
                      alt={item.product_title as string}
                      width={1000}
                      height={1000}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Badge
                    size="xsmall"
                    className="absolute -right-1.5 -top-1.5 h-4 px-1 opacity-100 dark:bg-zinc-700"
                  >
                    {item.quantity}
                  </Badge>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="space-y-0.5">
                    <Text weight="plus" size="small">
                      {item.product_title}
                    </Text>
                    {item.product?.variants?.length && (
                      <Text size="small" className="text-subtle-foreground">
                        {item.variant?.options?.map((o) => o.value).join(" · ")}
                      </Text>
                    )}
                  </div>
                </div>
                <Text weight="plus" size="small">
                  {formatCurrency("usd", item.unit_price * item.quantity)}
                </Text>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex w-full gap-2">
              <div className="flex-1">
                <Input
                  className="w-full"
                  placeholder="Discount code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>
              <Button
                size="small"
                className="w-20 shrink-0"
                isLoading={isApplyingPromoCode}
                onClick={async () => {
                  if (!promoCode || !cart) return;
                  setIsApplyingPromoCode(true);
                  setIsLoadingClientSecret(true);
                  try {
                    const response = (await medusa.store.cart.update(
                      cart.id,
                      {
                        // only allow one promo code so we reinitalize the promotions array with the new promo code
                        promo_codes: [promoCode],
                      },
                      { fields },
                    )) as { cart: ExtendedStoreCart };

                    // re-initialize the payment collection if step is payment
                    // so we can get the updated client secret along with the updated amount
                    if (step === "payment") {
                      await medusa.store.payment.initiatePaymentSession(
                        response.cart as StoreCart,
                        {
                          provider_id: "pp_stripe_stripe",
                        },
                      );

                      // refetch the cart
                      const updatedCartRes = await medusa.store.cart.retrieve(response.cart.id, {
                        fields,
                      });
                      setCart(updatedCartRes.cart as ExtendedStoreCart);
                    } else {
                      setCart(response.cart);
                    }

                    if (response.cart.promotions?.length) {
                      toast.success("Promo code applied");
                      setPromoCode("");
                    } else {
                      toast.error("Invalid promo code");
                    }
                  } catch (e) {
                    console.error(e);
                    toast.error("Failed to apply promo code");
                  } finally {
                    setIsApplyingPromoCode(false);
                    setIsLoadingClientSecret(false);
                  }
                }}
              >
                Apply
              </Button>
            </div>

            {cart?.promotions?.map((promo) => (
              <Badge
                size="small"
                key={promo.id}
                className={clx(
                  "flex h-6 w-fit cursor-default items-center gap-0.5 text-[11px]",
                  isRemovingPromoCode && "animate-pulse",
                )}
                color="blue"
              >
                {promo.code}
                <XMark
                  className={clx("cursor-pointer", isRemovingPromoCode && "cursor-default")}
                  onClick={async () => {
                    if (!cart || isRemovingPromoCode) return;
                    setIsRemovingPromoCode(true);
                    setIsLoadingClientSecret(true);
                    const response = (await medusa.store.cart.update(
                      cart.id,
                      {
                        promo_codes: [],
                      },
                      { fields },
                    )) as { cart: ExtendedStoreCart };

                    // re-initialize the payment collection if step is payment
                    // so we can get the updated client secret along with the updated amount
                    if (step === "payment") {
                      await medusa.store.payment.initiatePaymentSession(
                        response.cart as StoreCart,
                        {
                          provider_id: "pp_stripe_stripe",
                        },
                      );

                      // refetch the cart
                      const updatedCartRes = await medusa.store.cart.retrieve(response.cart.id, {
                        fields,
                      });
                      setCart(updatedCartRes.cart as ExtendedStoreCart);
                    } else {
                      setCart(response.cart);
                    }

                    setIsRemovingPromoCode(false);
                    setIsLoadingClientSecret(false);
                  }}
                />
              </Badge>
            ))}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Text size="small">Subtotal</Text>
              <Text size="small" className="text-subtle-foreground">
                {formatCurrency("usd", cart?.original_item_subtotal || 0)}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="small">Shipping</Text>
              <Text size="small" className="text-subtle-foreground">
                {formatCurrency("usd", cart?.original_shipping_subtotal || 0)}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="small">Taxes</Text>
              <Text size="small" className="text-subtle-foreground">
                {formatCurrency("usd", cart?.original_tax_total || 0)}
              </Text>
            </div>
            {cart?.promotions?.length ? (
              <div className="flex items-center justify-between">
                <Text size="small">
                  {cart?.promotions[0].code} (-{cart?.promotions[0].application_method.value}%)
                </Text>
                <Text size="small" className="text-subtle-foreground">
                  -{formatCurrency("usd", cart?.discount_total || 0)}
                </Text>
              </div>
            ) : (
              ""
            )}
            <div className="flex items-center justify-between">
              <Text size="small" weight="plus">
                Total
              </Text>
              <Text size="small" weight="plus">
                {formatCurrency("usd", cart?.total || 0)}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
