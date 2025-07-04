export type Filter = {
  label: string;
  value: string;
  category: string;
};

export type BlogPostMeta = {
  title: string;
  description: string;
  published: string;
  category: string;
  author: string;
  image: string;
  slug: string;
  lastModified?: string;
};
