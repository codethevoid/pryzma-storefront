import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/components/context/cart";
import { Toaster } from "@medusajs/ui";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      disableTransitionOnChange
      defaultTheme="light"
      attribute="class"
      enableSystem={false}
    >
      <CartProvider>
        {children}
        <Toaster position="bottom-right" />
      </CartProvider>
    </ThemeProvider>
  );
};
