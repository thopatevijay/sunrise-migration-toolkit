"use client";

import { useDiscovery } from "@/hooks/use-discovery";
import { DiscoveryTable } from "@/components/dashboard/discovery-table";

export default function DiscoveryPage() {
  const { tokens, totalFound, cachedAt, isLoading } = useDiscovery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          <span className="gradient-text">No-Solana Token Discovery</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Top tokens by market cap without a native Solana contract address
          {totalFound > 0 && ` — ${totalFound} tokens found`}
          {cachedAt && (
            <span className="ml-2 text-xs text-muted-foreground/60">
              (updated {new Date(cachedAt).toLocaleTimeString()})
            </span>
          )}
        </p>
      </div>
      <DiscoveryTable tokens={tokens} isLoading={isLoading} />
    </div>
  );
}
