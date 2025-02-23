import { StoreProduct } from "@medusajs/types";
import { Text, clx } from "@medusajs/ui";
import NextLink from "next/link";
import { TriangleRightMini } from "@medusajs/icons";

const productTypeMappings = {
  switch: "switches",
  lubricant: "lubricants",
  accessory: "accessories",
  sample: "samples",
};

export const Breadcrumbs = ({
  product,
  className,
}: {
  product: StoreProduct;
  className?: string;
}) => {
  return (
    <div className={clx("flex items-center gap-1.5", className)}>
      <NextLink
        href={`/products/${productTypeMappings[product.type?.value as keyof typeof productTypeMappings]}`}
      >
        <Text
          size="small"
          className="capitalize text-subtle-foreground transition-colors hover:text-foreground"
        >
          {productTypeMappings[product.type?.value as keyof typeof productTypeMappings]}
        </Text>
      </NextLink>
      <TriangleRightMini className="relative top-[1px] text-subtle-foreground" />
      <Text size="small" className="cursor-default capitalize text-subtle-foreground">
        {product.title.replace("Sample", "")}
      </Text>
    </div>
  );
};
