"use client";

import { clx, Text } from "@medusajs/ui";
import NextLink from "next/link";
import { navItems } from "@/lib/nav-items";
import { useRef, useState, useEffect } from "react";

export const NavDropdown = ({
  openDropdown,

  handleMouseEnter,
  handleMouseLeave,
  shouldShowDropdown,
  setShouldShowDropdown,
}: {
  openDropdown: string | null;

  handleMouseEnter: (value: string, shouldShow: boolean) => void;
  handleMouseLeave: () => void;
  shouldShowDropdown: boolean;
  setShouldShowDropdown: (shouldShow: boolean) => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [shouldShowDropdown, contentRef, openDropdown]);

  return (
    <>
      <div
        className={clx(
          "pointer-events-none fixed inset-0 top-[45px] z-[9998] bg-black/50 opacity-0 transition-opacity duration-200 dark:bg-black/30",
          shouldShowDropdown && "pointer-events-auto opacity-100",
        )}
      />
      <div
        className={clx(
          "absolute left-0 top-[45px] z-[9999] grid h-0 w-full bg-zinc-50 transition-all duration-200 dark:bg-zinc-900/50",
          shouldShowDropdown && `border-b bg-background dark:bg-black`,
        )}
        style={{ height: shouldShowDropdown ? `${contentHeight}px` : 0 }}
        onMouseEnter={() => handleMouseEnter(openDropdown as string, true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden">
          <div className="min-h-0">
            <div className="px-4 py-6" ref={contentRef}>
              {openDropdown === "switches" && (
                <div className="mx-auto grid max-w-screen-xl grid-cols-3 gap-10 pl-[50px] max-lg:grid-cols-2">
                  <>
                    <div className="space-y-2">
                      <NavItemHeader label="Switch types" />
                      <div className="-ml-2.5">
                        {navItems
                          .find((item) => item.value === "switches")
                          ?.dropdown?.[
                            "Switch-types"
                          ].map((link) => <NavItem key={link.href} {...link} setShouldShowDropdown={setShouldShowDropdown} />)}
                      </div>
                    </div>
                    <div className="space-y-[14px]">
                      <NavItemHeader label="Switch brands" />
                      <div>
                        {navItems
                          .find((item) => item.value === "switches")
                          ?.dropdown?.[
                            "Switch-brands"
                          ].map((link) => <NavLinkItem key={link.href} {...link} setShouldShowDropdown={setShouldShowDropdown} />)}
                      </div>
                    </div>
                  </>
                </div>
              )}
              {/* {openDropdown === "samples" && <div>hello from switch dropdown</div>} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const NavItemHeader = ({ label }: { label: string }) => {
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
}: {
  label: string;
  href: string;

  setShouldShowDropdown: (shouldShow: boolean) => void;
}) => {
  return (
    <NextLink
      href={href}
      onClick={() => {
        setShouldShowDropdown(false);
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
}: {
  label: string;
  href: string;
  description?: string;
  setShouldShowDropdown: (shouldShow: boolean) => void;
}) => {
  return (
    <NextLink
      href={href}
      onClick={() => {
        setShouldShowDropdown(false);
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
