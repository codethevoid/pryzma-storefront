"use client";

import { IconButton } from "@medusajs/ui";
import { Sun, Moon } from "@medusajs/icons";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { setTheme } = useTheme();
  return (
    <div className="relative flex h-7 w-[56px] items-center rounded-full border bg-background">
      <IconButton
        name="theme-toggle-light"
        size="small"
        className="dark:text-muted-foreground absolute left-[-1px] h-7 w-7 shrink-0 rounded-full border bg-transparent text-foreground shadow-none hover:bg-transparent dark:border-transparent dark:hover:text-foreground"
        onClick={() => setTheme("light")}
      >
        <Sun />
      </IconButton>

      <IconButton
        name="theme-toggle-dark"
        size="small"
        className="text-muted-foreground absolute right-[-1px] h-7 w-7 shrink-0 rounded-full border border-transparent bg-transparent shadow-none hover:bg-transparent hover:text-foreground dark:border-border dark:text-foreground"
        onClick={() => setTheme("dark")}
      >
        <Moon />
      </IconButton>
    </div>
  );
};
