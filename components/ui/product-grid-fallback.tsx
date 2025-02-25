import { IconButton, Text, Checkbox, Label } from "@medusajs/ui";
import { SidebarLeft, TriangleRightMini } from "@medusajs/icons";
import NextLink from "next/link";
import { StoreProduct } from "@medusajs/types";
import type { Filter as ActiveFilter } from "@/types";
import { ProductGrid } from "./product-grid";
import { clx } from "@medusajs/ui";

type Props = {
  initialData: StoreProduct[];
  filterOptions?: Record<string, ActiveFilter[]>;
  filterCounts?: Record<string, number>;
  name: string | undefined;
};

export const ProductGridFallback = ({ initialData, filterOptions, filterCounts, name }: Props) => {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-1.5">
          {filterOptions && (
            <div>
              <IconButton variant="transparent" size="small" className="flex max-lg:hidden">
                <SidebarLeft />
              </IconButton>

              <IconButton variant="transparent" size="small" className="hidden max-lg:flex">
                <SidebarLeft />
              </IconButton>
            </div>
          )}
          {name ? (
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
        <div className={"flex gap-4"}>
          {filterOptions && filterCounts && (
            <div
              className={clx(
                "h-fit min-w-[220px] space-y-5 rounded-md bg-zinc-50 p-4 shadow-borders-base dark:bg-zinc-900/50 max-lg:hidden",
              )}
            >
              {Object.entries(filterOptions).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <Text weight="plus" size="small" className="capitalize">
                    {key.replace("_", " ")}
                  </Text>
                  <div className="space-y-1">
                    {value.map(({ label, value }) => (
                      <div key={value} className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Checkbox id={value} />
                          <Label
                            htmlFor={value}
                            size="small"
                            className="capitalize text-subtle-foreground"
                          >
                            {label}
                          </Label>
                        </div>
                        <Text size="xsmall" className="text-subtle-foreground">
                          ({filterCounts[value]})
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="w-full">
            <div className="invisible">
              <ProductGrid products={initialData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
