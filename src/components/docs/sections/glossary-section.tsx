import { BookOpen } from "lucide-react";
import { DocsSection } from "@/components/docs/docs-section";
import { Card, CardContent } from "@/components/ui/card";

const glossaryTerms = [
  {
    term: "ATH",
    definition:
      "All-Time High \u2014 the highest price a token has ever reached.",
  },
  {
    term: "Bridge Outflow",
    definition:
      "Cross-chain value moving between blockchains, indicating demand for a token on other chains.",
  },
  {
    term: "CCIP",
    definition:
      "Chainlink Cross-Chain Interoperability Protocol \u2014 a bridge framework for secure cross-chain messaging.",
  },
  {
    term: "Community Score",
    definition:
      "Weighted composite of Twitter followers, Reddit subscribers, Reddit activity, and sentiment votes.",
  },
  {
    term: "Confidence Score",
    definition:
      "Ratio of available data signals to total signals (0.0 to 1.0), indicates data completeness.",
  },
  {
    term: "DAS API",
    definition:
      "Digital Asset Standard API \u2014 Helius\u2019s interface for querying on-chain Solana token data.",
  },
  {
    term: "Health Score",
    definition:
      "Composite metric (0\u2013100) tracking post-migration token performance.",
  },
  {
    term: "LayerZero OFT",
    definition:
      "Omnichain Fungible Token \u2014 LayerZero\u2019s standard for cross-chain token transfers.",
  },
  {
    term: "MDS",
    definition:
      "Migration Demand Score \u2014 Tideshift\u2019s proprietary 0\u2013100 score measuring real migration demand.",
  },
  {
    term: "NTT",
    definition:
      "Native Token Transfers \u2014 Wormhole\u2019s framework for canonical cross-chain token representation (Sunrise\u2019s preferred).",
  },
  {
    term: "Origin Chain",
    definition:
      "The blockchain where a token was originally deployed before migration.",
  },
  {
    term: "Search Intent",
    definition:
      "Normalized score measuring DEX trading activity, pair availability, and boost/trending status.",
  },
  {
    term: "Signal",
    definition:
      "One of 5 data categories (bridge, search, social, chain health, wallet overlap) feeding the MDS.",
  },
  {
    term: "TVL",
    definition:
      "Total Value Locked \u2014 aggregate value deposited in DeFi protocols.",
  },
  {
    term: "Wallet Overlap",
    definition:
      "Estimated percentage of a token\u2019s holders who also maintain active Solana wallets.",
  },
  {
    term: "Weight Redistribution",
    definition:
      "When a signal is unavailable, its scoring weight is redistributed proportionally to available signals.",
  },
];

export function GlossarySection() {
  return (
    <DocsSection
      id="glossary"
      title="Glossary"
      icon={BookOpen}
      description="Key terms and definitions"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {glossaryTerms.map((item) => (
          <Card key={item.term} className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm font-bold mb-1">{item.term}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.definition}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DocsSection>
  );
}
