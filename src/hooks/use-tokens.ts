import useSWR from "swr";
import type { TokenWithScore, TokenDetail, AggregateStats } from "@/lib/data";
import type { MigratedToken } from "@/lib/config/tokens";
import type { ProviderHealth } from "@/lib/data/providers/health";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TokensResponse {
  candidates: TokenWithScore[];
  migrated: MigratedToken[];
  stats: AggregateStats;
  providerHealth?: ProviderHealth[];
}

export function useTokens() {
  const { data, error, isLoading, mutate } = useSWR<TokensResponse>(
    "/api/tokens",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      refreshInterval: 300_000, // 5 min auto-refresh
    }
  );

  return {
    candidates: data?.candidates ?? [],
    migrated: data?.migrated ?? [],
    stats: data?.stats,
    providerHealth: data?.providerHealth ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useToken(id: string) {
  const { data, error, isLoading, mutate } = useSWR<TokenDetail>(
    id ? `/api/tokens/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      refreshInterval: 60_000, // 1 min for detail page (prices update faster)
    }
  );

  return {
    token: data,
    isLoading,
    error,
    refresh: mutate,
  };
}
