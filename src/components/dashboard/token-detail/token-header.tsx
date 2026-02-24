"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChainBadge } from "@/components/shared/chain-badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatUSD } from "@/lib/utils";
import { getScoreRange } from "@/lib/types/scoring";
import type { TokenDetail } from "@/lib/data";

interface TokenHeaderProps {
  token: TokenDetail;
  onGenerateProposal: () => void;
}

export function TokenHeader({ token, onGenerateProposal }: TokenHeaderProps) {
  const router = useRouter();
  const range = getScoreRange(token.mds.totalScore);

  const rangeLabels = {
    extreme: "Extremely High Demand",
    strong: "Strong Demand",
    moderate: "Moderate Demand",
    emerging: "Emerging Demand",
    low: "Low Demand",
  };

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="flex flex-col gap-6 mt-4 sm:flex-row sm:items-center">
          {/* Token info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{token.symbol}</h1>
                <ChainBadge chainId={token.originChain} size="md" />
              </div>
              <p className="text-sm text-muted-foreground">{token.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {token.description}
              </p>
            </div>
          </div>

          {/* Price + Market stats */}
          <div className="flex gap-6 items-center">
            <div className="text-right">
              <p className="text-2xl font-bold font-mono">
                {token.hasMarketData ? formatUSD(token.price) : "—"}
              </p>
              {token.hasMarketData && <TrendIndicator value={token.change7d} size="md" />}
              <p className="text-xs text-muted-foreground mt-0.5">
                MCap {token.hasMarketData ? formatUSD(token.marketCap) : "—"}
              </p>
            </div>

            {/* MDS Score */}
            <div className="flex flex-col items-center gap-1">
              <ScoreRing score={token.mds.totalScore} size={64} strokeWidth={5} />
              <Badge
                variant="outline"
                className="text-[10px] border-white/10"
              >
                {rangeLabels[range]}
              </Badge>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2 sm:ml-4">
            <Button
              onClick={onGenerateProposal}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Proposal
            </Button>
            {token.website && (
              <a
                href={token.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 justify-center"
              >
                Visit Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
