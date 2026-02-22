"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOnboardingFunnel, type FunnelStep } from "@/lib/analytics/onboarding";

interface OnboardingAnalyticsProps {
  token?: string;
}

export function OnboardingAnalytics({ token }: OnboardingAnalyticsProps) {
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);

  useEffect(() => {
    setFunnel(getOnboardingFunnel(token));
  }, [token]);

  if (funnel.length === 0) return null;

  const maxVisitors = Math.max(1, funnel[0]?.visitors ?? 1);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          Onboarding Funnel{token ? ` — ${token.toUpperCase()}` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {funnel.map((step) => {
          const widthPct = Math.max(8, (step.visitors / maxVisitors) * 100);
          return (
            <div key={step.step} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {step.step + 1}. {step.name}
                </span>
                <span className="font-mono text-muted-foreground">
                  {step.visitors} visitors ({step.conversionRate}%)
                </span>
              </div>
              <div className="h-6 rounded bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded bg-gradient-to-r from-purple-500/60 to-cyan-500/40 transition-all duration-700 flex items-center px-2"
                  style={{ width: `${widthPct}%` }}
                >
                  <span className="text-[10px] font-mono text-white/80">
                    {step.conversionRate}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <p className="text-[10px] text-muted-foreground pt-1">
          Conversion funnel tracks step completion across all onboarding sessions.
        </p>
      </CardContent>
    </Card>
  );
}
