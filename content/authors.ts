export type Author = {
  name: string;
  image: string;
  position: string;
};

export const authors: Record<string, Author> = {
  "@ryan": {
    name: "Ryan Thomas",
    image: "https://cdn.pryzma.io/authors/ryan.jpg",
    position: "Founder & CEO",
  },
};
