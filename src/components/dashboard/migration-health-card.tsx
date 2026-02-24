"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { Sparkline } from "@/components/dashboard/sparkline";
import { formatUSD } from "@/lib/utils";
import { Calendar, ArrowLeftRight } from "lucide-react";
import type { MigrationHealth } from "@/lib/data/migration-health";

interface MigrationHealthCardProps {
  health: MigrationHealth;
}

const statusConfig = {
  healthy: { label: "Healthy", className: "border-emerald-500/30 text-emerald-400" },
  moderate: { label: "Moderate", className: "border-yellow-500/30 text-yellow-400" },
  concerning: { label: "Concerning", className: "border-red-500/30 text-red-400" },
};

export function MigrationHealthCard({ health }: MigrationHealthCardProps) {
  const { token, healthScore, healthStatus, priceHistory30d } = health;
  const status = statusConfig[healthStatus];
  const sparkData = priceHistory30d.map((p) => p.price);

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="pt-5 pb-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {token.logo ? (
              <img
                src={token.logo}
                alt={token.symbol}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                {token.symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm">{token.symbol}</p>
              <p className="text-xs text-muted-foreground">{token.name}</p>
            </div>
          </div>
          <ScoreRing score={healthScore} size={48} strokeWidth={3} />
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={`text-[10px] ${status.className}`}>
            {status.label}
          </Badge>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{health.daysSinceMigration}d since migration</span>
          </div>
        </div>

        {/* Sparkline */}
        {sparkData.length > 0 && (
          <div className="mb-4">
            <Sparkline
              data={sparkData}
              color={health.change30d >= 0 ? "#34d399" : "#f87171"}
              width={280}
              height={40}
            />
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground">Price</p>
            <p className="text-sm font-mono font-medium">{formatUSD(health.price)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Market Cap</p>
            <p className="text-sm font-mono font-medium">{formatUSD(health.marketCap)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">24h Volume</p>
            <p className="text-sm font-mono font-medium">{formatUSD(health.volume24h)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">7d Change</p>
            <TrendIndicator value={health.change7d} />
          </div>
        </div>

        {/* Bridge activity */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
            <ArrowLeftRight className="h-3 w-3" />
            Bridge Activity (7d)
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-medium">
              {formatUSD(health.bridgeVolume7d)}
            </span>
            <TrendIndicator value={health.bridgeTrend} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
