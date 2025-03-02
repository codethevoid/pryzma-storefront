"use client";

import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { Text, Button, clx } from "@medusajs/ui";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    selectedVariant.options?.reduce(
      (acc, option) => {
        acc[option.option_id || ""] = option.value;
        return acc;
      },
      {} as Record<string, string>,
    ) || {},
  );

  useEffect(() => {
    const variantId = searchParams.get("variant");
    if (variantId) {
      // find the variant in product and set it as selected variant
      const variant = product.variants?.find((v) => v.id === variantId);
      setSelectedOptions(
        variant?.options?.reduce(
          (acc, option) => {
            acc[option.option_id || ""] = option.value;
            return acc;
          },
          {} as Record<string, string>,
        ) || {},
      );
      if (variant) setSelectedVariant(variant);
    }

    // make sure the variant is in stock no matter what
    if (selectedVariant.inventory_quantity === 0) {
      // check and see if there is any other variant that is in stock
      const inStockVariant = product.variants?.find((v) => (v.inventory_quantity || 0) > 0);
      if (inStockVariant) {
        setSelectedOptions(
          inStockVariant.options?.reduce(
            (acc, option) => {
              acc[option.option_id || ""] = option.value;
              return acc;
            },
            {} as Record<string, string>,
          ) || {},
        );
        setSelectedVariant(inStockVariant);
      } // else we do nothing
    }
  }, []);

  const isOptionAvailable = (optionId: string, value: string) => {
    // Create test options with current selections plus this value
    const testOptions = {
      ...selectedOptions,
      [optionId]: value,
    };

    // Check if any variant exists with these options AND has stock
    return (
      product.variants?.some(
        (variant) =>
          variant.options?.every((opt) => testOptions[opt.option_id || ""] === opt.value) &&
          (variant.inventory_quantity || 0) > 0,
      ) ?? false
    );
  };

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
                  className={clx(
                    !isOptionAvailable(option.id, value.value) &&
                      "text-subtle-foreground line-through",
                    selectedOptions[option.id] === value.value && "text-ui-contrast-fg-primary",
                  )}
                  variant={selectedOptions[option.id] === value.value ? "primary" : "secondary"}
                  onClick={() => {
                    const newOptions = { ...selectedOptions, [option.id]: value.value };

                    // First try to find a variant that matches all current selections
                    let variant = product.variants?.find((variant) =>
                      variant?.options?.every(
                        (opt) => newOptions[opt.option_id || ""] === opt.value,
                      ),
                    );

                    // If no exact match found, find the first variant that matches this new selection
                    if (!variant) {
                      variant = product.variants?.find((variant) =>
                        variant.options?.some(
                          (opt) => opt.option_id === option.id && opt.value === value.value,
                        ),
                      );
                    }

                    if (variant) {
                      // Update all options based on the found variant
                      const variantOptions =
                        variant.options?.reduce(
                          (acc, opt) => ({
                            ...acc,
                            [opt.option_id || ""]: opt.value,
                          }),
                          {},
                        ) || {};

                      setSelectedOptions(variantOptions);
                      setSelectedVariant(variant);
                      window.history.replaceState(null, "", `?variant=${variant.id}`);
                    }
                  }}
                  // disabled={!isOptionAvailable(option.id, value.value)}
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
