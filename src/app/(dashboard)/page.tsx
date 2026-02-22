"use client";

import Link from "next/link";
import { useTokens } from "@/hooks/use-tokens";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { MigratedBanner } from "@/components/dashboard/migrated-banner";
import { DemandChart } from "@/components/dashboard/demand-chart";
import { TokenTable } from "@/components/dashboard/token-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { ONBOARDING_CONFIGS } from "@/lib/config/onboarding";
import { FadeIn } from "@/components/shared/motion";
import { OnboardingAnalytics } from "@/components/onboarding/onboarding-analytics";

export default function DashboardPage() {
  const { candidates, migrated, stats, isLoading } = useTokens();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <FadeIn>
        <div className="rounded-xl bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 border border-white/5 p-6">
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Demand Discovery</span> for Token Migrations
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Tideshift ranks tokens by real migration demand — bridge outflows, search intent,
            social signals, and wallet overlap — so Sunrise can prioritize the highest-signal candidates.
          </p>
        </div>
      </FadeIn>

      <StatsBar stats={stats} isLoading={isLoading} />
      <MigratedBanner tokens={migrated} isLoading={isLoading} />
      <DemandChart tokens={candidates} isLoading={isLoading} />
      <TokenTable tokens={candidates} isLoading={isLoading} />

      {/* Onboarding Analytics */}
      <OnboardingAnalytics />

      {/* Onboarding Flows */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Community Onboarding Flows</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(ONBOARDING_CONFIGS).map((config) => (
            <Link
              key={config.slug}
              href={`/onboard/${config.slug}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
            >
              <div
                className={`h-10 w-10 rounded-full bg-gradient-to-br ${config.colors.primary} flex items-center justify-center text-white text-xs font-bold`}
              >
                {config.symbol.slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{config.symbol}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-emerald-500/30 text-emerald-400"
                  >
                    Live
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{config.name} — guided onboarding</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
