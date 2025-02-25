import { StoreProduct } from "@medusajs/types";
import { Text, clx } from "@medusajs/ui";
import NextLink from "next/link";
import { TriangleRightMini } from "@medusajs/icons";

export const Breadcrumbs = ({
  product,
  className,
}: {
  product: StoreProduct;
  className?: string;
}) => {
  return (
    <div className={clx("flex items-center gap-1.5", className)}>
      <NextLink href={`/products/${product.collection?.handle}`}>
        <Text
          size="small"
          className="capitalize text-subtle-foreground transition-colors hover:text-foreground"
        >
          {product.collection?.title}
        </Text>
      </NextLink>
      <TriangleRightMini className="relative top-[1px] text-subtle-foreground" />
      <Text size="small" className="cursor-default capitalize text-subtle-foreground">
        {product.title.replace("Sample", "")}
      </Text>
    </div>
  );
};
