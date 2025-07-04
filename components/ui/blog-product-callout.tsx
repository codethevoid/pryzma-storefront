import { medusa } from "@/utils/medusa";
import NextLink from "next/link";
import { clx, Text } from "@medusajs/ui";
import NextImage from "next/image";
import { formatCurrency } from "@/utils/format-currency";
import { ChevronRight } from "lucide-react";

export const BlogProductCallout = async ({ handle }: { handle: string }) => {
  const data = await medusa.store.product.list({
    handle,
    limit: 1,
    fields: "*variants.calculated_price",
  });

  if (!data) return null;

  const product = data.products[0];
  if (!product) return null;

  return (
    <div>
      <NextLink
        href={`/products/${product.collection?.handle}/${product.handle}`}
        className="not-prose"
      >
        <div className="flex items-center justify-between gap-2 rounded-md bg-ui-bg-base p-2 shadow-borders-base transition-colors hover:bg-ui-bg-base-hover dark:bg-ui-bg-base dark:hover:bg-ui-bg-base-hover md:bg-zinc-50 md:dark:bg-zinc-900/50 md:dark:hover:bg-zinc-900/70">
          <div className="flex items-center gap-2">
            <div className="size-12 overflow-hidden rounded-md dark:border">
              <NextImage
                src={product.thumbnail?.replace("s3://", "https://cdn.pryzma.io/") || ""}
                alt={product.title}
                className="size-full scale-125 object-cover"
                height={200}
                width={300}
              />
            </div>
            <div className="space-y-0.5">
              <Text size="small" weight="plus" className="line-clamp-1 dark:text-white">
                {product.title}
              </Text>
              <Text size="xsmall" className="text-subtle-foreground">
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
                  <Text as="span" size="xsmall" className="text-red-600 dark:text-red-400">
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
          <ChevronRight className="mr-2 size-5 shrink-0 text-subtle-foreground" />
        </div>
      </NextLink>
    </div>
  );
};
