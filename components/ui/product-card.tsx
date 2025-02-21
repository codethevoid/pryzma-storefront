"use client";

import { StoreProduct } from "@medusajs/types";
import Image from "next/image";
import { Text, clx, IconButton } from "@medusajs/ui";
import NextLink from "next/link";
import { useCart } from "../context/cart";
import { Plus } from "@medusajs/icons";
import { useState } from "react";
import { productTypeMappings } from "@/lib/product-types";
import { cdnUrl, s3Url } from "@/utils/s3";

export const ProductCard = ({
  product,
  className,
  quickAdd = false,
}: {
  product: StoreProduct;
  className?: string;
  quickAdd?: boolean;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  return (
    <div
      className={clx(
        "group relative h-full w-[300px] w-full min-w-[300px] max-w-[300px] rounded-md bg-ui-bg-field p-2.5 shadow-borders-base transition-all hover:bg-ui-bg-field-hover max-md:w-[220px] max-md:min-w-[220px] max-md:max-w-[220px]",
        className,
      )}
    >
      <NextLink
        href={`/products/${productTypeMappings[product.type?.value as keyof typeof productTypeMappings]}/${product.handle}`}
      >
        <div className="flex h-full flex-col justify-between space-y-1">
          <div className="space-y-2">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded">
              <Image
                src={product.thumbnail?.replace(s3Url, cdnUrl) as string}
                alt={product.title}
                height={1080}
                width={1080}
                className="h-full w-full object-cover"
              />
            </div>
            <Text size="small">{product.title}</Text>
          </div>
          <Text size="xsmall" className="text-subtle-foreground">
            {(product?.variants?.length || 0) > 1 && "From "}
            {Intl.NumberFormat("en-us", {
              style: "currency",
              currency: "USD",
            }).format(
              product.variants?.sort(
                (a, b) =>
                  (a.calculated_price?.original_amount as number) -
                  (b.calculated_price?.original_amount as number),
              )[0].calculated_price?.original_amount || 0,
            )}
          </Text>
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
