"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MdsBadge } from "@/components/shared/mds-badge";
import { FileText, Trash2, Copy, Check, ArrowRight } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import {
  getStoredProposals,
  deleteProposal,
  type MigrationProposal,
} from "@/lib/types/proposals";

export default function ProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<MigrationProposal[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setProposals(getStoredProposals());
  }, []);

  const handleDelete = (id: string) => {
    deleteProposal(id);
    setProposals(getStoredProposals());
  };

  const handleCopy = async (proposal: MigrationProposal) => {
    const text = `Migration Proposal: ${proposal.tokenSymbol}\nMDS: ${proposal.mdsScore}\n\n${proposal.whyThisToken}\n\nStrategy: ${proposal.proposedStrategy}\n\nMarket Cap: ${formatUSD(proposal.marketCap)}\nBridge Volume (7d): ${formatUSD(proposal.bridgeVolume7d)}\nCommunity Score: ${proposal.communityScore}/100\nWallet Overlap: ${proposal.walletOverlap}%`;
    await navigator.clipboard.writeText(text);
    setCopiedId(proposal.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Migration Proposals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Data-backed proposals for Sunrise token migrations
          </p>
        </div>
        <Badge variant="outline" className="border-white/10">
          {proposals.length} proposal{proposals.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {proposals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                      {proposal.tokenSymbol.slice(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {proposal.tokenSymbol}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {proposal.tokenName}
                      </p>
                    </div>
                  </div>
                  <MdsBadge score={proposal.mdsScore} size="sm" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {proposal.whyThisToken}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-white/[0.03]">
                    <span className="text-muted-foreground">Market Cap</span>
                    <p className="font-mono font-medium">
                      {formatUSD(proposal.marketCap)}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-white/[0.03]">
                    <span className="text-muted-foreground">Bridge Vol.</span>
                    <p className="font-mono font-medium">
                      {formatUSD(proposal.bridgeVolume7d)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopy(proposal)}
                    >
                      {copiedId === proposal.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(proposal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        router.push(`/tokens/${proposal.tokenId}`)
                      }
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-1">No proposals yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Visit a token&apos;s detail page and click &quot;Generate
              Proposal&quot; to create your first data-backed migration proposal
              for Sunrise.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-white/10"
            >
              Browse Token Candidates
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
