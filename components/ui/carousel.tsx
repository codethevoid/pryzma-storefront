"use client";

import { useEffect, useRef, useState } from "react";
import { Button, IconButton, Text } from "@medusajs/ui";
import { ReactNode } from "react";
import { ProductCard } from "./product-card";
import { StoreProduct } from "@medusajs/types";
import { ChevronRight, ChevronLeft } from "@medusajs/icons";

export const Carousel = ({ data, title }: { data: StoreProduct[]; title: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scroll = (direction: "left" | "right") => {
    const container = ref.current;
    if (!container) return;

    const cardWidth = container.clientWidth > 736 ? 316 : 236;
    const scrollAmount = Math.floor(container.clientWidth / cardWidth) * cardWidth;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScroll = () => {
    const container = ref.current;
    if (!container) return;

    setIsAtStart(container.scrollLeft <= 0);
    setIsAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-xl">
        <Text size="xlarge" weight="plus">
          {title}
        </Text>
        <div className="relative">
          <div
            ref={ref}
            className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth py-4"
            onScroll={checkScroll}
          >
            {data.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
          <div className="absolute right-0 top-[-27px] flex gap-1.5">
            <IconButton onClick={() => scroll("left")} disabled={isAtStart} size="small">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={() => scroll("right")} disabled={isAtEnd} size="small">
              <ChevronRight />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};
