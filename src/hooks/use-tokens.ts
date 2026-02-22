import useSWR from "swr";
import type { TokenWithScore, TokenDetail, AggregateStats } from "@/lib/data";
import type { MigratedToken } from "@/lib/config/tokens";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TokensResponse {
  candidates: TokenWithScore[];
  migrated: MigratedToken[];
  stats: AggregateStats;
}

export function useTokens() {
  const { data, error, isLoading } = useSWR<TokensResponse>(
    "/api/tokens",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    candidates: data?.candidates ?? [],
    migrated: data?.migrated ?? [],
    stats: data?.stats,
    isLoading,
    error,
  };
}

export function useToken(id: string) {
  const { data, error, isLoading } = useSWR<TokenDetail>(
    id ? `/api/tokens/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    token: data,
    isLoading,
    error,
  };
}
