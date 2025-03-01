"use client";

import { Drawer, IconBadge, IconButton, Input, Text, Button } from "@medusajs/ui";
import { Loader, MagnifyingGlass, XMark } from "@medusajs/icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState, useRef, useEffect } from "react";
import { useSearch } from "@/hooks/swr/use-search";
import { useDebounceValue } from "@/hooks/utils/use-debounce-value";
import NextLink from "next/link";
import Image from "next/image";
import { cdnUrl, s3Url } from "@/utils/s3";
import { formatCurrency } from "@/utils/format-currency";

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounceValue(query, 300);
  const { products, isLoading } = useSearch(debouncedQuery);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.click();
      }, 150);
      return () => clearTimeout(timer);
    }

    setQuery("");
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        <IconButton variant="transparent" size="small" aria-label="Open search">
          <MagnifyingGlass />
        </IconButton>
      </Drawer.Trigger>
      <Drawer.Content className="z-[9999] overflow-hidden">
        <Drawer.Header>
          <VisuallyHidden>Search</VisuallyHidden>
          <Drawer.Title>
            <IconBadge className="relative top-[2px]">
              <MagnifyingGlass />
            </IconBadge>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="relative space-y-4 overflow-y-auto">
          <div className="sticky -top-4 z-10 -my-4 bg-background py-4">
            <Input
              placeholder="Search products..."
              type="search"
              ref={inputRef}
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>

          {isLoading || query !== debouncedQuery ? (
            <div className="flex h-40 items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : debouncedQuery && (products?.length || 0) > 0 ? (
            <div>
              {products?.map((product) => (
                <NextLink
                  href={`/products/${product.collection?.handle}/${product.handle}`}
                  key={product.id}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="group rounded-md p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 max-sm:hover:bg-transparent dark:max-sm:hover:bg-transparent">
                    <div className="flex space-x-4">
                      <div className="aspect-[1/1.2] w-14 overflow-hidden rounded-md border">
                        <Image
                          src={product.thumbnail?.replace(s3Url, cdnUrl) as string}
                          alt={product.title as string}
                          width={600}
                          height={600}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <Text weight="plus" size="small">
                          {product.title}
                        </Text>
                        <Text size="small" className="text-subtle-foreground">
                          {/* {formatCurrency(
                            "usd",
                            product.variants?.[0]?.calculated_price?.original_amount || 0,
                          )} */}
                          {product.variants &&
                            product.variants.length > 1 &&
                            product.variants.some(
                              (v) =>
                                v.calculated_price?.original_amount !==
                                product?.variants?.[0].calculated_price?.original_amount,
                            ) &&
                            "From "}
                          {formatCurrency(
                            "usd",
                            product.variants?.sort(
                              (a, b) =>
                                (a.calculated_price?.original_amount as number) -
                                (b.calculated_price?.original_amount as number),
                            )[0].calculated_price?.original_amount || 0,
                          )}
                        </Text>
                      </div>
                    </div>
                  </div>
                </NextLink>
              ))}
            </div>
          ) : debouncedQuery && (products?.length || 0) === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
                <IconBadge size="large" className="mx-auto">
                  <XMark />
                </IconBadge>
                <Text size="small" className="text-center">
                  No results found for &quot;{debouncedQuery}&quot;
                </Text>
                <Button size="small" onClick={() => setQuery("")}>
                  Clear search term
                </Button>
              </div>
            </div>
          ) : (
            <div></div> // maybe add a list of products here when the query is empty
          )}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
};
