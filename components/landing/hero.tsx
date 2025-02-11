import Image from "next/image";
import { Button, Text } from "@medusajs/ui";
import NextLink from "next/link";

const data = {
  image: "/quinn.jpeg",
  title: "Gateron Quinn",
  description: "Heavy tactile, long pole switches",
  href: "/products/gateron-quinn",
};

export const Hero = () => {
  return (
    <div className="relative h-[500px] w-full">
      <Image
        src={data.image}
        alt={data.title}
        height={2560}
        width={3840}
        className="absolute inset-0 h-full w-full object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="h-full w-full p-8 pb-12">
        <div className="mx-auto h-full max-w-screen-xl">
          <div className="flex h-full w-full items-end">
            <div className="space-y-4">
              <div>
                <Text size="xlarge" weight="plus" className="relative z-50 text-white">
                  {data.title}
                </Text>
                <Text size="base" className="relative z-10 text-white">
                  {data.description}
                </Text>
              </div>
              <div className="flex justify-start">
                <Button variant="primary" className="w-full max-w-[160px]" asChild>
                  <NextLink href={data.href}>Shop now</NextLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
