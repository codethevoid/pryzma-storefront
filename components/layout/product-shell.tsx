import type { StoreProduct } from "@medusajs/types";
import { ImageGallery } from "../ui/image-gallery";
import { ProductDetails } from "../ui/product-details";

export const ProductShell = ({ product }: { product: StoreProduct }) => {
  return (
    <div className="grid grid-cols-5 gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-0 max-[900px]:space-y-6">
      <section
        aria-label="Product image gallery"
        className="sticky top-4 col-span-3 h-fit max-[900px]:static"
      >
        <ImageGallery product={product} />
      </section>
      <section aria-label="Product information" className="col-span-2">
        <ProductDetails product={product} />
      </section>
    </div>
  );
};
