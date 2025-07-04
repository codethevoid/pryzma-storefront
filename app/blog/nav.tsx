"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@medusajs/ui";

export const BlogNav = ({ categories }: { categories: string[] }) => {
  const pathname = usePathname();
  const { post } = useParams();

  if (post) return null;

  return (
    <nav className="px-4">
      <div className="mx-auto flex max-w-screen-lg items-center gap-2">
        <Button
          asChild
          size="small"
          className="rounded-full px-2.5"
          variant={pathname === "/blog" ? "primary" : "transparent"}
        >
          <Link href="/blog">All posts</Link>
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            asChild
            size="small"
            className="rounded-full px-2.5"
            variant={pathname === `/blog/${category}` ? "primary" : "transparent"}
          >
            <Link href={`/blog/${category}`}>
              {category.charAt(0).toUpperCase() + category.slice(1).split("-").join(" ")}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
};
