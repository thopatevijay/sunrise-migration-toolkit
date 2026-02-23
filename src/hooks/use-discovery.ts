import useSWR from "swr";
import type { DiscoveryResponse } from "@/lib/types/discovery";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDiscovery() {
  const { data, error, isLoading, mutate } = useSWR<DiscoveryResponse>(
    "/api/discovery/no-solana",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      refreshInterval: 3600_000, // 60 min (matches server cache TTL)
    }
  );

  return {
    tokens: data?.tokens ?? [],
    totalFound: data?.totalFound ?? 0,
    cachedAt: data?.cachedAt,
    isLoading,
    error,
    refresh: mutate,
  };
}
