"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import type { TokenDetail } from "@/lib/data";

interface MigrationReadinessProps {
  token: TokenDetail;
}

interface CheckItem {
  label: string;
  status: "pass" | "partial" | "unknown";
  detail: string;
}

export function MigrationReadiness({ token }: MigrationReadinessProps) {
  const checks: CheckItem[] = [
    {
      label: "NTT / Bridge Support",
      status: token.mds.totalScore > 60 ? "pass" : "partial",
      detail:
        token.mds.totalScore > 60
          ? "Wormhole NTT compatible"
          : "Bridge route feasibility TBD",
    },
    {
      label: "Active Development Team",
      status: token.website ? "pass" : "unknown",
      detail: token.website
        ? "Active team with public presence"
        : "Team activity unverified",
    },
    {
      label: "Bridge Routes Available",
      status:
        token.mds.breakdown.bridgeOutflow.normalized > 50 ? "pass" : "partial",
      detail: `${token.mds.breakdown.bridgeOutflow.normalized > 50 ? "Multiple" : "Limited"} bridge routes from ${token.originChain}`,
    },
    {
      label: "DeFi Integration Potential",
      status: token.tvl > 500_000_000 ? "pass" : "partial",
      detail:
        token.tvl > 500_000_000
          ? "Strong DeFi ecosystem on origin chain"
          : "Growing DeFi presence",
    },
    {
      label: "Community Size",
      status:
        token.holders > 100_000
          ? "pass"
          : token.holders > 50_000
            ? "partial"
            : "unknown",
      detail: `${(token.holders / 1000).toFixed(0)}K holders on ${token.originChain}`,
    },
  ];

  const passCount = checks.filter((c) => c.status === "pass").length;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Migration Readiness</CardTitle>
          <span className="text-xs font-mono text-muted-foreground">
            {passCount}/{checks.length} checks
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {checks.map((check) => (
          <div key={check.label} className="flex items-start gap-3">
            {check.status === "pass" ? (
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 mt-0.5 shrink-0" />
            ) : check.status === "partial" ? (
              <AlertCircle className="h-4.5 w-4.5 text-yellow-400 mt-0.5 shrink-0" />
            ) : (
              <Circle className="h-4.5 w-4.5 text-muted-foreground mt-0.5 shrink-0" />
            )}
            <div>
              <p className="text-sm font-medium">{check.label}</p>
              <p className="text-xs text-muted-foreground">{check.detail}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
