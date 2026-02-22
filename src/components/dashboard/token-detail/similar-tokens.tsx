"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdsBadge } from "@/components/shared/mds-badge";
import { ChainBadge } from "@/components/shared/chain-badge";
import type { TokenWithScore } from "@/lib/data";

interface SimilarTokensProps {
  tokens: TokenWithScore[];
  currentId: string;
}

export function SimilarTokens({ tokens, currentId }: SimilarTokensProps) {
  const router = useRouter();

  const similar = tokens
    .filter((t) => t.id !== currentId)
    .slice(0, 3);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Similar Candidates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {similar.map((token) => (
          <button
            key={token.id}
            onClick={() => router.push(`/tokens/${token.id}`)}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
          >
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
              {token.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{token.symbol}</span>
                <ChainBadge chainId={token.originChain} size="sm" />
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {token.name}
              </p>
            </div>
            <MdsBadge score={token.mds.totalScore} size="sm" />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
