export type Author = {
  name: string;
  image: string;
  position: string;
};

export const authors: Record<string, Author> = {
  "@pryzma": {
    name: "The Pryzma Team",
    image: "https://cdn.pryzma.io/logos/pryzma.png",
    position: "Pryzma Labs",
  },
};
