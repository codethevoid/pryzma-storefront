import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-base)",
        foreground: "var(--fg-base)",
        "subtle-foreground": "var(--fg-subtle)",
        border: "var(--border-base)",
        "border-interactive": "var(--border-interactive)",
      },
    },
  },

  plugins: [require("tailwind-scrollbar-hide"), require("@tailwindcss/typography")],
  presets: [require("@medusajs/ui-preset")],
} satisfies Config;
