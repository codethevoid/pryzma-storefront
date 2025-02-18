import { StoreProduct } from "@medusajs/types";
import { ProductCard } from "./product-card";
import { clx } from "@medusajs/ui";

export const ProductGrid = ({
  products,
  className,
  quickAdd = false,
}: {
  products: StoreProduct[];
  className?: string;
  quickAdd?: boolean;
}) => {
  return (
    <div className={clx("grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-2", className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className="w-auto min-w-fit max-w-none max-md:w-auto max-md:min-w-fit max-md:max-w-none"
          quickAdd={quickAdd}
        />
      ))}
    </div>
  );
};
