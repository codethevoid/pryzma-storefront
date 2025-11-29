// import { cdnUrl } from "@/utils/s3";

type NavItem = {
  label: string;
  value: string;
  href: string;
  dropdown?: Record<string, { label: string; href: string; description?: string }[]>;
  highlight?: {
    label: string;
    href: string;
    image: string;
    description: string;
  }[];
};

export const navItems: NavItem[] = [
  // {
  //   label: "Switches",
  //   value: "switches",
  //   href: "/products/switches",
  //   dropdown: {
  //     "Switch-types": [
  //       {
  //         label: "Linear switches",
  //         description: "The most popular switch type.",
  //         href: "/collections/linear-switches",
  //       },
  //       {
  //         label: "Tactile switches",
  //         href: "/collections/tactile-switches",
  //         description: "Bump feedback when pressed.",
  //       },
  //       {
  //         label: "Clicky switches",
  //         href: "/collections/clicky-switches",
  //         description: "Audible click feedback when pressed.",
  //       },
  //       {
  //         label: "Silent switches",
  //         href: "/collections/silent-switches",
  //         description: "Switches with very low sound output.",
  //       },
  //       {
  //         label: "Magnetic switches",
  //         href: "/collections/magnetic-switches",
  //         description: "Switches controlled by magnetic sensors.",
  //       },
  //     ],
  //     "Switch-brands": [
  //       { label: "Akko", href: "/collections/akko-switches" },
  //       { label: "BSUN", href: "/collections/bsun-switches" },
  //       { label: "Cherry", href: "/collections/cherry-switches" },
  //       { label: "Gateron", href: "/collections/gateron-switches" },
  //       { label: "Geon", href: "/collections/geon-switches" },
  //       { label: "HMX", href: "/collections/hmx-switches" },
  //       { label: "KTT", href: "/collections/ktt-switches" },
  //       { label: "Pryzma", href: "/collections/pryzma-switches" },
  //       { label: "Tecsee", href: "/collections/tecsee-switches" },
  //     ],
  //   },
  //   highlight: [
  //     {
  //       label: "Gateron Melodic",
  //       href: "/products/switches/gateron-melodic-switches",
  //       image: `${cdnUrl}/uploads/gateron-melodic-clicky-switches-1-01JN6B3VJRW6HMC6MGQX5SAMKF.webp`,
  //       description: "A clicky switch with a unique sound.",
  //     },
  //   ],
  // },
  // {
  //   label: "Accessories",
  //   value: "accessories",
  //   href: "/products/accessories",
  //   dropdown: {
  //     Accessories: [
  //       {
  //         label: "Lubricants",
  //         href: "/collections/lubricants",
  //         description: "For a smooth typing experience.",
  //       },
  //       {
  //         label: "Stabilizers",
  //         href: "/collections/stabilizers",
  //         description: "Fasten your larger keycaps.",
  //       },
  //       {
  //         label: "Switch films",
  //         href: "/collections/switch-films",
  //         description: "Tighten your switch housings.",
  //       },
  //       {
  //         label: "Tools",
  //         href: "/collections/tools",
  //         description: "For your keyboard maintenance.",
  //       },
  //       {
  //         label: "Springs",
  //         href: "/collections/springs",
  //         description: "Customize your switch springs",
  //       },
  //     ],
  //   },
  //   highlight: [
  //     {
  //       label: "Lubricants",
  //       href: "/collections/lubricants",
  //       image: `${cdnUrl}/uploads/IMG_2410-01JMQZQ8BXG7A2JFKSAFWC3Y4G.webp`,
  //       description:
  //         "Get your keyboard to perform at its best by lubing your switches, springs, and stabilizers.",
  //     },
  //     {
  //       label: "Durock switch films",
  //       href: "/products/accessories/durock-switch-films",
  //       image: `${cdnUrl}/uploads/IMG_3291-01JMQZRTHKWXQZ46DSZJNREHP3.webp`,
  //       description:
  //         "Switch films help tighten your switch housings which can improve stem wobble and acoustics.",
  //     },
  //   ],
  // },
  {
    label: "Java",
    value: "java",
    href: "/products/switches/pryzma-java-switches",
  },
  {
    label: "Seafoam",
    value: "seafoam",
    href: "/products/switches/pryzma-seafoam-switches",
  },
  // {
  //   label: "Samples",
  //   value: "samples",
  //   href: "/products/samples",
  // },

  // {
  //   label: "Bundle",
  //   value: "bundle",
  //   href: "/products/bundles/starter-bundle",
  // },
];
