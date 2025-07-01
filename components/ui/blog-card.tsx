import { BlogPostMeta } from "@/types";
import NextLink from "next/link";
import Image from "next/image";
import { Heading, Text } from "@medusajs/ui";
import { authors } from "@/content/authors";
import { format } from "date-fns";

export const BlogCard = ({ meta }: { meta: BlogPostMeta }) => {
  return (
    <div className="group relative rounded-md bg-zinc-50 shadow-borders-base transition-all dark:bg-ui-bg-field">
      <NextLink href={meta.slug}>
        <div className="space-y-2.5 p-2.5">
          <div className="relative aspect-[1200/630] w-full overflow-hidden rounded">
            <Image
              src={meta.image}
              alt={meta.title}
              className="h-full w-full object-cover transition-all duration-300 ease-in-out group-hover:scale-[104%] max-md:group-hover:scale-100"
              height={630}
              width={1200}
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Text className="text-[0.78rem] text-subtle-foreground">
                {meta.category.charAt(0).toUpperCase() +
                  meta.category.slice(1).split("-").join(" ")}
              </Text>
              <Text className="text-[0.78rem] text-subtle-foreground">
                {format(new Date(meta.published), "MMM d, yyyy")}
              </Text>
            </div>
            <Heading level="h2" className="line-clamp-2 text-sm">
              {meta.title}
            </Heading>
            <Text size="xsmall" className="line-clamp-2 text-[0.8rem] text-subtle-foreground">
              {meta.description}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={authors[meta.author].image}
              alt={meta.author}
              height={1000}
              width={1000}
              quality={100}
              className="size-5 rounded-full"
            />
            <Text size="xsmall" className="text-[0.8rem] text-subtle-foreground">
              {authors[meta.author].name}
            </Text>
          </div>
        </div>
      </NextLink>
    </div>
  );
};
