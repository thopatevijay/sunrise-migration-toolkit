"use client";

import { useTokens } from "@/hooks/use-tokens";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { MigratedBanner } from "@/components/dashboard/migrated-banner";
import { DemandChart } from "@/components/dashboard/demand-chart";
import { TokenTable } from "@/components/dashboard/token-table";

export default function DashboardPage() {
  const { candidates, migrated, stats, isLoading } = useTokens();

  return (
    <div className="space-y-6">
      <StatsBar stats={stats} isLoading={isLoading} />
      <MigratedBanner tokens={migrated} isLoading={isLoading} />
      <DemandChart tokens={candidates} isLoading={isLoading} />
      <TokenTable tokens={candidates} isLoading={isLoading} />
    </div>
  );
}
