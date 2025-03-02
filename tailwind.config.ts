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
      keyframes: {
        "slide-from-left": {
          "0%": { transform: "translateX(12px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-from-right": {
          "0%": { transform: "translateX(-12px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-from-top": {
          "0%": { transform: "translateY(-12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-from-left": "slide-from-left 200ms ease-out",
        "slide-from-right": "slide-from-right 200ms ease-out",
        "slide-from-top": "slide-from-top 200ms ease-out",
      },
    },
  },

  plugins: [require("tailwind-scrollbar-hide"), require("@tailwindcss/typography")],
  presets: [require("@medusajs/ui-preset")],
} satisfies Config;
