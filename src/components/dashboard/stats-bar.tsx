"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, Waves, Trophy } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import type { AggregateStats } from "@/lib/data";

interface StatsBarProps {
  stats?: AggregateStats;
  isLoading: boolean;
}

const statConfig = [
  {
    key: "candidateCount" as const,
    label: "Migration Candidates",
    icon: BarChart3,
    format: (stats: AggregateStats) => `${stats.candidateCount} tokens`,
    sub: (stats: AggregateStats) => `${stats.risingCount} trending up`,
  },
  {
    key: "avgMDS" as const,
    label: "Avg. MDS Score",
    icon: TrendingUp,
    format: (stats: AggregateStats) => `${stats.avgMDS}`,
    sub: () => "across all candidates",
  },
  {
    key: "totalBridgeVolume7d" as const,
    label: "Bridge Volume (7d)",
    icon: Waves,
    format: (stats: AggregateStats) => formatUSD(stats.totalBridgeVolume7d),
    sub: () => "SOL outflows to buy these tokens",
  },
  {
    key: "topDemandToken" as const,
    label: "Top Demand",
    icon: Trophy,
    format: (stats: AggregateStats) =>
      `${stats.topDemandToken.symbol} (${stats.topDemandToken.score})`,
    sub: () => "highest Migration Demand Score",
  },
];

export function StatsBar({ stats, isLoading }: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfig.map((config) => (
        <Card key={config.key} className="glass-card">
          <CardContent className="pt-5 pb-4">
            {isLoading || !stats ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <config.icon className="h-3.5 w-3.5" />
                  {config.label}
                </div>
                <p className="text-2xl font-bold font-mono tracking-tight">
                  {config.format(stats)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.sub(stats)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
