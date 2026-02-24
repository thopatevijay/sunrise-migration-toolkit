"use client";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import {
  Waves,
  Search,
  MessageCircle,
  Activity,
  Users,
} from "lucide-react";
import { formatUSD, formatNumber } from "@/lib/utils";
import type { TokenDetail } from "@/lib/data";

interface SignalCardsProps {
  token: TokenDetail;
}

export function SignalCards({ token }: SignalCardsProps) {
  const cards = [
    {
      title: "Bridge Outflow",
      icon: Waves,
      color: "#a78bfa",
      value: formatUSD(token.bridgeVolume7d),
      label: `7-day volume${token.bridgeDataSource === "estimated" ? " (estimated)" : ""}`,
      score: token.mds.breakdown.bridgeOutflow.normalized,
      badge: token.bridgeDataSource === "estimated" ? "Estimated" : "Live",
      chart: token.bridgeTimeseries.length > 0 ? (
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={token.bridgeTimeseries.slice(-14)}>
            <defs>
              <linearGradient id="bridgeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 40% 10%)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                fontSize: 11,
              }}
              formatter={(v: number) => [formatUSD(v), "Volume"]}
              labelFormatter={() => ""}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#a78bfa"
              fill="url(#bridgeGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : undefined,
    },
    {
      title: "Search Intent",
      icon: Search,
      color: "#22d3ee",
      value: `${formatNumber(token.mds.breakdown.searchIntent.raw)}/day`,
      label: "avg. Jupiter searches",
      score: token.mds.breakdown.searchIntent.normalized,
      trend: token.searchTrend,
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={token.searchTimeseries}>
            <XAxis dataKey="date" hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 40% 10%)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                fontSize: 11,
              }}
              formatter={(v: number) => [v, "Searches"]}
              labelFormatter={() => ""}
            />
            <Line
              type="monotone"
              dataKey="searches"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Social Demand",
      icon: MessageCircle,
      color: "#34d399",
      value: `${token.socialData.demandMentions}`,
      label: "demand mentions (7d)",
      score: token.mds.breakdown.socialDemand.normalized,
      extra: (
        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Sentiment</span>
            <span className={token.socialData.sentiment > 0.6 ? "text-emerald-400" : "text-yellow-400"}>
              {(token.socialData.sentiment * 100).toFixed(0)}% positive
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {token.socialData.topHashtags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] border-white/10">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Chain Health",
      icon: Activity,
      color: "#f59e0b",
      value: formatUSD(token.marketCap),
      label: "market cap",
      score: token.mds.breakdown.chainHealth.normalized,
      extra: (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <span className="text-muted-foreground">Volume 24h</span>
            <p className="font-mono">{formatUSD(token.volume24h)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">TVL</span>
            <p className="font-mono">{formatUSD(token.tvl)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Holders</span>
            <p className="font-mono">{formatNumber(token.holders)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">ATH</span>
            <p className="font-mono">{formatUSD(token.ath)}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Wallet Overlap",
      icon: Users,
      color: "#f472b6",
      value: `${token.walletOverlap.overlapPercentage}%`,
      label: `${formatNumber(token.walletOverlap.solanaWallets)} Solana wallets`,
      score: token.mds.breakdown.walletOverlap.normalized,
      badge: token.walletOverlap.isEstimated ? "Estimated" : undefined,
      extra: (
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Active overlap</span>
            <span className="font-mono">{token.walletOverlap.activeOverlap}%</span>
          </div>
          {token.walletOverlap.topWalletCategories.slice(0, 3).map((cat) => (
            <div key={cat.category} className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: "#f472b6",
                    opacity: 0.6,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground w-24 truncate">
                {cat.category}
              </span>
              <span className="text-[10px] font-mono w-8 text-right">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <card.icon className="h-4 w-4" style={{ color: card.color }} />
                <CardTitle className="text-sm">{card.title}</CardTitle>
              </div>
              <div className="flex items-center gap-1.5">
                {card.badge && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      card.badge === "Live"
                        ? "border-emerald-500/30 text-emerald-400"
                        : "border-yellow-500/30 text-yellow-400"
                    }`}
                  >
                    {card.badge}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] border-white/10"
                >
                  {card.score}/100
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono">{card.value}</span>
              {card.trend !== undefined && (
                <TrendIndicator value={card.trend} size="sm" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            {card.chart && <div className="mt-3">{card.chart}</div>}
            {card.extra}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
