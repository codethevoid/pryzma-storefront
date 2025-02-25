import { StoreProduct } from "@medusajs/types";
import type {
  WithContext,
  Product,
  CollectionPage,
  Organization,
  WebSite,
  WebPage,
} from "schema-dts";
import { s3Url, cdnUrl } from "./s3";

const sortImages = (product: StoreProduct) => {
  const images =
    product.images
      ?.filter((img) => img.url !== product.thumbnail)
      .map((img) => img.url.replace(s3Url, cdnUrl)) || [];

  if (product.thumbnail) {
    images.unshift(product.thumbnail.replace(s3Url, cdnUrl));
  }

  return images;
};

export const constructProductPageJsonLd = (product: StoreProduct): WithContext<Product> => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: sortImages(product),
    description: product.description?.split("\n")[0],
    brand: {
      "@type": "Brand",
      name: product.subtitle || "Pryzma",
    },

    offers: {
      "@type": "Offer",
      seller: {
        "@type": "Organization",
        name: "Pryzma",
        url: "https://pryzma.io",
      },
      price: product.variants?.[0]?.calculated_price?.original_amount as number,
      priceCurrency: "USD",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        (product.variants?.[0]?.inventory_quantity || 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    url: `https://pryzma.io/products/${product.collection?.handle}/${product.handle}`,
  };
};

export const constructCategoryPageJsonLd = ({
  products,
  name,
  description,
  url,
  image,
}: {
  products: StoreProduct[];
  name: string;
  description: string;
  url: string;
  image: string;
}): WithContext<CollectionPage> => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    image,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        name: product.title,
        description: product.description?.split("\n")[0],
        image: sortImages(product),
        position: index + 1,
        url: `https://pryzma.io/products/${product.collection?.handle}/${product.handle}`,
      })),
    },
  };
};

export const websiteJsonLd: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://pryzma.io/#website",
  url: "https://pryzma.io",
  name: "Pryzma - Your Premium Source for Mechanical Keyboard Switches",
  description:
    "Pryzma is your premium source for mechanical keyboard switches. We offer a wide range of switches, lubricants, switch samples, and accessories.",
  inLanguage: "en-US",
};

export const organizationJsonLd: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://pryzma.io/#organization",
  name: "Pryzma",
  url: "https://pryzma.io",
  logo: `${cdnUrl}/logos/pryzma.png`,
  sameAs: [
    "https://x.com/pryzmadotio",
    "https://www.instagram.com/pryzma.io",
    "https://www.youtube.com/@pryzma_io",
    "https://www.threads.net/@pryzma.io",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@pryzma.io",
    availableLanguage: ["English"],
  },
  location: {
    "@type": "Place",
    name: "Ohio, USA",
  },
};

export const homePageJsonLd: WithContext<Omit<WebPage, "@context">> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://pryzma.io/#homepage",
  url: "https://pryzma.io",
  name: "Pryzma - Home",
  description:
    "Discover high quality mechanical keyboard switches, lubricants, and accessories at Pryzma.",
  isPartOf: { "@id": "https://pryzma.io/#website" },
  about: { "@id": "https://pryzma.io/#organization" },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${cdnUrl}/uploads/IMG_3607-01JMQYA154E01PG23XQDT66RGW.webp`,
  },
};

export const constructedLayoutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { ...websiteJsonLd, "@context": undefined },
    { ...organizationJsonLd, "@context": undefined },
  ],
};
