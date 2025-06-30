import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/components/context/cart";
import { Toaster, TooltipProvider } from "@medusajs/ui";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      disableTransitionOnChange
      defaultTheme="light"
      attribute="class"
      enableSystem={false}
    >
      <TooltipProvider>
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};
