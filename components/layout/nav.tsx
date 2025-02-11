"use client";

import Image from "next/image";
import NextLink from "next/link";
import { Button, Text, IconButton } from "@medusajs/ui";
import { ShoppingBag, User, MagnifyingGlass, ShoppingCart } from "@medusajs/icons";
import { useCart } from "../context/cart";
import { Cart } from "../ui/cart";

export const Nav = () => {
  const { setIsOpen } = useCart();
  return (
    <>
      <div className="border-b px-4 py-2">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="rounded-md border bg-zinc-100 p-0.5 shadow-sm dark:bg-zinc-800">
              <NextLink href="/">
                <Image
                  src="/pryzma.png"
                  alt="pryzma logo"
                  width={20}
                  height={20}
                  quality={100}
                  className="rounded"
                />
              </NextLink>
            </div>
            <NextLink href="/switches">
              <Text
                weight="plus"
                size="small"
                className="text-subtle-foreground transition-colors hover:text-foreground"
              >
                Switches
              </Text>
            </NextLink>
            <NextLink href="/switch-sampler">
              <Text
                weight="plus"
                size="small"
                className="text-subtle-foreground transition-colors hover:text-foreground"
              >
                Sampler
              </Text>
            </NextLink>
            <NextLink href="/lubricants">
              <Text
                weight="plus"
                size="small"
                className="text-subtle-foreground transition-colors hover:text-foreground"
              >
                Lubricants
              </Text>
            </NextLink>
            <NextLink href="/accessories">
              <Text
                weight="plus"
                size="small"
                className="text-subtle-foreground transition-colors hover:text-foreground"
              >
                Accessories
              </Text>
            </NextLink>
          </div>
          <div className="flex items-center gap-1">
            <IconButton size="small" variant="transparent">
              <MagnifyingGlass />
            </IconButton>
            <IconButton size="small" variant="transparent">
              <User />
            </IconButton>
            <IconButton size="small" variant="transparent" onClick={() => setIsOpen(true)}>
              <ShoppingBag />
            </IconButton>
          </div>
        </div>
      </div>
      <Cart />
    </>
  );
};
