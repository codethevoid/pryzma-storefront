"use client";

import { Text, Checkbox, Label, Drawer, clx, Button } from "@medusajs/ui";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const Filter = ({
  options,
  activeFilters,
  setActiveFilters,
  filterCounts,
  isSidebarOpen,
  isDrawerOpen,
  setIsDrawerOpen,
  getFilteredProducts,
}: {
  options: Record<string, { category: string; label: string; value: string }[]>;
  activeFilters: { category: string; label: string; value: string }[];
  setActiveFilters: (filters: { category: string; label: string; value: string }[]) => void;
  filterCounts: Record<string, number>;
  isSidebarOpen: boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  getFilteredProducts: (
    filters: { category: string; label: string; value: string }[],
    newPage?: number,
  ) => void;
}) => {
  const searchParams = useSearchParams();

  const handleFilterChange = ({
    label,
    value,
    category,
  }: {
    label: string;
    value: string;
    category: string;
  }) => {
    if (activeFilters.some((filter) => filter.value === value)) {
      const newFilters = activeFilters.filter((filter) => filter.value !== value);
      setActiveFilters(newFilters);
      getFilteredProducts(newFilters);
      const params = new URLSearchParams(searchParams);
      if (newFilters.length) {
        params.set("filters", newFilters.map((filter) => filter.value).join(","));
        if (params.has("page")) params.delete("page");
      } else {
        params.delete("filters");
        if (params.has("page")) params.delete("page");
      }
      window.history.replaceState(null, "", `?${params.toString()}`);
    } else {
      setActiveFilters([...activeFilters, { label, value, category }]);
      getFilteredProducts([...activeFilters, { label, value, category }]);
      const params = new URLSearchParams(searchParams);
      params.set(
        "filters",
        [...activeFilters, { label, value, category }].map((filter) => filter.value).join(","),
      );
      if (params.has("page")) params.delete("page");
      window.history.replaceState(null, "", `?${params.toString()}`);
    }
  };

  useEffect(() => {
    const urlFilters = searchParams.get("filters")?.split(",") || [];
    const page = searchParams.get("page") || 1;
    if (urlFilters.length) {
      const initialFilters = urlFilters
        .map((value) => {
          // Find matching option to get its label
          for (const [, filterOptions] of Object.entries(options)) {
            const option = filterOptions.find((opt) => opt.value === value);
            if (option) return { label: option.label, value, category: option.category };
          }
          return null;
        })
        .filter((f): f is { label: string; value: string; category: string } => f !== null);

      setActiveFilters(initialFilters);
      getFilteredProducts(initialFilters, parseInt(page.toString(), 10));
    } else if (searchParams.has("page")) {
      getFilteredProducts([], parseInt(page.toString(), 10));
    }
  }, []);

  return (
    <>
      <div className={clx("space-y-4 max-lg:hidden", !isSidebarOpen && "hidden")}>
        <div
          className={clx(
            "h-fit min-w-[220px] space-y-5 rounded-md bg-zinc-50 p-4 shadow-borders-base dark:bg-zinc-900/50",
          )}
        >
          {Object.entries(options).map(([key, value]) => (
            <div key={key} className="space-y-1.5">
              <Text weight="plus" size="small" className="capitalize">
                {key.replace("_", " ")}
              </Text>
              <div className="space-y-1">
                {value.map(({ label, value, category }) => (
                  <div key={value} className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        id={value}
                        checked={activeFilters.some((filter) => filter.value === value)}
                        onCheckedChange={() => handleFilterChange({ label, value, category })}
                      />
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
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Filters</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="space-y-5 overflow-y-auto">
            {Object.entries(options).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <Text weight="plus" size="small" className="capitalize">
                  {key.replace("_", " ")}
                </Text>
                <div className="space-y-1">
                  {value.map(({ label, value, category }) => (
                    <div key={value} className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <Checkbox
                          id={value}
                          checked={activeFilters.some((filter) => filter.value === value)}
                          onCheckedChange={() => handleFilterChange({ label, value, category })}
                        />
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
          </Drawer.Body>
          <Drawer.Footer>
            <Button size="small" onClick={() => setIsDrawerOpen(false)}>
              Close
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  );
};
