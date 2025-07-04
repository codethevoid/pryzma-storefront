import "./globals.css";
import { Providers } from "./providers";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Viewport } from "next";
import { layoutJsonLd } from "@/utils/construct-jsonld";
import { validateEnv } from "@/utils/env";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

validateEnv();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(layoutJsonLd) }}
        />
        <Providers>
          <Nav />
          {children}
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
        {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId="G-FLWT5LZXY7" />}
      </body>
    </html>
  );
}
