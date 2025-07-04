import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pryzma-medusa.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pryzma.io",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
