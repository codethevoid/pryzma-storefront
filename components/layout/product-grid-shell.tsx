"use client";

import { StoreProduct } from "@medusajs/types";
import { ProductGrid } from "@/components/ui/product-grid";
import { useEffect, useMemo, useState } from "react";
import { Filter } from "@/components/ui/filter";
import { clx, Text, IconBadge, IconButton, CommandBar } from "@medusajs/ui";
import { Funnel, Loader, SidebarLeft, TriangleRightMini } from "@medusajs/icons";
import type { Filter as ActiveFilter } from "@/types";
import { useWindowWidth } from "@react-hook/window-size";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/swr/use-products";

export const ProductGridShell = ({
  initialData,
  initialCount,
  filterOptions,
  filterCounts,
  categoryId,
  collectionId,
  name,
  isCollection = false,
  quickAdd = false,
}: {
  initialData: StoreProduct[];
  initialCount: number;
  filterOptions?: Record<string, ActiveFilter[]>;
  filterCounts?: Record<string, number>;
  categoryId?: string | string[];
  collectionId?: string | string[];
  name?: string;
  quickAdd?: boolean;
  isCollection?: boolean;
}) => {
  const searchParams = useSearchParams();
  const pageSize = 24;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const windowWidth = useWindowWidth();

  const { data, isLoading, error } = useProducts({
    ...(categoryId && { categoryId }),
    ...(collectionId && { collectionId }),
    pageSize,
    filters,
  });

  const { displayProducts, displayCount, shouldShowInitial } = useMemo(() => {
    const shouldShowInitial = page === 1 && !filters.length;
    return {
      displayProducts: shouldShowInitial ? initialData : data?.products || [],
      displayCount: shouldShowInitial ? initialCount : data?.count || 0,
      shouldShowInitial,
    };
  }, [data, filters, initialData, initialCount, page]);

  const handlePageChange = async (newPage: number) => {
    const scrollPromise = new Promise<void>((resolve) => {
      const checkIfScrolled = () => {
        if (window.scrollY === 0) {
          resolve();
        } else {
          requestAnimationFrame(checkIfScrolled);
        }
      };

      // Fallback timeout in case scroll is interrupted
      const timeoutId = setTimeout(() => resolve(), 1000);

      window.scrollTo({ top: 0, behavior: "smooth" });
      checkIfScrolled();

      // Clean up timeout if scroll completes normally
      return () => clearTimeout(timeoutId);
    });

    await scrollPromise;

    const params = new URLSearchParams(searchParams);
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  useEffect(() => {
    setClientReady(true);
    if (windowWidth > 1024) {
      setIsDrawerOpen(false);
    }
  }, [windowWidth]);

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      <div className="space-y-4 max-sm:space-y-2">
        <div className="flex items-center gap-1.5 max-sm:px-4">
          {filterOptions && (
            <div>
              <IconButton
                variant="transparent"
                size="small"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex max-lg:hidden"
              >
                <SidebarLeft />
              </IconButton>

              <IconButton
                variant="transparent"
                size="small"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="hidden max-lg:flex"
              >
                <SidebarLeft />
              </IconButton>
            </div>
          )}
          {isCollection && name ? (
            <div className="flex items-center gap-1.5">
              <NextLink href="/collections">
                <Text
                  size="small"
                  className="text-subtle-foreground transition-colors hover:text-foreground"
                >
                  Collections
                </Text>
              </NextLink>
              <TriangleRightMini className="relative top-[1px] text-subtle-foreground" />
              <Text size="small" className="cursor-default text-subtle-foreground">
                {name}
              </Text>
            </div>
          ) : name ? (
            <div className="flex items-center gap-1.5">
              <NextLink href="/products">
                <Text
                  size="small"
                  className="text-subtle-foreground transition-colors hover:text-foreground"
                >
                  Products
                </Text>
              </NextLink>
              <TriangleRightMini className="relative top-[1px] text-subtle-foreground" />
              <Text size="small" className="cursor-default text-subtle-foreground">
                {name}
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <NextLink href="/">
                <Text
                  size="small"
                  className="text-subtle-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Text>
              </NextLink>
              <TriangleRightMini className="relative top-[1px] text-subtle-foreground" />
              <Text size="small" className="cursor-default text-subtle-foreground">
                Products
              </Text>
            </div>
          )}
        </div>
        <div className={clx("flex gap-4")}>
          {filterOptions && filterCounts && (
            <Filter
              options={filterOptions}
              activeFilters={filters}
              setActiveFilters={setFilters}
              filterCounts={filterCounts}
              isSidebarOpen={isSidebarOpen}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              // getFilteredProducts={getFilteredProducts}
            />
          )}
          <div
            className={clx(
              "w-full",
              isLoading && (filters.length || page > 1) && "pointer-events-none animate-pulse",
            )}
          >
            {!clientReady ? (
              <div className="pointer-events-none opacity-0">
                <ProductGrid products={initialData} quickAdd={quickAdd} />
              </div>
            ) : displayProducts.length > 0 ? (
              <div>
                <ProductGrid products={displayProducts} quickAdd={quickAdd} />
                <CommandBar open={displayCount > pageSize}>
                  <CommandBar.Bar className="dark:shadow-borders-base">
                    <CommandBar.Value>
                      Page {page} of {Math.ceil(displayCount / pageSize)}
                    </CommandBar.Value>
                    <CommandBar.Seperator />
                    <CommandBar.Command
                      action={() => {
                        if (page === 1) return;
                        handlePageChange(page - 1);
                      }}
                      label="Prev"
                      shortcut="H"
                    />
                    <CommandBar.Seperator />
                    <CommandBar.Command
                      action={() => {
                        if (page === Math.ceil(displayCount / pageSize)) return;
                        handlePageChange(page + 1);
                      }}
                      label="Next"
                      shortcut="L"
                    />
                  </CommandBar.Bar>
                </CommandBar>
              </div>
            ) : !shouldShowInitial && isLoading ? (
              <div className="flex h-full min-h-[250px] w-full items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            ) : (
              <div className="flex h-full min-h-[250px] w-full items-center justify-center">
                <div className="space-y-3">
                  <IconBadge className="mx-auto" size="large">
                    <Funnel />
                  </IconBadge>
                  <Text size="small" className="text-subtle-foreground">
                    No products found
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
