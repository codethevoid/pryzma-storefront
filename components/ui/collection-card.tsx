"use client";

import Image from "next/image";
import { Text, clx } from "@medusajs/ui";
import NextLink from "next/link";

export const CollectionCard = ({
  title,
  image,
  handle,
  className,
}: {
  title: string;
  image: string;
  handle: string;
  className?: string;
}) => {
  return (
    <div
      className={clx(
        "group relative rounded-md bg-ui-bg-field p-2.5 shadow-borders-base transition-all hover:bg-ui-bg-field-hover",
        className,
      )}
    >
      <NextLink href={`/collections/${handle}`}>
        <div className="flex h-full flex-col justify-between space-y-1">
          <div className="space-y-2">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded">
              <Image
                src={image}
                alt={title}
                height={667}
                width={1000}
                className="h-full w-full object-cover"
              />
            </div>
            <Text size="small">{title}</Text>
          </div>
        </div>
      </NextLink>
    </div>
  );
};
