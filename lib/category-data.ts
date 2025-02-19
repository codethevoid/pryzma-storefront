import { SWITCH_FILTER_OPTIONS } from "./filter-options";
import { s3Url } from "@/utils/s3";

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
  switches: {
    filters: SWITCH_FILTER_OPTIONS,
    description: "Shop mechanical keyboard switches.",
    meta: {
      title: "Switches - Pryzma",
      description:
        "Premium mechanical switches for keyboards from linear, tactile, clicky, and silent. Popular brands by Akko, Gateron, Tecsee, KTT, Pryzma, and more.",
      image: `${s3Url}/uploads/IMG_2995-01JM8T9BGB3NX9XYQ428RC5Y8G.JPG`,
    },
  },
  samples: {
    filters: SWITCH_FILTER_OPTIONS,
    description: "Build your own custom switch sampler.",
    meta: {
      title: "Build Your Custom Switch Sampler - Pryzma",
      description:
        "Browse through our wide range of mechanical keyboard switches and build your own custom sampler.",
      image: `${s3Url}/featured/IMG_2855.JPG`,
    },
    quickAdd: true,
  },
  lubricants: {
    description: "Browse our collection of lubricants.",
    meta: {
      title: "Lubricants - Pryzma",
      description:
        "Lubricants from Krytox grease to oil lubricants for your keyboard switches and other components.",
      image: `${s3Url}/uploads/IMG_2410-01JM8W6JZF3ND2BRKXGG13AWRF.JPG`,
    },
  },
  accessories: {
    description: "Browse our collection of accessories.",
    meta: {
      title: "Accessories - Pryzma",
      description:
        "Browse our collection of accessories from stabilizers, tools, switch films, and more.",
      image: `${s3Url}/uploads/IMG_3291-01JMA3G265CDPHTEVCG5762KS3.JPG`,
    },
  },
};
