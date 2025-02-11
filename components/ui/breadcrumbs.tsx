import { StoreProduct } from "@medusajs/types";
import { Text } from "@medusajs/ui";
import NextLink from "next/link";
import { TriangleRightMini } from "@medusajs/icons";

const productTypeMappings = {
  Switch: "switches",
  Lubricant: "lubricants",
  Accessory: "accessories",
};

export const Breadcrumbs = ({ product }: { product: StoreProduct }) => {
  return (
    <div className="flex items-center gap-1.5">
      <NextLink
        href={`/${productTypeMappings[product.type?.value as keyof typeof productTypeMappings]}`}
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
        {product.title}
      </Text>
    </div>
  );
};
