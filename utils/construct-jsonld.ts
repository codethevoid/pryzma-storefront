import { StoreProduct } from "@medusajs/types";
import type {
  WithContext,
  Product,
  CollectionPage,
  Organization,
  WebSite,
  WebPage,
  FAQPage,
  Article,
  BlogPosting,
} from "schema-dts";
import { s3Url, cdnUrl } from "./s3";
import { BlogPostMeta } from "@/types";
import { authors } from "@/content/authors";

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
        (product.variants?.find((v) => v.inventory_quantity || 0 > 0)?.inventory_quantity || 0) > 0
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

export const layoutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://pryzma.io/#website",
      url: "https://pryzma.io",
      name: "Pryzma - Your Premium Source for Mechanical Keyboard Switches",
      description:
        "Pryzma is your premium source for mechanical keyboard switches. We offer a wide range of switches, lubricants, switch samples, and accessories.",
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": "https://pryzma.io/#organization",
      name: "Pryzma",
      description:
        "Pryzma is your premium source for mechanical keyboard switches. We offer a wide range of switches, lubricants, switch samples, and accessories.",
      email: "hello@pryzma.io",
      url: "https://pryzma.io",
      logo: `${cdnUrl}/logos/pryzma.png`,
      sameAs: [
        "https://x.com/pryzmadotio",
        "https://www.instagram.com/pryzma.io",
        "https://www.youtube.com/@pryzma_io",
        "https://www.threads.net/@pryzma.io",
      ],
      location: {
        "@type": "Place",
        name: "Ohio, USA",
      },
    },
  ],
};

export const constructFaqJsonLd = (
  faqs: { question: string; answer: string }[],
): WithContext<FAQPage> => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const constructBlogPostJsonLd = (post: BlogPostMeta): WithContext<BlogPosting> => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: new Date(post.published).toISOString(),
    ...(post.lastModified && {
      dateModified: new Date(post.lastModified).toISOString(),
    }),
    author: {
      "@type": "Person",
      name: authors[post.author].name,
      image: authors[post.author].image,
      jobTitle: authors[post.author].position,
    },
    publisher: {
      "@type": "Organization",
      name: "Pryzma",
      url: "https://pryzma.io",
      logo: {
        "@type": "ImageObject",
        url: `${cdnUrl}/logos/pryzma.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pryzma.io/blog/${post.slug}`,
    },
    url: `https://pryzma.io/blog/${post.slug}`,
    inLanguage: "en-US",
  };
};

export const constructBlogCategoryJsonLd = (
  category: string | undefined,
  posts: BlogPostMeta[],
): WithContext<CollectionPage> => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    headline: category
      ? `${category.charAt(0).toUpperCase() + category.slice(1).split("-").join(" ")} blog posts - Pryzma`
      : "Blog posts - Pryzma",
    description: `${category ? `${category.charAt(0).toUpperCase() + category.slice(1).split("-").join(" ")} b` : "B"}log posts from the Pryzma team and community. Discover the latest in the keyboard industry.`,
    url: `https://pryzma.io/blog${category ? `/${category}` : ""}`,
    publisher: {
      "@type": "Organization",
      name: "Pryzma",
      url: "https://pryzma.io",
      logo: {
        "@type": "ImageObject",
        url: `${cdnUrl}/logos/pryzma.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pryzma.io/blog${category ? `/${category}` : ""}`,
    },
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: new Date(post.published).toISOString(),
      ...(post.lastModified && {
        dateModified: new Date(post.lastModified).toISOString(),
      }),
      author: {
        "@type": "Person",
        name: authors[post.author].name,
        image: authors[post.author].image,
        jobTitle: authors[post.author].position,
      },
      url: `https://pryzma.io${post.slug}`,
    })),
    inLanguage: "en-US",
  };
};
