import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { useSearchParams } from "next/navigation";
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
  collectionId,
  filters,
  pageSize,
  handle,
}: {
  categoryId?: string | string[];
  collectionId?: string | string[];
  filters: Filter[];
  pageSize: number;
  handle?: string | string[];
}) => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const params = new URLSearchParams();
  if (filters?.length) params.set("filters", JSON.stringify(filters));
  if (categoryId) {
    params.set("category_id", Array.isArray(categoryId) ? categoryId.join(",") : categoryId);
  }
  if (collectionId) {
    params.set(
      "collection_id",
      Array.isArray(collectionId) ? collectionId.join(",") : collectionId,
    );
  }
  params.set("page_size", pageSize.toString());
  params.set("page", (page || 1).toString());

  const { data, isLoading, error } = useSWR<UseProductsResponse>(
    `/api/products?${params.toString()}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
  return { data, isLoading, error };
};
