import type { MDXComponents } from "mdx/types";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const useMDXComponents = (components: MDXComponents): MDXComponents => {
  return {
    h2: ({ children }) => (
      <h2 id={slugify(children.toString())} className="scroll-mt-6 text-[1.15rem]">
        {children}
      </h2>
    ),
    h3: ({ children }) => <h3 className="text-base !font-medium">{children}</h3>,
    // h2: ({ children }) => (
    //   <Heading
    //     level="h2"
    //     className="mb-2 mt-8 scroll-mt-6 text-lg first:mt-0"
    //     id={slugify(children.toString())}
    //   >
    //     {children}
    //   </Heading>
    // ),
    // h3: ({ children }) => (
    //   <Heading level="h3" className="mb-2 mt-8">
    //     {children}
    //   </Heading>
    // ),
    // p: ({ children }) => (
    //   <Text className="my-4 text-subtle-foreground first:mt-0 last:mb-0">{children}</Text>
    // ),
    // ul: ({ children }) => (
    //   <ul className="my-4 list-inside list-disc space-y-1 pl-4 text-sm text-subtle-foreground marker:text-zinc-300 last:mb-0 dark:marker:text-zinc-600">
    //     {children}
    //   </ul>
    // ),

    ...components,
  };
};
