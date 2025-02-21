"use client";

import { useState } from "react";
import Image from "next/image";
import { clx, Badge, Text, Button, Input, toast } from "@medusajs/ui";
import { useCart } from "@/components/context/cart";
import { formatCurrency } from "@/utils/format-currency";
import { medusa } from "@/utils/medusa";
import type { ExtendedStoreCart } from "@/components/context/cart";
import { StoreCart } from "@medusajs/types";
import { XMark } from "@medusajs/icons";
import { cdnUrl, s3Url } from "@/utils/s3";

type Props = {
  promoCode: string;
  setPromoCode: (promoCode: string) => void;
  isApplyingPromoCode: boolean;
  setIsApplyingPromoCode: (isApplyingPromoCode: boolean) => void;
  isRemovingPromoCode: boolean;
  setIsRemovingPromoCode: (isRemovingPromoCode: boolean) => void;
  step: "general" | "shipping" | "payment";
};

export const SummaryAccordion = ({
  promoCode,
  setPromoCode,
  isApplyingPromoCode,
  setIsApplyingPromoCode,
  isRemovingPromoCode,
  setIsRemovingPromoCode,
  step,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, setCart, fields, setIsLoadingClientSecret } = useCart();

  return (
    <div className="hidden max-md:block">
      {/* Trigger */}
      <div
        role="button"
        className={clx("flex items-center justify-between border-b p-4")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text size="small" weight="plus" className="flex items-center gap-1.5">
          Order summary{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={clx(
              "relative top-[1px] size-4 text-subtle-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          >
            <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
          </svg>
        </Text>
        <Text size="small" weight="plus">
          {formatCurrency("usd", cart?.total || 0)}
        </Text>
      </div>
      {/* Content */}
      <div
        className={clx(
          "grid transition-[grid-template-rows]",
          isOpen ? "grid-rows-[1fr] border-b" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 p-4">
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
    </div>
  );
};
