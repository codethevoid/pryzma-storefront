"use client";

import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { Text, Button } from "@medusajs/ui";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const OptionSelector = ({
  product,
  selectedVariant,
  setSelectedVariant,
}: {
  product: StoreProduct;
  selectedVariant: StoreProductVariant;
  setSelectedVariant: (variant: StoreProductVariant) => void;
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const variantId = searchParams.get("variant");
    if (variantId) {
      // find the variant in product and set it as selected variant
      const variant = product.variants?.find((v) => v.id === variantId);
      if (variant) setSelectedVariant(variant);
    }

    // make sure the variant is in stock no matter what
    if (selectedVariant.inventory_quantity === 0) {
      // check and see if there is any other variant that is in stock
      const inStockVariant = product.variants?.find((v) => (v.inventory_quantity || 0) > 0);
      if (inStockVariant) {
        setSelectedVariant(inStockVariant);
      } // else we do nothing
    }
  }, []);

  if ((product.options?.length || 0) === 0) return null;

  return (
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
                  onClick={() => {
                    const variant = product.variants?.find((variant) =>
                      variant?.options?.some(
                        (opt) => opt.value === value.value && opt.option_id === option.id,
                      ),
                    );
                    if (variant) {
                      setSelectedVariant(variant);
                      window.history.replaceState(null, "", `?variant=${variant.id}`);
                    }
                  }}
                >
                  {value.value}
                </Button>
              ))}
            </div>
          </div>
        ))}
    </>
  );
};
