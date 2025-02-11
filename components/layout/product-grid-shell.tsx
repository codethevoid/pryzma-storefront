"use client";

import { StoreProduct } from "@medusajs/types";
import { ProductGrid } from "@/components/ui/product-grid";
import { useEffect, useState } from "react";
import { Filter } from "@/components/ui/filter";
import { medusa } from "@/utils/medusa";
import { clx, Text, IconBadge, IconButton, CommandBar } from "@medusajs/ui";
import { Funnel, SidebarLeft, SidebarRight, TriangleRightMini } from "@medusajs/icons";
import { buildTagFilters } from "@/lib/helpers/build-tag-filters";
import type { Filter as ActiveFilter } from "@/types";
import { useWindowWidth } from "@react-hook/window-size";
import NextLink from "next/link";

const fetchProducts = async ({
  categoryId,
  filters,
  page,
  pageSize,
}: {
  categoryId: string;
  filters: ActiveFilter[];
  page: number;
  pageSize: number;
}): Promise<{ products: StoreProduct[]; count: number }> => {
  const response = await medusa.store.product.list({
    category_id: categoryId,
    limit: pageSize,
    offset: page === 1 ? 0 : page * pageSize,
    ...buildTagFilters(filters),
    fields: "*variants.calculated_price",
  });

  return response;
};

export const ProductGridShell = ({
  initialData,
  initialCount,
  filterOptions,
  filterCounts,
  categoryId,
  name,
}: {
  initialData: StoreProduct[];
  initialCount: number;
  filterOptions?: Record<string, ActiveFilter[]>;
  filterCounts?: Record<string, number>;
  categoryId: string;
  name: string;
}) => {
  const pageSize = 25;
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(initialCount);
  const [products, setProducts] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    // set page to 0 every time filters change
    if (filters.length === 0) {
      // if no filters, set page to 1 and revert to initial data
      setPage(1);
      setProducts(initialData);
      setCount(initialCount);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setPage(1);
    fetchProducts({ categoryId, filters, page, pageSize })
      .then((data) => {
        console.log("fetched data", data);
        setProducts(data.products);
        setCount(data.count);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [filters, page]);

  useEffect(() => {
    if (windowWidth > 1024) {
      setIsDrawerOpen(false);
    }
  }, [windowWidth]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-1.5">
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
              {name}
            </Text>
          </div>
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
            />
          )}
          <div className={clx("w-full", isLoading && "pointer-events-none animate-pulse")}>
            {products.length > 0 ? (
              <div className="space-y-4">
                <ProductGrid products={products} />
                {count > pageSize && (
                  <CommandBar open={true}>
                    <CommandBar.Bar>
                      <CommandBar.Value>
                        Page {page} of {Math.ceil(count / pageSize)}
                      </CommandBar.Value>
                      <CommandBar.Seperator />
                      <CommandBar.Command
                        action={() => {
                          if (page === 1) return;
                          setPage(page - 1);
                        }}
                        label="Prev"
                        shortcut="H"
                      />
                      <CommandBar.Seperator />
                      <CommandBar.Command
                        action={() => {
                          if (page === Math.ceil(count / pageSize)) return;
                          setPage(page + 1);
                        }}
                        label="Next"
                        shortcut="L"
                      />
                    </CommandBar.Bar>
                  </CommandBar>
                )}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
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
