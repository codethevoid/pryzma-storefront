"use client";

import type { ExtendedStoreCart } from "@/components/context/cart";
import { useCart } from "@/components/context/cart";
import { Badge, Button, clx, IconBadge, Input, Text, toast } from "@medusajs/ui";
import NextLink from "next/link";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";
import { useState } from "react";
import { medusa } from "@/utils/medusa";
import { Loader, ShoppingBag, XMark } from "@medusajs/icons";
import { StoreCart } from "@medusajs/types";
import { SummaryAccordion } from "./summary-accordion";
import { cdnUrl, s3Url } from "@/utils/s3";
import { GeneralForm } from "@/app/checkout/forms/general";
import { ExpressCheckout } from "@/app/checkout/express-checkout";
import { ChevronRight, Lock } from "lucide-react";
import { ShippingForm } from "@/app/checkout/forms/shipping";
import { CheckoutDetails } from "@/app/checkout/details";
import { PaymentForm } from "@/app/checkout/forms/payment";

export const CheckoutClient = () => {
  const { cart, setCart, fields, setIsLoadingClientSecret, isLoadingShipping } = useCart();
  const [step, setStep] = useState<"general" | "shipping" | "payment">("general");
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromoCode, setIsApplyingPromoCode] = useState(false);
  const [isRemovingPromoCode, setIsRemovingPromoCode] = useState(false);

  if (!cart) {
    return (
      <div className="flex h-screen min-h-[250px] items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (cart.items?.length === 0) {
    return (
      <div className="flex h-screen min-h-[250px] items-center justify-center">
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

  const isNavBtnDisabled = (btn: "shipping" | "payment") => {
    switch (btn) {
      case "shipping":
        return (
          !cart?.email ||
          !cart?.shipping_address ||
          !cart?.shipping_address.address_1 ||
          !cart?.shipping_address.first_name ||
          !cart?.shipping_address.last_name ||
          !cart?.shipping_address.province ||
          !cart?.shipping_address.city ||
          !cart?.shipping_address.postal_code
        );
      case "payment":
        return (
          !cart?.email ||
          !cart?.shipping_address ||
          !cart?.shipping_methods?.length ||
          !cart?.email ||
          !cart?.shipping_address ||
          !cart?.shipping_address.address_1 ||
          !cart?.shipping_address.first_name ||
          !cart?.shipping_address.last_name ||
          !cart?.shipping_address.province ||
          !cart?.shipping_address.city ||
          !cart?.shipping_address.postal_code ||
          isLoadingShipping
        );
      default:
        return false;
    }
  };

  return (
    <div className="mx-auto min-h-screen fade-in lg:grid lg:max-w-screen-lg lg:grid-cols-5">
      <div className="col-span-3 w-full">
        <nav className="space-y-4 pt-2 lg:pt-8">
          <div className="mx-auto -mb-2 flex w-full max-w-xl items-center justify-between px-4 lg:mx-0 lg:-mb-0 lg:max-w-none lg:px-0">
            <div className="w-fit shrink-0 rounded-md border bg-zinc-100 p-0.5 shadow-sm dark:bg-zinc-800">
              <NextLink href="/">
                <Image
                  src={`${cdnUrl}/logos/pryzma.png`}
                  alt="pryzma logo"
                  width={500}
                  height={500}
                  quality={100}
                  className="size-6 rounded lg:size-8"
                />
              </NextLink>
            </div>
            {/*<Badge color="green" className="flex h-6 items-center gap-1 px-1.5 opacity-90 lg:mr-8">*/}
            {/*  <Lock className="size-3.5" />*/}
            {/*  <span>Secure checkout</span>*/}
            {/*</Badge>*/}
            {/*<StatusBadge color="blue" className="h-6">*/}
            {/*  /!*<Lock className="-ml-1 size-3" />*!/*/}
            {/*  <span>Secure checkout</span>*/}
            {/*</StatusBadge>*/}
            <div className="txt-compact-xsmall-plus flex h-6 items-center gap-1.5 rounded-md border border-ui-border-base bg-ui-bg-subtle px-2 text-ui-fg-subtle lg:mr-8">
              <Lock className="size-3" />
              <span>Secure checkout</span>
            </div>
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
          <div className="mx-auto flex max-w-xl items-center gap-1.5 px-4 lg:mx-0 lg:max-w-none lg:px-0">
            <button
              onClick={() => setStep("general")}
              className={clx(
                "text-[0.825rem]",
                step !== "general" && "text-blue-500 hover:underline dark:text-blue-400",
              )}
            >
              Information
            </button>
            <ChevronRight className="size-3.5 text-subtle-foreground" />
            <button
              onClick={() => setStep("shipping")}
              className={clx(
                "text-[0.825rem]",
                isNavBtnDisabled("shipping") && "text-subtle-foreground",
                step === "general" && "text-subtle-foreground",
                step === "payment" && "text-blue-500 hover:underline dark:text-blue-400",
              )}
              disabled={isNavBtnDisabled("shipping")}
            >
              Shipping
            </button>
            <ChevronRight className="size-3.5 text-subtle-foreground" />
            <button
              onClick={() => setStep("payment")}
              className={clx("text-[0.825rem]", step !== "payment" && "text-subtle-foreground")}
              disabled={isNavBtnDisabled("payment")}
            >
              Payment
            </button>
          </div>
        </nav>
        {step === "general" && (
          <div className="fade-in">
            <ExpressCheckout />
            <GeneralForm setStep={setStep} step={step} />
          </div>
        )}
        {step === "shipping" && (
          <div className="mx-auto max-w-xl space-y-6 px-4 pb-12 pt-8 fade-in lg:mx-0 lg:max-w-none lg:p-8 lg:pb-8 lg:pl-0">
            <CheckoutDetails setStep={setStep} step={step} />
            <ShippingForm setStep={setStep} />
          </div>
        )}
        {step === "payment" && (
          <div className="mx-auto max-w-xl space-y-6 px-4 pb-12 pt-8 fade-in lg:mx-0 lg:max-w-none lg:p-8 lg:pb-8 lg:pl-0">
            <CheckoutDetails setStep={setStep} step={step} />
            <PaymentForm />
          </div>
        )}
      </div>
      <div className="relative col-span-2 border-l p-8 pr-0 max-lg:hidden">
        <div className="absolute inset-0 z-[-1] w-screen bg-zinc-50 dark:bg-zinc-900"></div>
        <div className="space-y-5">
          <div className="space-y-3">
            {cart?.items?.map((item) => (
              <div key={item.id} className={clx("flex gap-4")}>
                <div className="relative">
                  <div className="relative aspect-[1/1.2] w-12 shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.thumbnail?.replace(s3Url, cdnUrl) as string}
                      alt={item.product_title as string}
                      width={600}
                      height={600}
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
