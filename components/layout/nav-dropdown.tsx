"use client";

import { clx, Text } from "@medusajs/ui";
import NextLink from "next/link";
import { navItems } from "@/lib/nav-items";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { TriangleRightMini } from "@medusajs/icons";

export const NavDropdown = ({
  openDropdown,
  lastDropdown,
  handleMouseEnter,
  handleMouseLeave,
  shouldShowDropdown,
  setShouldShowDropdown,
  setOpenDropdown,
  setLastDropdown,
}: {
  openDropdown: string | null;
  lastDropdown: string | null;
  handleMouseEnter: (value: string, shouldShow: boolean) => void;
  handleMouseLeave: () => void;
  shouldShowDropdown: boolean;
  setShouldShowDropdown: (shouldShow: boolean) => void;
  setOpenDropdown: (value: string | null) => void;
  setLastDropdown: (value: string | null) => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [contentRef, openDropdown, shouldShowDropdown]);

  return (
    <>
      <div
        className={clx(
          "pointer-events-none fixed inset-0 top-[45px] z-[9998] bg-black/60 opacity-0 transition-opacity duration-200 ease-out dark:bg-black/30",
          shouldShowDropdown && "pointer-events-auto opacity-100",
        )}
      />
      <div
        className={clx(
          "absolute left-0 top-[45px] z-[9999] grid h-0 w-full bg-zinc-50 transition-all duration-200 ease-out dark:bg-zinc-900/50",
          shouldShowDropdown && `border-b bg-background dark:bg-black`,
          !openDropdown && "pointer-events-none",
          !shouldShowDropdown && "pointer-events-none",
        )}
        style={{ height: shouldShowDropdown ? `${contentHeight}px` : 0 }}
        onMouseEnter={() => handleMouseEnter(openDropdown as string, true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden">
          <div className="min-h-0">
            <div className="px-4 pb-10 pt-6" ref={contentRef}>
              {openDropdown === "switches" && (
                <div
                  className={clx(
                    "mx-auto grid max-w-screen-xl grid-cols-3 gap-10 pl-[50px] max-lg:grid-cols-2",
                    !lastDropdown && shouldShowDropdown
                      ? "animate-slide-from-top"
                      : lastDropdown === "accessories" && shouldShowDropdown
                        ? "animate-slide-from-left"
                        : "animate-slide-from-right",
                    !shouldShowDropdown && "!opacity-0 transition-opacity",
                  )}
                >
                  <div className="space-y-2">
                    <NavItemHeader label="Switch types" />
                    <div className="-ml-2.5">
                      {navItems
                        .find((item) => item.value === "switches")
                        ?.dropdown?.[
                          "Switch-types"
                        ].map((link) => <NavItem key={link.href} {...link} setLastDropdown={setLastDropdown} setOpenDropdown={setOpenDropdown} setShouldShowDropdown={setShouldShowDropdown} />)}
                    </div>
                  </div>
                  <div className="space-y-[14px]">
                    <NavItemHeader label="Switch brands" />
                    <div>
                      {navItems
                        .find((item) => item.value === "switches")
                        ?.dropdown?.[
                          "Switch-brands"
                        ].map((link) => <NavLinkItem key={link.href} {...link} setLastDropdown={setLastDropdown} setOpenDropdown={setOpenDropdown} setShouldShowDropdown={setShouldShowDropdown} />)}
                    </div>
                  </div>
                  {navItems
                    .find((item) => item.value === "switches")
                    ?.highlight?.map((link) => (
                      <div key={link.href} className={clx("space-y-2 max-lg:hidden")}>
                        <NavItemHeader
                          label={link.label}
                          href={link.href}
                          setShouldShowDropdown={setShouldShowDropdown}
                          setOpenDropdown={setOpenDropdown}
                          setLastDropdown={setLastDropdown}
                        />
                        <NavHighlightItem {...link} />
                      </div>
                    ))}
                </div>
              )}
              {openDropdown === "accessories" && (
                <div
                  className={clx(
                    "mx-auto grid max-w-screen-xl grid-cols-3 gap-10 pl-[50px] max-lg:grid-cols-2",
                    !lastDropdown && shouldShowDropdown
                      ? "animate-slide-from-top"
                      : lastDropdown === "switches" && shouldShowDropdown
                        ? "animate-slide-from-right"
                        : "animate-slide-from-left",
                    !shouldShowDropdown && "!opacity-0 transition-opacity",
                  )}
                >
                  <div className="space-y-2">
                    <NavItemHeader label="Accessories" />
                    <div className="-ml-2.5">
                      {navItems
                        .find((item) => item.value === "accessories")
                        ?.dropdown?.[
                          "Accessories"
                        ].map((link) => <NavItem key={link.href} {...link} setLastDropdown={setLastDropdown} setOpenDropdown={setOpenDropdown} setShouldShowDropdown={setShouldShowDropdown} />)}
                    </div>
                  </div>
                  {navItems
                    .find((item) => item.value === "accessories")
                    ?.highlight?.map((link, i) => (
                      <div key={link.href} className={clx("space-y-2", i === 1 && "max-lg:hidden")}>
                        <NavItemHeader
                          label={link.label}
                          href={link.href}
                          setShouldShowDropdown={setShouldShowDropdown}
                          setOpenDropdown={setOpenDropdown}
                          setLastDropdown={setLastDropdown}
                        />
                        <NavHighlightItem {...link} />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const NavHighlightItem = ({
  label,
  image,
  description,
}: {
  label: string;
  image: string;
  description: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="aspect-[2/1.1] overflow-hidden rounded-md">
        <Image
          src={image}
          alt={label}
          width={1000}
          height={550}
          className="h-full w-full object-cover"
        />
      </div>
      <Text size="small" className="text-subtle-foreground">
        {description}
      </Text>
    </div>
  );
};

const NavItemHeader = ({
  label,
  href,
  setShouldShowDropdown,
  setOpenDropdown,
  setLastDropdown,
}: {
  label: string;
  href?: string;
  setShouldShowDropdown?: (shouldShow: boolean) => void;
  setOpenDropdown?: (value: string | null) => void;
  setLastDropdown?: (value: string | null) => void;
}) => {
  if (href) {
    return (
      <div className="flex items-center justify-between">
        <Text className="text-[11px] font-medium uppercase text-subtle-foreground dark:font-normal">
          {label}
        </Text>
        <NextLink
          href={href}
          className="group text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
          onClick={() => {
            setShouldShowDropdown?.(false);

            setTimeout(() => {
              setOpenDropdown?.(null);
              setLastDropdown?.(null);
            }, 150);
          }}
        >
          <Text size="xsmall" className="flex items-center gap-0.5">
            Shop now
            <TriangleRightMini className="relative top-[1px] transition-transform group-hover:translate-x-0.5" />
          </Text>
        </NextLink>
      </div>
    );
  }

  return (
    <Text className="text-[11px] font-medium uppercase text-subtle-foreground dark:font-normal">
      {label}
    </Text>
  );
};

const NavLinkItem = ({
  label,
  href,
  setShouldShowDropdown,
  setOpenDropdown,
  setLastDropdown,
}: {
  label: string;
  href: string;
  setShouldShowDropdown: (shouldShow: boolean) => void;
  setOpenDropdown: (value: string | null) => void;
  setLastDropdown: (value: string | null) => void;
}) => {
  return (
    <NextLink
      href={href}
      onClick={() => {
        setShouldShowDropdown(false);
        setTimeout(() => {
          setOpenDropdown(null);
          setLastDropdown(null);
        }, 150);
      }}
      className="text-subtle-foreground transition-colors hover:text-foreground"
    >
      <div className="py-0.5">
        <Text size="small">{label}</Text>
      </div>
    </NextLink>
  );
};

const NavItem = ({
  label,
  href,
  description,
  setShouldShowDropdown,
  setOpenDropdown,
  setLastDropdown,
}: {
  label: string;
  href: string;
  description?: string;
  setShouldShowDropdown: (shouldShow: boolean) => void;
  setOpenDropdown: (value: string | null) => void;
  setLastDropdown: (value: string | null) => void;
}) => {
  return (
    <NextLink
      href={href}
      onClick={() => {
        setShouldShowDropdown(false);
        setTimeout(() => {
          setOpenDropdown(null);
          setLastDropdown(null);
        }, 150);
      }}
    >
      <div className="group flex items-center justify-between space-x-2 rounded-md px-2.5 py-2 transition-colors hover:bg-ui-bg-component-hover">
        <div>
          <Text size="small">{label}</Text>
          {description && (
            <Text size="xsmall" className="text-subtle-foreground">
              {description}
            </Text>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4 -translate-x-0.5 text-subtle-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        >
          <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
        </svg>
      </div>
    </NextLink>
  );
};
