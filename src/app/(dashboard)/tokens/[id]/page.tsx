"use client";

import { useState } from "react";
import { useToken, useTokens } from "@/hooks/use-tokens";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TokenHeader } from "@/components/dashboard/token-detail/token-header";
import { ScoreBreakdownChart } from "@/components/dashboard/token-detail/score-breakdown";
import { SignalCards } from "@/components/dashboard/token-detail/signal-cards";
import { PriceChart } from "@/components/dashboard/token-detail/price-chart";
import { MigrationReadiness } from "@/components/dashboard/token-detail/migration-readiness";
import { SimilarTokens } from "@/components/dashboard/token-detail/similar-tokens";
import { ProposalForm } from "@/components/dashboard/proposal-builder/proposal-form";

export default function TokenDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { token, isLoading, error } = useToken(params.id);
  const { candidates } = useTokens();
  const [proposalOpen, setProposalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardContent className="flex items-center gap-6 pt-6">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-16 w-16 rounded-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-3xl font-bold mb-2">Token Not Found</h1>
        <p className="text-muted-foreground">
          Could not find token with ID &quot;{params.id}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TokenHeader
        token={token}
        onGenerateProposal={() => setProposalOpen(true)}
      />

      <ScoreBreakdownChart
        breakdown={token.mds.breakdown}
        totalScore={token.mds.totalScore}
      />

      <SignalCards token={token} />

      <PriceChart data={token.priceHistory30d} change30d={token.change30d} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MigrationReadiness token={token} />
        <SimilarTokens tokens={candidates} currentId={token.id} />
      </div>

      <ProposalForm
        token={token}
        open={proposalOpen}
        onOpenChange={setProposalOpen}
      />
    </div>
  );
}
