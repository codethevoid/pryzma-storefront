"use client";

import { StoreProduct, StoreProductImage } from "@medusajs/types";
import { clx } from "@medusajs/ui";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export const ImageGallery = ({ product }: { product: StoreProduct }) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.thumbnail || product.images?.[0].url || "",
  );

  return (
    <div className="space-y-2">
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg border bg-zinc-50 p-[7px] shadow-sm dark:bg-zinc-700/50">
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
              className="h-full w-full rounded-md object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {(product.images?.length || 1) > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {product.images?.map((image) => (
            <div
              key={image.id}
              role="button"
              className={clx(
                "relative aspect-[3/2] cursor-pointer overflow-hidden rounded-md border border-transparent shadow-sm transition-all",
                selectedImage === image.url &&
                  "border-blue-500 ring-4 ring-blue-500/30 dark:border-blue-400 dark:ring-blue-500/30",
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
