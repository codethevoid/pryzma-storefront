import { Metadata } from "next";
import { cdnUrl } from "./s3";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  other?: Record<string, string>;
};

export const constructMetadata = ({
  title = `Pryzma - Your Premium Source for Mechanical Keyboard Switches`,
  description = `Pryzma is your premium source for mechanical keyboard switches. We offer a wide range of switches, lubricants, switch samples, and accessories.`,
  image = `${cdnUrl}/uploads/IMG_3607-01JMQYA154E01PG23XQDT66RGW.webp`,
  other = {},
}: Props): Metadata => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: image,
      creator: "@pryzmadotio",
    },
    icons: [
      {
        rel: "apple-touch-icon",
        sizes: "32x32",
        url: `${cdnUrl}/logos/favicons/apple-touch-icon.png`,
      },
      {
        rel: "android-chrome",
        sizes: "192x192",
        url: `${cdnUrl}/logos/favicons/android-chrome-192x192.png`,
      },
      {
        rel: "android-chrome",
        sizes: "512x512",
        url: `${cdnUrl}/logos/favicons/android-chrome-512x512.png`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: `${cdnUrl}/logos/favicons/favicon-32x32.png`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: `${cdnUrl}/logos/favicons/favicon-16x16.png`,
      },
    ],
    metadataBase: new URL("https://pryzma.io"),
  };
};
