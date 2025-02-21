"use client";

import { StoreOrder } from "@medusajs/types";
import { clx, Badge } from "@medusajs/ui";
import Image from "next/image";
import { formatCurrency } from "@/utils/format-currency";
import { Text } from "@medusajs/ui";
import { useState } from "react";
import { cdnUrl, s3Url } from "@/utils/s3";

export const OrderSummary = ({ order }: { order: StoreOrder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const Content = ({ className }: { className?: string }) => {
    return (
      <div className={clx("space-y-5", className)}>
        <div className="space-y-3">
          {order?.items?.map((item) => (
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
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Text size="small">Subtotal</Text>
            <Text size="small" className="text-subtle-foreground">
              {formatCurrency("usd", order?.original_item_subtotal || 0)}
            </Text>
          </div>
          <div className="flex items-center justify-between">
            <Text size="small">Shipping</Text>
            <Text size="small" className="text-subtle-foreground">
              {formatCurrency("usd", order?.original_shipping_subtotal || 0)}
            </Text>
          </div>
          {order.original_tax_total > 0 && (
            <div className="flex items-center justify-between">
              <Text size="small">Taxes</Text>
              <Text size="small" className="text-subtle-foreground">
                {formatCurrency("usd", order.original_tax_total || 0)}
              </Text>
            </div>
          )}
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <Text size="small">Discount</Text>
              <Text size="small" className="text-subtle-foreground">
                -{formatCurrency("usd", order.discount_total || 0)}
              </Text>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Text size="small" weight="plus">
              Total
            </Text>
            <Text size="small" weight="plus">
              {formatCurrency("usd", order.total || 0)}
            </Text>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile */}
      <div className="hidden max-md:block">
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
            {formatCurrency("usd", order?.total || 0)}
          </Text>
        </div>
        <div
          className={clx(
            "grid transition-[grid-template-rows]",
            isOpen ? "grid-rows-[1fr] border-b" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <Content className="p-4" />
          </div>
        </div>
      </div>
      {/* Desktop */}
      <div className="col-span-1 space-y-4 border-l p-8 pr-0 max-md:hidden">
        <Content />
      </div>
    </>
  );
};
