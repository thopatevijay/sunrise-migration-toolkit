import useSWR from "swr";
import type { MigrationHealth } from "@/lib/data/migration-health";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MigrationsResponse {
  migrations: MigrationHealth[];
  lastUpdated: string;
}

export function useMigrations() {
  const { data, error, isLoading, mutate } = useSWR<MigrationsResponse>(
    "/api/migrations",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      refreshInterval: 300_000, // 5 min auto-refresh
    }
  );

  return {
    migrations: data?.migrations ?? [],
    lastUpdated: data?.lastUpdated,
    isLoading,
    error,
    refresh: mutate,
  };
}
