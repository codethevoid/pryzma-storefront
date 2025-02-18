import type { StoreProduct, StoreProductImage } from "@medusajs/types";
import { ImageGallery } from "../ui/image-gallery";
import { ProductDetails } from "../ui/product-details";

export const ProductShell = ({ product }: { product: StoreProduct }) => {
  return (
    <div className="grid grid-cols-5 gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-0 max-[900px]:space-y-6">
      <div className="col-span-3">
        <ImageGallery product={product} />
      </div>
      <div className="col-span-2">
        <ProductDetails product={product} />
      </div>
    </div>
  );
};
