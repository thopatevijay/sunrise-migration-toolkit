"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD } from "@/lib/utils";
import type { TokenWithScore } from "@/lib/data";

interface DemandChartProps {
  tokens: TokenWithScore[];
  isLoading: boolean;
}

type ChartTab = "bridge" | "search" | "mds";

const CHART_COLORS = [
  "#a78bfa",
  "#22d3ee",
  "#34d399",
  "#f59e0b",
  "#f472b6",
];

export function DemandChart({ tokens, isLoading }: DemandChartProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>("bridge");

  const top5 = useMemo(() => tokens.slice(0, 5), [tokens]);

  // Real 7-day bridge volumes per token (no fabrication)
  const bridgeData = useMemo(() => {
    return top5.map((token, idx) => ({
      name: token.symbol,
      volume: token.bridgeVolume7d,
      color: CHART_COLORS[idx],
    }));
  }, [top5]);

  // Real search intent scores per token
  const searchData = useMemo(() => {
    return top5.map((token, idx) => ({
      name: token.symbol,
      score: token.mds.breakdown.searchIntent.normalized,
      trend: token.searchTrend,
      color: CHART_COLORS[idx],
    }));
  }, [top5]);

  const mdsData = useMemo(() => {
    return top5.map((token) => ({
      name: token.symbol,
      score: token.mds.totalScore,
      bridge: token.mds.breakdown.bridgeOutflow.weighted,
      search: token.mds.breakdown.searchIntent.weighted,
      social: token.mds.breakdown.socialDemand.weighted,
      health: token.mds.breakdown.chainHealth.weighted,
      wallet: token.mds.breakdown.walletOverlap.weighted,
    }));
  }, [top5]);

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Demand Signals</CardTitle>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ChartTab)}
          >
            <TabsList className="h-8 bg-white/5">
              <TabsTrigger value="bridge" className="text-xs h-6 px-3">
                Bridge Outflows
              </TabsTrigger>
              <TabsTrigger value="search" className="text-xs h-6 px-3">
                Search Intent
              </TabsTrigger>
              <TabsTrigger value="mds" className="text-xs h-6 px-3">
                MDS Breakdown
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "bridge" ? (
              <BarChart data={bridgeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatUSD(v)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 40% 10%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [formatUSD(value), "7d Volume"]}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="volume" radius={[4, 4, 0, 0]} name="7d Bridge Volume">
                  {bridgeData.map((entry, idx) => (
                    <Cell key={entry.name} fill={CHART_COLORS[idx]} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            ) : activeTab === "search" ? (
              <BarChart data={searchData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 40% 10%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [
                    name === "score" ? `${value}/100` : `${value > 0 ? "+" : ""}${value}%`,
                    name === "score" ? "Search Score" : "Trend",
                  ]}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} name="Search Intent Score">
                  {searchData.map((entry, idx) => (
                    <Cell key={entry.name} fill={CHART_COLORS[idx]} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart
                data={mdsData}
                layout="vertical"
                margin={{ left: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  width={55}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 40% 10%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Area
                  type="monotone"
                  dataKey="bridge"
                  stackId="1"
                  fill="#a78bfa"
                  stroke="#a78bfa"
                  name="Bridge"
                />
                <Area
                  type="monotone"
                  dataKey="search"
                  stackId="1"
                  fill="#22d3ee"
                  stroke="#22d3ee"
                  name="Search"
                />
                <Area
                  type="monotone"
                  dataKey="social"
                  stackId="1"
                  fill="#34d399"
                  stroke="#34d399"
                  name="Social"
                />
                <Area
                  type="monotone"
                  dataKey="health"
                  stackId="1"
                  fill="#f59e0b"
                  stroke="#f59e0b"
                  name="Health"
                />
                <Area
                  type="monotone"
                  dataKey="wallet"
                  stackId="1"
                  fill="#f472b6"
                  stroke="#f472b6"
                  name="Wallet"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
