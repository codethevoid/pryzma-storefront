"use client";

import Image from "next/image";
import NextLink from "next/link";
import { Button, Text, IconButton } from "@medusajs/ui";
import {
  ShoppingBag,
  User,
  MagnifyingGlass,
  ShoppingCart,
  BarsThree,
  ChevronRight,
} from "@medusajs/icons";
import { useCart } from "../context/cart";
import { Cart } from "../ui/cart";
import { Drawer } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { useWindowWidth } from "@react-hook/window-size";
import { ThemeToggle } from "../ui/theme-toggle";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const links = [
  {
    label: "Switches",
    href: "/products/switches",
  },
  {
    label: "Samples",
    href: "/products/samples",
  },
  {
    label: "Lubricants",
    href: "/products/lubricants",
  },
  {
    label: "Accessories",
    href: "/products/accessories",
  },
];

export const Nav = () => {
  const { setIsOpen } = useCart();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const width = useWindowWidth();

  useEffect(() => {
    if (width > 768) {
      setIsMobileNavOpen(false);
    }
  }, [width]);

  return (
    <>
      <div className="border-b px-4 py-2">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="shrink-0 rounded-md border bg-zinc-100 p-0.5 shadow-sm dark:bg-zinc-800">
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
            <div className="flex items-center gap-6 max-md:hidden">
              <NextLink href="/products/switches">
                <Text
                  // weight="plus"
                  size="small"
                  className="text-subtle-foreground transition-colors hover:text-foreground"
                >
                  Switches
                </Text>
              </NextLink>
              <NextLink href="/products/samples">
                <Text
                  // weight="plus"
                  size="small"
                  className="text-subtle-foreground transition-colors hover:text-foreground"
                >
                  Samples
                </Text>
              </NextLink>
              <NextLink href="/products/lubricants">
                <Text
                  // weight="plus"
                  size="small"
                  className="text-subtle-foreground transition-colors hover:text-foreground"
                >
                  Lubricants
                </Text>
              </NextLink>
              <NextLink href="/products/accessories">
                <Text
                  // weight="plus"
                  size="small"
                  className="text-subtle-foreground transition-colors hover:text-foreground"
                >
                  Accessories
                </Text>
              </NextLink>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* <IconButton size="small" variant="transparent">
              <MagnifyingGlass />
            </IconButton>
            <IconButton size="small" variant="transparent">
              <User />
            </IconButton> */}
            <IconButton size="small" variant="transparent" onClick={() => setIsOpen(true)}>
              <ShoppingBag />
            </IconButton>
            <IconButton
              size="small"
              variant="transparent"
              className="hidden max-md:inline-flex"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <BarsThree />
            </IconButton>
          </div>
        </div>
      </div>
      <Cart />
      <Drawer open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <Drawer.Content className="z-[9999]">
          <Drawer.Header>
            <VisuallyHidden>
              <Drawer.Title>Navigation</Drawer.Title>
            </VisuallyHidden>
            <div className="relative top-[2px] shrink-0 rounded-md border bg-zinc-100 p-0.5 shadow-sm dark:bg-zinc-800">
              <NextLink href="/" onClick={() => setIsMobileNavOpen(false)}>
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
          </Drawer.Header>
          <Drawer.Body className="px-0 pt-0">
            {links.map((link) => (
              <div
                key={link.href}
                className="group border-b"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <NextLink
                  href={link.href}
                  className="flex items-center justify-between px-6 py-2.5"
                >
                  <Text size="small">{link.label}</Text>
                  {/* <ChevronRight className="-translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
                  </svg>
                </NextLink>
              </div>
            ))}
            <div className="flex h-[42px] items-center justify-between border-b px-6">
              <Text>Theme</Text>
              <ThemeToggle />
            </div>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </>
  );
};
