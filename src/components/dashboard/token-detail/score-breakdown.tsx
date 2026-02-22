"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SIGNAL_LABELS, type SignalKey } from "@/lib/scoring/weights";
import type { ScoreBreakdown } from "@/lib/types/scoring";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
  totalScore: number;
}

const SIGNAL_COLORS: Record<SignalKey, string> = {
  bridgeOutflow: "#a78bfa",
  searchIntent: "#22d3ee",
  socialDemand: "#34d399",
  chainHealth: "#f59e0b",
  walletOverlap: "#f472b6",
};

export function ScoreBreakdownChart({ breakdown, totalScore }: ScoreBreakdownProps) {
  const radarData = (Object.entries(breakdown) as [SignalKey, typeof breakdown.bridgeOutflow][]).map(
    ([key, signal]) => ({
      signal: SIGNAL_LABELS[key],
      value: signal.normalized,
      fullMark: 100,
    })
  );

  const barData = (Object.entries(breakdown) as [SignalKey, typeof breakdown.bridgeOutflow][]).map(
    ([key, signal]) => ({
      signal: SIGNAL_LABELS[key],
      key,
      normalized: signal.normalized,
      weighted: signal.weighted,
      weight: `${(signal.weight * 100).toFixed(0)}%`,
    })
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Radar Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">MDS Radar — Score: {totalScore}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="signal"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickCount={5}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#a78bfa"
                  fill="#a78bfa"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weighted Bar Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Signal Weights & Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="signal"
                  tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 40% 10%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}`,
                    name === "normalized" ? "Raw Score" : "Weighted",
                  ]}
                />
                <Bar
                  dataKey="normalized"
                  name="Raw Score"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                >
                  {barData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={SIGNAL_COLORS[entry.key as SignalKey]}
                      fillOpacity={0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {barData.map((entry) => (
              <div key={entry.key} className="flex items-center gap-1.5 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: SIGNAL_COLORS[entry.key as SignalKey] }}
                />
                <span className="text-muted-foreground">
                  {entry.signal}: {entry.weight}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
