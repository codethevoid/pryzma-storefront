"use client";

import { StoreProduct } from "@medusajs/types";
import { clx } from "@medusajs/ui";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export const ImageGallery = ({ product }: { product: StoreProduct }) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.thumbnail || product.images?.[0].url || "",
  );

  return (
    <div className="space-y-2.5">
      <div className="relative aspect-[3/2] bg-zinc-50 p-[7px] shadow-borders-base dark:bg-zinc-800">
        <div className="h-full w-full overflow-hidden rounded-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full"
            >
              <Image
                src={selectedImage}
                alt={product.title}
                height={2000}
                width={3000}
                className="h-full w-full object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {(product.images?.length || 1) > 1 && (
        <div className="grid grid-cols-6 gap-2.5 max-sm:grid-cols-5">
          {product.images?.map((image) => (
            <div
              key={image.id}
              role="button"
              className={clx(
                "relative aspect-[3/2] cursor-pointer overflow-hidden rounded-md shadow-borders-base transition-all",
                selectedImage === image.url && "shadow-borders-interactive-with-active",
              )}
              onClick={() => setSelectedImage(image.url)}
            >
              <Image
                src={image.url}
                alt={product.title}
                height={1000}
                width={1500}
                className={clx("h-full w-full object-cover")}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
