import { Metadata } from "next";
import { s3Url } from "./s3";

type Props = {
  title?: string;
  description?: string;
  image?: string;
};

export const constructMetadata = ({
  title = `Pryzma - Your Premium Source for Mechanical Keyboard Switches`,
  description = `Pryzma is your premium source for mechanical keyboard switches. We offer a wide range of switches, lubricants, switch samples, and accessories.`,
  image = `/quinn.jpeg`,
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
        url: `/apple-touch-icon.png`,
      },
      {
        rel: "android-chrome",
        sizes: "192x192",
        url: `/android-chrome-192x192.png`,
      },
      {
        rel: "android-chrome",
        sizes: "512x512",
        url: `/android-chrome-512x512.png`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: `/favicon-32x32.png`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: `/favicon-16x16.png`,
      },
    ],
    metadataBase: new URL("https://pryzma.io"),
  };
};
