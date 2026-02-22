"use client";

import { useTokens } from "@/hooks/use-tokens";
import { TokenTable } from "@/components/dashboard/token-table";

export default function TokensPage() {
  const { candidates, isLoading } = useTokens();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Token Candidates</h2>
        <p className="text-sm text-muted-foreground mt-1">
          All tokens ranked by Migration Demand Score
        </p>
      </div>
      <TokenTable tokens={candidates} isLoading={isLoading} />
    </div>
  );
}
