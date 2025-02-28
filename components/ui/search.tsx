"use client";

import { Drawer, IconBadge, IconButton, Input } from "@medusajs/ui";
import { MagnifyingGlass } from "@medusajs/icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState, useRef, useEffect } from "react";
export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        <IconButton variant="transparent" size="small">
          <MagnifyingGlass />
        </IconButton>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <VisuallyHidden>Search</VisuallyHidden>
          <Drawer.Title>
            <IconBadge className="relative top-[2px]">
              <MagnifyingGlass />
            </IconBadge>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Input placeholder="Search products..." type="search" ref={inputRef} />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
};
