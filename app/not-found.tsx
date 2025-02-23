import { ShoppingBag } from "@medusajs/icons";
import { IconBadge, Text, Button } from "@medusajs/ui";
import { ExclamationCircle } from "@medusajs/icons";
import NextLink from "next/link";
import { constructMetadata } from "@/utils/metadata";

export const metadata = constructMetadata({});

const NotFound = () => {
  return (
    <div className="flex h-[calc(100vh-330.5px)] min-h-[250px] items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <IconBadge size="large" className="mx-auto">
          <ExclamationCircle />
        </IconBadge>
        <Text size="small" className="text-center" weight="plus">
          Page not found
        </Text>
        <Button asChild size="small">
          <NextLink href="/">Go to home page</NextLink>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
