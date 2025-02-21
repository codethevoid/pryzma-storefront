import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { useSearchParams } from "next/navigation";
import { buildTagFilters } from "@/lib/helpers/build-tag-filters";
import type { Filter } from "@/types";
import type { StoreProduct } from "@medusajs/types";

type UseProductsResponse = {
  products: StoreProduct[];
  count: number;
  limit: number;
  offset: number;
};

export const useProducts = ({
  categoryId,
  filters,
  pageSize,
}: {
  categoryId: string | string[];
  filters: Filter[];
  pageSize: number;
}) => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const params = new URLSearchParams();
  if (filters?.length) params.set("filters", JSON.stringify(filters));
  params.set("category_id", Array.isArray(categoryId) ? categoryId.join(",") : categoryId);
  params.set("page_size", pageSize.toString());
  params.set("page", (page || 1).toString());

  const { data, isLoading, error } = useSWR<UseProductsResponse>(
    `/api/products?${params.toString()}`,
    fetcher,
  );
  return { data, isLoading, error };
};
