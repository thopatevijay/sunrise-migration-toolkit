"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FunnelStep } from "@/lib/analytics/onboarding";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface OnboardingAnalyticsProps {
  token?: string;
}

export function OnboardingAnalytics({ token }: OnboardingAnalyticsProps) {
  const url = token
    ? `/api/analytics/onboarding?token=${token}`
    : "/api/analytics/onboarding";

  const { data: funnel } = useSWR<FunnelStep[]>(url, fetcher, {
    refreshInterval: 30_000,
  });

  if (!funnel || funnel.length === 0) return null;

  const hasData = funnel.some((s) => s.visitors > 0);
  const maxVisitors = Math.max(1, funnel[0]?.visitors ?? 1);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          Onboarding Funnel{token ? ` — ${token.toUpperCase()}` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hasData ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No onboarding sessions recorded yet. Visit an onboarding page to
            start tracking.
          </p>
        ) : (
          funnel.map((step) => {
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
          })
        )}
        <p className="text-[10px] text-muted-foreground pt-1">
          {hasData
            ? "Live conversion funnel — tracks step completion across all onboarding sessions."
            : "Funnel will populate as users go through onboarding flows."}
        </p>
      </CardContent>
    </Card>
  );
}
