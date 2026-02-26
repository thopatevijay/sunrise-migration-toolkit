"use client";

import { useState } from "react";
import { useDiscovery } from "@/hooks/use-discovery";
import { DiscoveryTable } from "@/components/dashboard/discovery-table";
import { Info, X, Bot } from "lucide-react";
import { MigrationScout } from "@/components/dashboard/migration-scout";

export default function DiscoveryPage() {
  const { tokens, totalFound, cachedAt, isLoading } = useDiscovery();
  const [showBanner, setShowBanner] = useState(true);
  const [scoutOpen, setScoutOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            <span className="gradient-text">Token Discovery</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
          {totalFound > 0
            ? `${totalFound} of top 500 tokens by market cap lack a native Solana contract address`
            : "Scanning top 500 tokens by market cap for Solana migration opportunities"}
          {cachedAt && (
            <span className="ml-2 text-xs text-muted-foreground/60">
              (updated {new Date(cachedAt).toLocaleTimeString()})
            </span>
          )}
        </p>
        </div>
        <button
          onClick={() => setScoutOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          <Bot className="h-4 w-4" />
          Run Scout
        </button>
      </div>

      {showBanner && (
        <div className="flex items-start gap-3 rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-3">
          <Info className="h-4 w-4 mt-0.5 text-purple-400 shrink-0" />
          <div className="flex-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">How we identify migration candidates</p>
            <p>
              We scan the top 500 tokens by market cap on CoinGecko and cross-reference each
              token&apos;s platform data to check for a native Solana contract address. Tokens
              without one are flagged as migration opportunities. Stablecoins (USDT, USDC, DAI, etc.)
              and tokens under $5M market cap are excluded. Data refreshes every 60 minutes.
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="shrink-0 text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <DiscoveryTable tokens={tokens} isLoading={isLoading} />
      <MigrationScout open={scoutOpen} onOpenChange={setScoutOpen} tokens={tokens} />
    </div>
  );
}
