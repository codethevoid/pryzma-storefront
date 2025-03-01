import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { StoreProduct } from "@medusajs/types";

type SearchResponse = StoreProduct[];

export const useSearch = (query: string) => {
  const { data, isLoading, error } = useSWR<SearchResponse>(`/api/search?q=${query}`, fetcher);
  return { products: data, isLoading, error };
};
