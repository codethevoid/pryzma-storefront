"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Text, clx, Button } from "@medusajs/ui";
import { ProductCard } from "./product-card";
import { StoreProduct } from "@medusajs/types";
import { ChevronRight, ChevronLeft } from "@medusajs/icons";
import { useWindowWidth } from "@react-hook/window-size";

export const Carousel = ({
  data,
  title,
  className,
  description,
  action,
  stack = true,
}: {
  data: StoreProduct[];
  title: string;
  className?: string;
  description?: string;
  action?: ReactNode;
  stack?: boolean;
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
        {description && (
          <Text size="small" className="max-w-[500px] text-subtle-foreground">
            {description}
          </Text>
        )}
        {action && stack && (
          <div className="mt-2 flex hidden justify-end max-md:block">{action}</div>
        )}
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
          {action && (
            <div
              className={clx(
                "absolute right-0 top-[-29px] flex gap-1.5",
                isAtEnd && isAtStart && "hidden",
                stack && "max-md:hidden",
              )}
            >
              {action}
            </div>
          )}
          <Button
            onClick={() => scroll("left")}
            disabled={isAtStart}
            size="small"
            aria-label="Scroll left"
            variant="primary"
            className={clx(
              "absolute -left-3 top-1/2 size-7 -translate-y-1/2 p-0.5 max-sm:hidden",
              isAtStart && "pointer-events-none opacity-0",
              isAtStart && isAtEnd && "hidden",
            )}
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={() => scroll("right")}
            disabled={isAtEnd}
            size="small"
            variant="primary"
            aria-label="Scroll right"
            className={clx(
              "absolute -right-3 top-1/2 size-7 -translate-y-1/2 p-0.5 max-sm:hidden",
              isAtEnd && "pointer-events-none opacity-0",
              isAtStart && isAtEnd && "hidden",
            )}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
