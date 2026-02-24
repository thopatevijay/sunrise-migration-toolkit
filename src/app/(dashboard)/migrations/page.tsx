"use client";

import { useMigrations } from "@/hooks/use-migrations";
import { Card, CardContent } from "@/components/ui/card";
import { MigrationHealthCard } from "@/components/dashboard/migration-health-card";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { Activity, Heart, DollarSign, Calendar } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { LoadingOverlay } from "@/components/shared/loading-overlay";

export default function MigrationsPage() {
  const { migrations, lastUpdated, isLoading } = useMigrations();

  const avgHealth = migrations.length > 0
    ? Math.round(migrations.reduce((sum, m) => sum + m.healthScore, 0) / migrations.length)
    : 0;
  const totalVolume = migrations.reduce((sum, m) => sum + m.volume24h, 0);
  const avgDays = migrations.length > 0
    ? Math.round(migrations.reduce((sum, m) => sum + m.daysSinceMigration, 0) / migrations.length)
    : 0;

  const stats = [
    {
      label: "Migrated Tokens",
      value: `${migrations.length}`,
      sub: "via Sunrise",
      icon: Activity,
    },
    {
      label: "Avg. Health Score",
      value: `${avgHealth}`,
      sub: avgHealth >= 70 ? "healthy" : avgHealth >= 40 ? "moderate" : "needs attention",
      icon: Heart,
    },
    {
      label: "Total 24h Volume",
      value: formatUSD(totalVolume),
      sub: "across all migrated tokens",
      icon: DollarSign,
    },
    {
      label: "Avg. Days Since Migration",
      value: `${avgDays}`,
      sub: "time on Solana",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          <span className="gradient-text">Migration Health</span> Monitor
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track the post-migration health of tokens brought to Solana via Sunrise
          {lastUpdated && (
            <span className="ml-2 text-xs text-muted-foreground/60">
              (updated {new Date(lastUpdated).toLocaleTimeString()})
            </span>
          )}
        </p>
      </div>

      {isLoading ? (
        <LoadingOverlay isLoading={isLoading} variant="migrations" />
      ) : (
        <>
          {/* Stats row */}
          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <Card className="glass-card">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <stat.icon className="h-3.5 w-3.5" />
                      {stat.label}
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Health cards grid */}
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {migrations.map((health) => (
              <StaggerItem key={health.token.id}>
                <MigrationHealthCard health={health} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </>
      )}
    </div>
  );
}
