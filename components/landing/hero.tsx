import Image from "next/image";
import { Button, Text } from "@medusajs/ui";
import NextLink from "next/link";

type Props = {
  image: string;
  title: string;
  description: string;
  href: string;
};

export const Hero = ({ image, title, description, href }: Props) => {
  return (
    <div className="relative h-[600px] w-full">
      <Image
        src={image}
        alt={title}
        height={2000}
        width={3000}
        className="absolute inset-0 h-full w-full object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/35"></div>
      <div className="h-full w-full p-8 pb-12">
        <div className="mx-auto h-full max-w-screen-xl">
          <div className="flex h-full w-full items-end">
            <div className="space-y-4">
              <div>
                <Text size="xlarge" weight="plus" className="relative z-50 text-white">
                  {title}
                </Text>
                <Text size="base" className="relative z-10 text-white">
                  {description}
                </Text>
              </div>
              <div className="flex justify-start">
                <Button variant="primary" className="w-full max-w-[160px]" asChild>
                  <NextLink href={href}>Shop now</NextLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
