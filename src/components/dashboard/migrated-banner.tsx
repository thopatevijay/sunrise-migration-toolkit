"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { ChainBadge } from "@/components/shared/chain-badge";
import type { MigratedToken } from "@/lib/config/tokens";

interface MigratedBannerProps {
  tokens: MigratedToken[];
  isLoading: boolean;
}

export function MigratedBanner({ tokens, isLoading }: MigratedBannerProps) {
  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-44 shrink-0 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <CardTitle className="text-sm">Successfully Migrated via Sunrise</CardTitle>
          <Badge
            variant="outline"
            className="text-[10px] border-emerald-500/30 text-emerald-400"
          >
            {tokens.length} tokens
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {tokens.map((token) => (
            <a
              key={token.id}
              href={token.sunriseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 glass-card p-3 w-44 hover:bg-white/[0.06] transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                  {token.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-1">
                    {token.symbol}
                    <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[10px] text-muted-foreground">{token.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <ChainBadge chainId={token.originChain} size="sm" />
                <span className="text-[10px] text-muted-foreground">
                  {new Date(token.migrationDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
