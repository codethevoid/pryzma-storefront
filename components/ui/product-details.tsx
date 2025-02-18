"use client";

import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { Heading, Text, Badge, StatusBadge, Button, Input } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/format-currency";
import { useSearchParams } from "next/navigation";
import { useCart } from "../context/cart";
import ReactMarkdown from "react-markdown";

export const ProductDetails = ({ product }: { product: StoreProduct }) => {
  const [selectedVariant, setSelectedVariant] = useState<StoreProductVariant>(
    product.variants?.[0] as StoreProductVariant,
  );
  const [quantity, setQuantity] = useState(1);
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const getStatus = (): { color: "green" | "orange" | "red"; label: string } => {
    const inventory = selectedVariant.inventory_quantity as number;
    if (inventory >= 20) return { color: "green", label: "In stock" };
    if (inventory > 0) return { color: "orange", label: "Limited stock" };
    return { color: "red", label: "Out of stock" };
  };

  useEffect(() => {
    const variantId = searchParams.get("variant");
    if (variantId) {
      // find the variant in product and set it as selected variant
      const variant = product.variants?.find((variant) => variant.id === variantId);
      if (variant) setSelectedVariant(variant);
    }

    // make sure the variant is in stock no matter what
    if (selectedVariant.inventory_quantity === 0) {
      // check and see if there is any other variant that is in stock
      const inStockVariant = product.variants?.find(
        (variant) => (variant.inventory_quantity || 0) > 0,
      );
      if (inStockVariant) {
        setSelectedVariant(inStockVariant);
      } // else we do nothing
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          {product.subtitle && (
            <Text size="small" className="text-subtle-foreground">
              {product.subtitle}
            </Text>
          )}
          <Heading>{product.title}</Heading>
        </div>
        <StatusBadge color={getStatus().color}>{getStatus().label}</StatusBadge>
        <Text size="large" weight="plus">
          {formatCurrency("usd", selectedVariant.calculated_price?.original_amount as number)}
        </Text>
        {(product.variants?.length || 1) > 1 && (
          <div className="space-y-2">
            <Text size="small">Select {product?.options?.[0].title.toLowerCase()}</Text>
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((variant) => (
                <Button
                  key={variant.id}
                  size="small"
                  onClick={() => {
                    setSelectedVariant(variant);
                    window.history.replaceState(null, "", `?variant=${variant.id}`);
                  }}
                  variant={selectedVariant.id === variant.id ? "primary" : "secondary"}
                >
                  {variant.options?.[0]?.value}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Text size="small">Quantity</Text>
          <div className="flex items-center gap-2">
            <Input
              name="quantity"
              type="number"
              min={1}
              max={selectedVariant.inventory_quantity}
              value={quantity}
              onChange={(e) => {
                if (Number(e.target.value) >= (selectedVariant.inventory_quantity || 0)) {
                  setQuantity(selectedVariant.inventory_quantity || 0);
                } else {
                  setQuantity(Number(e.target.value));
                }
              }}
              disabled={selectedVariant.inventory_quantity === 0}
              className="w-28"
              autoComplete="off"
            />
            <Button
              disabled={selectedVariant.inventory_quantity === 0}
              className="w-full"
              isLoading={isLoading}
              onClick={async () => {
                if (!selectedVariant) return alert("No variant selected");
                setIsLoading(true);
                await addItem({
                  variantId: selectedVariant.id,
                  quantity,
                });
                setIsLoading(false);
              }}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
      <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert prose-p:mb-1 prose-strong:font-medium prose-ul:mt-0 prose-li:my-0 prose-li:text-[13px]">
        {product.description}
      </ReactMarkdown>
    </div>
  );
};
