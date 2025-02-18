import NextLink from "next/link";
import { Text } from "@medusajs/ui";
import Image from "next/image";
import { Button } from "@medusajs/ui";

type Props = {
  title: string;
  description: string;
  href: string;
  image: string;
  actionText?: string;
};

export const Spotlight = ({ title, description, href, image, actionText }: Props) => {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-xl overflow-hidden rounded-md shadow-sm">
        <div className="relative">
          <Image
            src={image}
            alt={title}
            height={1000}
            width={2000}
            className="aspect-[2/1] object-cover max-sm:aspect-[1/1.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
          <div className="absolute inset-0 flex items-end justify-start p-8 max-md:p-6">
            <div className="space-y-4">
              <div>
                <Text size="xlarge" weight="plus" className="relative z-50 text-white">
                  {title}
                </Text>
                <Text size="base" className="relative z-10 text-white">
                  {description}
                </Text>
              </div>
              <Button variant="primary" className="w-full max-w-[160px]" asChild>
                <NextLink href={href}>{actionText || "Shop now"}</NextLink>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
