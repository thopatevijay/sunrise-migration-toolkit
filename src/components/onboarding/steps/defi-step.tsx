"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, PartyPopper, Share2, Loader2 } from "lucide-react";
import type { OnboardingConfig } from "@/lib/config/onboarding";

interface DeFiStepProps {
  config: OnboardingConfig;
}

interface ProtocolYield {
  protocol: string;
  bestApy: number;
  poolSymbol: string;
  tvlUsd: number;
}

const RISK_COLORS: Record<string, string> = {
  low: "text-emerald-400 border-emerald-500/30",
  medium: "text-yellow-400 border-yellow-500/30",
  high: "text-red-400 border-red-500/30",
};

const TYPE_LABELS: Record<string, string> = {
  lending: "Lending",
  lp: "Liquidity Pool",
  staking: "Staking",
  vault: "Vault",
};

export function DeFiStep({ config }: DeFiStepProps) {
  const [liveYields, setLiveYields] = useState<Record<string, ProtocolYield>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/yields")
      .then((res) => res.json())
      .then((data) => setLiveYields(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const shareText = `I just onboarded ${config.symbol} to Solana via @SunriseDefi! 🌅\n\nWallet ✅ Bridge ✅ Trade ✅ DeFi ✅\n\nTry it: tideshift.app/onboard/${config.slug}`;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Earn Yield with {config.symbol}
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Put your {config.symbol} to work across Solana DeFi. Here are the top
          opportunities available today.
        </p>
      </div>

      <div className="space-y-3">
        {config.defiOpportunities.map((opp) => {
          const live = liveYields[opp.protocol];
          const apyDisplay = live
            ? `${live.bestApy.toFixed(1)}%`
            : opp.apy !== "—"
            ? opp.apy
            : null;
          const isLive = !!live;

          return (
            <Card key={opp.protocol} className="glass-card hover:bg-white/[0.04] transition-colors">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{opp.protocol}</h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-white/10"
                    >
                      {TYPE_LABELS[opp.type]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${RISK_COLORS[opp.risk]}`}
                    >
                      {opp.risk} risk
                    </Badge>
                    {isLive && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-emerald-500/30 text-emerald-400"
                      >
                        Live
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLive
                      ? `${live.poolSymbol} pool — $${(live.tvlUsd / 1e6).toFixed(1)}M TVL`
                      : opp.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : apyDisplay ? (
                    <>
                      <p className="text-lg font-mono font-bold text-emerald-400">
                        {apyDisplay}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {isLive ? "Live APY" : "APY"}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">—</p>
                  )}
                </div>
                <a
                  href={opp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button variant="outline" size="sm" className="gap-1.5">
                    Open
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion card */}
      <Card className="glass-card ring-1 ring-emerald-500/20 bg-emerald-500/[0.03]">
        <CardContent className="py-6 text-center space-y-4">
          <PartyPopper className="h-10 w-10 text-emerald-400 mx-auto" />
          <div>
            <h3 className="text-lg font-bold">
              You&apos;re All Set!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              You&apos;ve successfully onboarded {config.symbol} to Solana.
              Welcome to the ecosystem!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share on X
              </Button>
            </a>
            {config.communityLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm">
                  {link.label}
                </Button>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
