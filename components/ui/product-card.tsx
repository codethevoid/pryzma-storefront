"use client";

import { StoreProduct } from "@medusajs/types";
import Image from "next/image";
import { Text, clx, IconButton } from "@medusajs/ui";
import NextLink from "next/link";
import { useCart } from "../context/cart";
import { Plus } from "@medusajs/icons";
import { useState } from "react";
import { cdnUrl, s3Url } from "@/utils/s3";
import { formatCurrency } from "@/utils/format-currency";

export const ProductCard = ({
  product,
  className,
  quickAdd = false,
  eager = false,
  categoryHandle,
}: {
  product: StoreProduct;
  className?: string;
  quickAdd?: boolean;
  eager?: boolean;
  href?: string;
  categoryHandle?: string;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  return (
    <div
      className={clx(
        "group relative rounded-md bg-ui-bg-field p-2.5 shadow-borders-base transition-all hover:bg-ui-bg-field-hover",
        className,
      )}
    >
      <NextLink
        href={
          categoryHandle
            ? `/collections/${categoryHandle}/${product.handle}`
            : `/products/${product.collection?.handle}/${product.handle}`
        }
      >
        <div className="flex h-full flex-col justify-between space-y-1">
          <div className="space-y-2">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded">
              <Image
                src={product.thumbnail?.replace(s3Url, cdnUrl) || ""}
                alt={product.title}
                height={667}
                width={1000}
                className="h-full w-full object-cover"
                loading={eager ? "eager" : "lazy"}
              />
            </div>
            <Text size="small">{product.title}</Text>
          </div>
          <div className="flex items-center gap-1.5">
            <Text size="xsmall" className={clx("text-subtle-foreground")}>
              {product.variants &&
                product.variants.length > 1 &&
                product.variants.some(
                  (v) =>
                    v.calculated_price?.original_amount !==
                    product?.variants?.[0].calculated_price?.original_amount,
                ) &&
                "From "}
              {product.variants?.some(
                (v) => v.calculated_price?.calculated_price?.price_list_type === "sale",
              ) && (
                <Text as="span" size="xsmall" className="text-rose-600 dark:text-rose-400">
                  {formatCurrency(
                    "usd",
                    product.variants?.sort(
                      (a, b) =>
                        (a.calculated_price?.calculated_amount as number) -
                        (b.calculated_price?.calculated_amount as number),
                    )[0].calculated_price?.calculated_amount || 0,
                  )}{" "}
                </Text>
              )}
              <Text
                as="span"
                size="xsmall"
                className={clx(
                  product.variants?.some(
                    (v) => v.calculated_price?.calculated_price?.price_list_type === "sale",
                  ) && "line-through",
                )}
              >
                {formatCurrency(
                  "usd",
                  product.variants?.sort(
                    (a, b) =>
                      (a.calculated_price?.original_amount as number) -
                      (b.calculated_price?.original_amount as number),
                  )[0].calculated_price?.original_amount || 0,
                )}
              </Text>
            </Text>
          </div>
        </div>
      </NextLink>
      {quickAdd && (
        <IconButton
          size="small"
          className="absolute right-[14px] top-[14px] scale-0 opacity-0 transition-[transform,opacity] group-hover:scale-100 group-hover:opacity-100 max-sm:!scale-100 max-sm:!opacity-100"
          variant="transparent"
          isLoading={isAdding}
          onClick={async () => {
            setIsAdding(true);
            await addItem({
              variantId: product.variants?.[0]?.id as string,
              quantity: 1,
            });
            setIsAdding(false);
          }}
        >
          <Plus />
        </IconButton>
      )}
    </div>
  );
};
