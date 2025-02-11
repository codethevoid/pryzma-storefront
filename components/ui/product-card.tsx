import { StoreProduct } from "@medusajs/types";
import Image from "next/image";
import { Text, clx } from "@medusajs/ui";
import NextLink from "next/link";

export const ProductCard = ({
  product,
  className,
}: {
  product: StoreProduct;
  className?: string;
}) => {
  return (
    <NextLink href={`/products/${product.handle}`}>
      <div
        className={clx(
          "h-full w-[300px] w-full min-w-[300px] max-w-[300px] rounded-md border bg-zinc-50 p-2.5 shadow-sm transition-all hover:shadow-md dark:bg-zinc-700/50 dark:hover:bg-zinc-700/40 max-md:w-[220px] max-md:min-w-[220px] max-md:max-w-[220px]",
          className,
        )}
      >
        <div className="flex h-full flex-col justify-between space-y-1">
          <div className="space-y-2">
            <div className="aspect-square w-full overflow-hidden rounded">
              <Image
                src={product.thumbnail as string}
                alt={product.title}
                height={1080}
                width={1080}
                className="h-full w-full scale-110 object-cover"
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
      </div>
    </NextLink>
  );
};
