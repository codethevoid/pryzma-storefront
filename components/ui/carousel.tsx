"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton, Text, clx } from "@medusajs/ui";
import { ProductCard } from "./product-card";
import { StoreProduct } from "@medusajs/types";
import { ChevronRight, ChevronLeft } from "@medusajs/icons";
import { useWindowWidth } from "@react-hook/window-size";

export const Carousel = ({
  data,
  title,
  className,
}: {
  data: StoreProduct[];
  title: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(true);
  const width = useWindowWidth();

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
  }, [width]);

  return (
    <div className={clx("px-4", className)}>
      <div className="mx-auto max-w-screen-xl">
        <Text size="xlarge" weight="plus">
          {title}
        </Text>
        <div className="relative">
          <div
            ref={ref}
            className="grid auto-cols-[300px] grid-flow-col gap-4 overflow-x-auto scroll-smooth py-4 pl-0.5 pr-0.5 scrollbar-hide max-md:auto-cols-[220px]"
            onScroll={checkScroll}
          >
            {data.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
          <div
            className={clx(
              "absolute right-0 top-[-27px] flex gap-1.5 max-sm:hidden",
              isAtEnd && isAtStart && "hidden",
            )}
          >
            <IconButton
              onClick={() => scroll("left")}
              disabled={isAtStart}
              size="small"
              aria-label="Scroll left"
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => scroll("right")}
              disabled={isAtEnd}
              size="small"
              aria-label="Scroll right"
            >
              <ChevronRight />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};
