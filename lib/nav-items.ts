type NavItem = {
  label: string;
  value: string;
  href: string;
  dropdown?: Record<string, { label: string; href: string; description?: string }[]>;
};

export const navItems: NavItem[] = [
  {
    label: "Switches",
    value: "switches",
    href: "/products/switches",
    dropdown: {
      "Switch-types": [
        {
          label: "Linear switches",
          description: "The most popular switch type.",
          href: "/collections/linear-switches",
        },
        {
          label: "Tactile switches",
          href: "/collections/tactile-switches",
          description: "Bump feedback when pressed.",
        },
        {
          label: "Clicky switches",
          href: "/collections/clicky-switches",
          description: "Audible click feedback when pressed.",
        },
        {
          label: "Silent switches",
          href: "/collections/silent-switches",
          description: "Switches with very low sound output.",
        },
      ],
      "Switch-brands": [
        { label: "Akko", href: "/collections/akko-switches" },
        { label: "Gateron", href: "/collections/gateron-switches" },
        { label: "KTT", href: "/collections/ktt-switches" },
        { label: "Pryzma", href: "/collections/pryzma-switches" },
        { label: "Tecsee", href: "/collections/tecsee-switches" },
      ],
    },
  },
  {
    label: "Samples",
    value: "samples",
    href: "/products/samples",
  },
  {
    label: "Lubricants",
    value: "lubricants",
    href: "/products/lubricants",
  },
  {
    label: "Accessories",
    value: "accessories",
    href: "/products/accessories",
  },
  {
    label: "Sale",
    value: "sale",
    href: "/collections/clearance-sale",
  },
];
