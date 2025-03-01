import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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

export default nextConfig;
