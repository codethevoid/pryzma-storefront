import Image from "next/image";
import { cdnUrl } from "@/utils/s3";
import NextLink from "next/link";
import { Text } from "@medusajs/ui";

const data = [
  {
    image: `${cdnUrl}/uploads/IMG_1086-01JMQWGM81N9PDGZ09VX2C0WDC.webp`,
    title: "Java switches",
    description: "Hand lubed, long pole switches",
    href: "/products/switches/pryzma-java-switches",
  },
  {
    image: `${cdnUrl}/uploads/IMG_3070-01JMQWSABANWX3GJNAFH3MP296.webp`,
    title: "Seafoam switches",
    description: "Heavy long pole switches",
    href: "/products/switches/pryzma-seafoam-switches",
  },
];

export const Featured = () => {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-xl space-y-4">
        <Text size="xlarge" weight="plus">
          Featured
        </Text>
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {data.map((item) => (
            <NextLink
              href={item.href}
              key={item.title}
              className="group relative cursor-pointer overflow-hidden rounded-md shadow-sm"
            >
              <Image
                src={item.image}
                alt={item.title}
                height={1365}
                width={2048}
                className="aspect-[2048/1365] object-cover transition-all duration-300 ease-in-out group-hover:scale-[103%]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
              <div className="absolute inset-0 flex items-end justify-start p-6">
                <div>
                  <Text size="xlarge" weight="plus" className="relative z-10 text-white">
                    {item.title}
                  </Text>
                  <Text size="base" className="relative z-10 text-white">
                    {item.description}
                  </Text>
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </div>
  );
};
