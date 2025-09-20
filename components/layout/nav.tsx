"use client";

import Image from "next/image";
import NextLink from "next/link";
import { clx, Drawer, IconButton, Text } from "@medusajs/ui";
import { BarsThree, ShoppingBag } from "@medusajs/icons";
import { useCart } from "../context/cart";
import { Cart } from "../ui/cart";
import { useEffect, useRef, useState } from "react";
import { useWindowWidth } from "@react-hook/window-size";
import { ThemeToggle } from "../ui/theme-toggle";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cdnUrl } from "@/utils/s3";
import { NavDropdown } from "./nav-dropdown";
import { navItems } from "@/lib/nav-items";
import { Search } from "../ui/search";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import { RainbowButton } from "../magicui/rainbow-button";

const CalloutBanner = () => {
  return (
    <div className="sticky top-[47px] z-50 h-9 w-full border-b bg-zinc-50 dark:border-white/15 dark:bg-zinc-900 md:top-[45px]">
      {/*<div className="relative size-full overflow-hidden">
        <FlickeringGrid
          className="absolute inset-0 hidden size-full dark:block"
          color="#fff"
          height={38}
          width={width + 6}
          gridGap={1.5}
          squareSize={1.5}
          maxOpacity={0.1}
        />

        <FlickeringGrid
          className="absolute inset-0 size-full dark:hidden"
          color="#000"
          height={38}
          width={width + 6}
          gridGap={1.5}
          squareSize={1.5}
          maxOpacity={0.1}
        />
      </div>*/}
      <div className="absolute inset-0 flex items-center justify-center gap-3">
        <Text size="small" weight="plus">
          Boring QR codes? Never again!
        </Text>
        <RainbowButton
          className="h-[26px] rounded-full px-2 text-[0.825rem] shadow-lg"
          variant="outline"
          asChild
          onClick={() => {
            track("Try Qryptic", {
              label: "Try now",
              timestamp: new Date().toISOString(),
            });
          }}
        >
          <a href="https://qryptic.io" target="_blank">
            Try now
          </a>
        </RainbowButton>
      </div>
    </div>
  );
};

export const Nav = () => {
  const { setIsOpen, cart } = useCart();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [shouldShowDropdown, setShouldShowDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [mobileSubDropdown, setMobileSubDropdown] = useState<string | null>(null);
  const [lastDropdown, setLastDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const width = useWindowWidth();
  const path = usePathname();

  const handleMouseEnter = (value: string | null, shouldShow: boolean) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    if (openDropdown !== value || shouldShowDropdown !== shouldShow) {
      setOpenDropdown(value);
      if (shouldShowDropdown) {
        setLastDropdown(value);
      }
      setShouldShowDropdown(shouldShow);
    }
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShouldShowDropdown(false);
      setOpenDropdown(null);
      setLastDropdown(null);
    }, 150);
  };

  useEffect(() => {
    if (width > 768) {
      setIsMobileNavOpen(false);
    }
  }, [width]);

  if (path.includes("checkout")) return null;

  return (
    <>
      <div
        className={clx(
          "sticky top-0 z-[90] border-b bg-background px-4 py-0 transition-colors duration-200 max-md:py-2",
          shouldShowDropdown && "bg-background dark:bg-black",
        )}
      >
        <NavDropdown
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          lastDropdown={lastDropdown}
          setLastDropdown={setLastDropdown}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          shouldShowDropdown={shouldShowDropdown}
          setShouldShowDropdown={setShouldShowDropdown}
        />
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          <div className="relative flex items-center gap-3">
            <div className="shrink-0 rounded-md border bg-zinc-100 p-0.5 shadow-sm dark:bg-zinc-800">
              <NextLink href="/">
                <Image
                  src={`${cdnUrl}/logos/pryzma.png`}
                  alt="pryzma logo"
                  width={500}
                  height={500}
                  quality={100}
                  className="size-6 rounded"
                />
              </NextLink>
            </div>
            <div className="flex items-center max-md:hidden">
              {navItems.map((item) => (
                <NextLink
                  key={item.value}
                  className="flex items-center"
                  href={item.href}
                  onMouseEnter={() =>
                    handleMouseEnter(
                      item.dropdown ? item.value : null,
                      item.dropdown ? true : false,
                    )
                  }
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    handleMouseLeave();
                    track("nav-item-click", {
                      label: item.label,
                      href: item.href,
                    });
                  }}
                >
                  <Text
                    // weight="plus"
                    size="small"
                    className={clx(
                      "flex h-[44px] items-center gap-0.5 px-3 text-subtle-foreground transition-colors hover:text-foreground",
                      openDropdown === item.value && shouldShowDropdown && "text-foreground",
                    )}
                  >
                    <span>{item.label}</span>
                    {item.dropdown && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={clx(
                          "relative top-[1px] size-4 rounded-md text-subtle-foreground transition-transform",
                          openDropdown === item.value && shouldShowDropdown && "rotate-180",
                        )}
                      >
                        <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                      </svg>
                    )}
                  </Text>
                </NextLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* <IconButton size="small" variant="transparent">
              <MagnifyingGlass />
            </IconButton>
            <IconButton size="small" variant="transparent">
              <User />
            </IconButton> */}
            <Search />
            <div className="relative">
              <IconButton
                size="small"
                variant="transparent"
                onClick={() => setIsOpen(true)}
                aria-label="Open shopping cart"
              >
                <ShoppingBag />
              </IconButton>
              {(cart?.items?.length || 0) > 0 && (
                <span className="absolute right-0.5 top-0.5 size-[5px] rounded-full bg-[rgba(59,130,246,1)] ring-[2px] ring-[rgba(59,130,246,0.2)] dark:bg-[rgba(96,165,250,1)] dark:ring-[rgba(59,130,246,0.25)]"></span>
              )}
            </div>
            <IconButton
              size="small"
              variant="transparent"
              className="hidden max-md:inline-flex"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <BarsThree />
            </IconButton>
          </div>
        </div>
      </div>
      {(path.includes("generate") || path === "/qr") && <CalloutBanner />}
      <Cart />
      <Drawer
        open={isMobileNavOpen}
        onOpenChange={(open: boolean) => {
          setIsMobileNavOpen(open);
          setTimeout(() => {
            setMobileDropdown(null);
            setMobileSubDropdown(null);
          }, 150);
        }}
      >
        <Drawer.Content className="z-[9999]" aria-describedby={undefined}>
          <Drawer.Header>
            <VisuallyHidden>
              <Drawer.Title>Navigation</Drawer.Title>
            </VisuallyHidden>
            <div className="relative top-[2px] shrink-0 rounded-md border bg-zinc-100 p-0.5 shadow-sm dark:bg-zinc-800">
              <NextLink href="/" onClick={() => setIsMobileNavOpen(false)}>
                <Image
                  src={`${cdnUrl}/logos/pryzma.png`}
                  alt="pryzma logo"
                  width={500}
                  height={500}
                  quality={100}
                  className="size-6 rounded"
                />
              </NextLink>
            </div>
          </Drawer.Header>
          <Drawer.Body className="px-0 pt-0">
            {mobileDropdown === "switches" && (
              <SwitchesMobileDropdown
                setMobileDropdown={setMobileDropdown}
                setMobileSubDropdown={setMobileSubDropdown}
                mobileSubDropdown={mobileSubDropdown}
                setIsMobileNavOpen={setIsMobileNavOpen}
              />
            )}
            {!mobileDropdown &&
              navItems.map((item) =>
                item.dropdown && Object.keys(item.dropdown).length > 1 ? (
                  <div
                    role="button"
                    key={item.href}
                    className="group flex cursor-pointer items-center justify-between border-b px-6 py-2.5"
                    onClick={() => setMobileDropdown(item.value)}
                  >
                    <Text size="small">{item.label}</Text>
                    <ChevronRight />
                  </div>
                ) : item.dropdown ? (
                  <div key={item.href}>
                    <div
                      role="button"
                      className="flex w-full items-center justify-between border-b px-6 py-2.5"
                      onClick={() =>
                        setMobileSubDropdown(mobileSubDropdown === item.value ? null : item.value)
                      }
                    >
                      <Text size="small" className="capitalize">
                        {item.label}
                      </Text>
                      <ChevronDown
                        className={mobileSubDropdown === item.value ? "rotate-180" : ""}
                      />
                    </div>
                    <div
                      className={clx(
                        "grid transition-all",
                        mobileSubDropdown === item.value ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        {item.dropdown[Object.keys(item.dropdown)[0]].map((value) => (
                          <div
                            key={value.href}
                            className="group border-b bg-zinc-50 dark:bg-zinc-900/50"
                            onClick={() => {
                              setIsMobileNavOpen(false);
                              setMobileDropdown(null);
                              setMobileSubDropdown(null);
                            }}
                          >
                            <NextLink
                              href={value.href}
                              className="flex items-center justify-between px-6 py-2.5"
                            >
                              <Text size="small">{value.label}</Text>
                              <ChevronRight />
                            </NextLink>
                          </div>
                        ))}
                        <div
                          key={`shop-all-${item.href}`}
                          className="group border-b bg-zinc-50 dark:bg-zinc-900/50"
                          onClick={() => {
                            setIsMobileNavOpen(false);
                            setMobileDropdown(null);
                            setMobileSubDropdown(null);
                          }}
                        >
                          <NextLink
                            href={item.href}
                            className="flex items-center justify-between px-6 py-2.5"
                          >
                            <Text size="small">Shop all</Text>
                            <ChevronRight />
                          </NextLink>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={item.href}
                    className="group border-b"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <NextLink
                      href={item.href}
                      className="flex items-center justify-between px-6 py-2.5"
                    >
                      <Text size="small">{item.label}</Text>
                      <ChevronRight />
                    </NextLink>
                  </div>
                ),
              )}
            {!mobileDropdown && (
              <div className="flex h-[42px] items-center justify-between border-b px-6">
                <Text size="small">Theme</Text>
                <ThemeToggle />
              </div>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </>
  );
};

const SwitchesMobileDropdown = ({
  setMobileDropdown,
  setMobileSubDropdown,
  mobileSubDropdown,
  setIsMobileNavOpen,
}: {
  setMobileDropdown: (dropdown: string | null) => void;
  setMobileSubDropdown: (dropdown: string | null) => void;
  mobileSubDropdown: string | null;
  setIsMobileNavOpen: (open: boolean) => void;
}) => {
  return (
    <div>
      <div
        className="border-bottom cursor-pointer border-b px-6 py-2.5"
        onClick={() => setMobileDropdown(null)}
      >
        <Text size="small" className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
          <ChevronLeft /> Go back
        </Text>
      </div>
      <div
        className="group border-b"
        onClick={() => {
          setIsMobileNavOpen(false);
          setMobileDropdown(null);
          setMobileSubDropdown(null);
        }}
      >
        <NextLink
          href="/products/switches"
          className="flex items-center justify-between px-6 py-2.5"
        >
          <Text size="small">Shop all switches</Text>
          <ChevronRight />
        </NextLink>
      </div>
      {Object.entries(navItems.find((item) => item.value === "switches")?.dropdown || {}).map(
        ([key, value]) => (
          <div key={key}>
            <div
              role="button"
              className="flex w-full items-center justify-between border-b px-6 py-2.5"
              onClick={() => setMobileSubDropdown(mobileSubDropdown === key ? null : key)}
            >
              <Text size="small" className="capitalize">
                {key.split("-")[1]}
              </Text>
              <ChevronDown className={mobileSubDropdown === key ? "rotate-180" : ""} />
            </div>
            <div
              className={clx(
                "grid transition-all",
                mobileSubDropdown === key ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                {value.map((item) => (
                  <div
                    key={item.href}
                    className="group border-b bg-zinc-50 dark:bg-zinc-900/50"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      setMobileDropdown(null);
                      setMobileSubDropdown(null);
                    }}
                  >
                    <NextLink
                      href={item.href}
                      className="flex items-center justify-between px-6 py-2.5"
                    >
                      <Text size="small">{item.label}</Text>
                      <ChevronRight />
                    </NextLink>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
};

const ChevronRight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
    >
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
    </svg>
  );
};

const ChevronLeft = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4"
    >
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
    </svg>
  );
};

const ChevronDown = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clx("size-4 transition-all", className)}
    >
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
    </svg>
  );
};
