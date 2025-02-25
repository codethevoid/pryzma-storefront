import { SWITCH_FILTER_OPTIONS } from "./filter-options";
import { cdnUrl } from "@/utils/s3";

type CategoryData = {
  filters?: Record<string, { category: string; label: string; value: string }[]>;
  description: string;
  meta: {
    title: string;
    description: string;
    image: string;
  };
  quickAdd?: boolean;
};

export const CATEGORY_DATA: Record<string, CategoryData> = {
  "gateron-switches": {
    description: "Shop Gateron switches from linear and tactile.",
    meta: {
      title: "Gateron Switches - Pryzma",
      description: "Shop the most popular Gateron switches.",
      image: `${cdnUrl}/uploads/IMG_2422-01JMQY5869MKBB3MPFP7ZHKPH1.webp`,
    },
  },
  "linear-switches": {
    description: "Shop linear switches from Gateron, KTT, and more.",
    meta: {
      title: "Linear Switches - Pryzma",
      description: "Shop linear switches from Gateron, KTT, and more.",
      image: `${cdnUrl}/uploads/IMG_2995-01JMQWGM80DER0FV9MAVY0YJ6A.webp`,
    },
  },
  "best-sellers": {
    description: "Shop the best selling products.",
    meta: {
      title: "Best Sellers - Pryzma",
      description: "Shop the best selling products.",
      image: `${cdnUrl}/uploads/IMG_3405-01JMQZ73D13NYF9FMMXCD9WWMM.webp`,
    },
  },
};

export const COLLECTION_DATA: Record<string, CategoryData> = {
  switches: {
    filters: SWITCH_FILTER_OPTIONS,
    description: "Shop mechanical keyboard switches.",
    meta: {
      title: "Switches - Pryzma",
      description:
        "Premium mechanical switches for keyboards from linear, tactile, clicky, and silent. Popular brands by Akko, Gateron, Tecsee, KTT, Pryzma, and more.",
      image: `${cdnUrl}/uploads/IMG_2995-01JM8T9BGB3NX9XYQ428RC5Y8G.JPG`,
    },
  },
  samples: {
    filters: SWITCH_FILTER_OPTIONS,
    description: "Build your own custom switch sampler.",
    meta: {
      title: "Build Your Custom Switch Sampler - Pryzma",
      description:
        "Browse through our wide range of mechanical keyboard switches and build your own custom sampler.",
      image: `${cdnUrl}/featured/IMG_2855.JPG`,
    },
    quickAdd: true,
  },
  lubricants: {
    description: "Browse our collection of lubricants.",
    meta: {
      title: "Lubricants - Pryzma",
      description:
        "Lubricants from Krytox grease to oil lubricants for your keyboard switches and other components.",
      image: `${cdnUrl}/uploads/IMG_2410-01JM8W6JZF3ND2BRKXGG13AWRF.JPG`,
    },
  },
  accessories: {
    description: "Browse our collection of accessories.",
    meta: {
      title: "Accessories - Pryzma",
      description:
        "Browse our collection of accessories from stabilizers, tools, switch films, and more.",
      image: `${cdnUrl}/uploads/IMG_3291-01JMA3G265CDPHTEVCG5762KS3.JPG`,
    },
  },
};
