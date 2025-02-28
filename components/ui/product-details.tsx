"use client";

import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { Heading, Text, StatusBadge, Button, Input } from "@medusajs/ui";
import { Suspense, useMemo, useState } from "react";
import { formatCurrency } from "@/utils/format-currency";
import { useCart } from "../context/cart";
import ReactMarkdown from "react-markdown";
import { OptionSelector } from "./option-selector";
import { Video } from "./video";

export const ProductDetails = ({ product }: { product: StoreProduct }) => {
  const [selectedVariant, setSelectedVariant] = useState<StoreProductVariant>(
    product.variants?.[0] as StoreProductVariant,
  );
  // const [selectedOptions, setSelectedOptions] = useState<StoreProductOption[]>([]);
  const [quantity, setQuantity] = useState<number | "">(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const getStatus = (): { color: "green" | "orange" | "red"; label: string } => {
    const inventory = selectedVariant.inventory_quantity as number;
    if (inventory >= 20) return { color: "green", label: "In stock" };
    if (inventory > 0) return { color: "orange", label: "Limited stock" };
    return { color: "red", label: "Out of stock" };
  };

  const description = useMemo(
    () => (
      <ReactMarkdown
        className="prose prose-sm max-w-none dark:prose-invert prose-p:mb-1 prose-strong:font-medium prose-ul:mt-0 prose-li:my-0 prose-li:font-mono prose-li:text-[11.5px] prose-li:tracking-tight"
        components={{
          p: ({ children }) => {
            // Check if the content is a raw YouTube URL
            if (typeof children === "string" && children.includes("youtube.com")) {
              const urls = children.split(",");
              return (
                <div className="mt-6 space-y-4">
                  {urls.map((url) => (
                    <Video key={url} src={url} />
                  ))}
                </div>
              );
            }
            return <p>{children}</p>;
          },
        }}
      >
        {product.description}
      </ReactMarkdown>
    ),
    [product.description],
  );

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
        <Text size="large" weight="plus" className="font-mono">
          {formatCurrency("usd", selectedVariant.calculated_price?.original_amount as number)}
        </Text>
        <Suspense
          fallback={
            <>
              {product?.options
                ?.filter((option) => (option.values?.length || 1) > 1)
                .map((option) => (
                  <div key={option.id} className="space-y-2">
                    <Text size="small">{option.title}</Text>
                    <div className="flex flex-wrap gap-2">
                      {option.values!.map((value) => (
                        <Button
                          key={value.id}
                          size="small"
                          variant={
                            selectedVariant.options?.find(
                              (opt) => opt.value === value.value && opt.option_id === option.id,
                            )
                              ? "primary"
                              : "secondary"
                          }
                        >
                          {value.value}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
            </>
          }
        >
          <OptionSelector
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />
        </Suspense>
        <div className="space-y-2">
          <div className="w-fit">
            <label htmlFor="quantity" className="w-fit">
              <Text size="small" className="w-fit">
                Quantity
              </Text>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="quantity"
              name="quantity"
              type="number"
              max={selectedVariant.inventory_quantity}
              value={quantity}
              onChange={(e) => {
                const value = e.target.value;
                // Handle empty input
                if (value === "") {
                  setQuantity("");
                  return;
                }
                const numValue = parseInt(value, 10);
                // Handle invalid or out of bounds values
                if (isNaN(numValue) || numValue < 1) {
                  setQuantity(1);
                  return;
                }
                // Limit to available inventory
                if (numValue > (selectedVariant.inventory_quantity || 0)) {
                  setQuantity(selectedVariant.inventory_quantity || 0);
                  return;
                }
                setQuantity(numValue);
              }}
              onBlur={(e) => {
                if (
                  !e.target.value ||
                  isNaN(Number(e.target.value)) ||
                  Number(e.target.value) < 1
                ) {
                  setQuantity(1);
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
                  quantity: quantity === "" ? 1 : quantity,
                });
                setIsLoading(false);
              }}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
      {description}
    </div>
  );
};
