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
    <div
      className={clx(
        "grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:gap-3 max-sm:grid-cols-2 max-sm:gap-0 max-sm:border-t",
        className,
      )}
    >
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          className={clx(
            "w-auto min-w-fit max-w-none last:border-b-0 max-md:w-auto max-md:min-w-fit max-md:max-w-none max-sm:rounded-none max-sm:border-b max-sm:bg-transparent max-sm:p-3 max-sm:shadow-none max-sm:odd:border-r",
            products.length % 2 === 0 && i === products.length - 2 && "max-sm:border-b-0",
          )}
          quickAdd={quickAdd}
        />
      ))}
    </div>
  );
};
