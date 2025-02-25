import { Text, Heading } from "@medusajs/ui";

export const CategoryHeader = ({
  title,
  description,
  count,
  hideCountDescription = false,
}: {
  title: string;
  description: string;
  count?: number;
  hideCountDescription?: boolean;
}) => {
  return (
    <div className="border-b bg-zinc-50 px-4 py-10 dark:bg-zinc-900/50 max-md:py-6">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-baseline gap-1">
          <Heading>{title}</Heading>
          {count && (
            <Text size="xsmall" className="text-subtle-foreground">
              ({count} {hideCountDescription ? "items" : "products"})
            </Text>
          )}
        </div>
        <Text size="small" className="text-subtle-foreground">
          {description}
        </Text>
      </div>
    </div>
  );
};
