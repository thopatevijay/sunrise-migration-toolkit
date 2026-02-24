import {
  Coins,
  Radar,
  BarChart3,
  ArrowRightLeft,
  Search,
  MessageCircle,
  Server,
  Wallet,
  LineChart,
  CheckCircle2,
  GitCompare,
  FileText,
} from "lucide-react";
import { DocsSection } from "@/components/docs/docs-section";
import { DocsCallout } from "@/components/docs/docs-callout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const signals = [
  {
    icon: ArrowRightLeft,
    title: "Bridge Outflow",
    weight: "30%",
    description:
      "7-day cross-chain bridge volume leaving the token\u2019s origin chain, displayed as a total USD figure.",
    details:
      "Data sourced from WormholeScan when available. Tokens without direct bridge data show estimated values derived from market volume with a 50% confidence discount.",
    badgeLabel: "Live or Estimated",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    icon: Search,
    title: "Search Intent",
    weight: "25%",
    description:
      "Composite score from 24h DEX volume, pair count, liquidity depth, Solana pair count, and boost/trending score from DexScreener.",
    details:
      "Tokens that are NOT listed on Jupiter receive a +15 \u201cunmet demand\u201d bonus, reflecting genuine demand without an existing Solana venue.",
    badgeLabel: "+15 unmet demand bonus",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    icon: MessageCircle,
    title: "Social Demand",
    weight: "20%",
    description:
      "Community score built from Twitter followers, Reddit subscribers, and Reddit active users. Includes a sentiment percentage.",
    details:
      "All social data is sourced from CoinGecko\u2019s community data endpoints. Sentiment reflects the ratio of positive to total social mentions.",
    badgeLabel: "CoinGecko community",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    icon: Server,
    title: "Chain Health",
    weight: "15%",
    description:
      "Market cap, 24h volume, TVL (DefiLlama), and holder count. Measures the token\u2019s strength on its current chain.",
    details:
      "Holder counts use the Helius DAS API for real on-chain data when a Solana mint exists. Otherwise, an estimated count is shown with an \u201c(est.)\u201d label.",
    badgeLabel: "Helius DAS for on-chain",
    badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  {
    icon: Wallet,
    title: "Wallet Overlap",
    weight: "10%",
    description:
      "Estimated percentage of token holders who also have active Solana wallets.",
    details:
      "Uses a heuristic model based on chain proximity, category affinity, and DefiLlama TVL ratios. Always marked as \u201cEstimated\u201d since true cross-chain wallet mapping requires private data.",
    badgeLabel: "Always estimated",
    badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
];

const additionalSections = [
  {
    icon: LineChart,
    title: "Price Chart",
    description:
      "30-day price history rendered as an area chart. Data sourced from CoinGecko\u2019s market chart endpoint with daily granularity.",
  },
  {
    icon: CheckCircle2,
    title: "Migration Readiness",
    description:
      "A checklist evaluating NTT (Native Token Transfer) compatibility, team accessibility and responsiveness, and existing bridge availability for the token.",
  },
  {
    icon: GitCompare,
    title: "Similar Tokens",
    description:
      "Related tokens in the same category that are already live on Solana. Helps contextualize demand by showing comparable migrations that succeeded.",
  },
  {
    icon: FileText,
    title: "Generate Proposal",
    description:
      "One-click button to auto-generate a structured migration proposal with bridge recommendations, liquidity estimates, and risk assessment.",
  },
];

export function TokenDetailSection() {
  return (
    <DocsSection
      id="token-detail"
      title="Token Detail"
      icon={Coins}
      description="Deep-dive into any token's migration demand signals"
    >
      {/* MDS Score Ring */}
      <div>
        <h3 className="text-base font-semibold mb-3">MDS Score Ring</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A large circular progress ring dominates the top of the detail page,
          displaying the token&apos;s overall Migration Demand Score from 0 to
          100. The ring color shifts dynamically based on score range:{" "}
          <span className="font-mono text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">
            0&ndash;29 red
          </span>{" "}
          <span className="font-mono text-xs bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded">
            30&ndash;59 yellow
          </span>{" "}
          <span className="font-mono text-xs bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
            60&ndash;79 green
          </span>{" "}
          <span className="font-mono text-xs bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">
            80&ndash;100 cyan
          </span>
          . This is the single most important indicator of migration demand.
        </p>
      </div>

      {/* Score Breakdown */}
      <div>
        <h3 className="text-base font-semibold mb-3">Score Breakdown</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Two complementary visualizations show how the MDS is composed:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                  <Radar className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold">Radar Chart</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                5-axis spider chart showing each signal&apos;s normalized score
                (0&ndash;100). Quickly reveals a token&apos;s demand profile
                shape &mdash; whether it&apos;s bridge-heavy, socially driven,
                or balanced.
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold">
                  Weighted Bar Chart
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Shows raw score, weight, and weighted contribution for each
                signal side by side. Makes it clear exactly how many points each
                signal adds to the final MDS.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Signal Cards */}
      <div>
        <h3 className="text-base font-semibold mb-3">Signal Cards</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Five expandable cards, each tracking a different demand signal that
          feeds into the MDS calculation:
        </p>
        <div className="space-y-3">
          {signals.map((signal) => (
            <Card key={signal.title} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <signal.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold">
                        {signal.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px]"
                      >
                        {signal.weight} weight
                      </Badge>
                      <Badge
                        className={`text-[10px] border ${signal.badgeColor}`}
                      >
                        {signal.badgeLabel}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {signal.description}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {signal.details}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Additional Sections */}
      <div>
        <h3 className="text-base font-semibold mb-3">Additional Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalSections.map((section) => (
            <Card key={section.title} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{section.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tip Callout */}
      <DocsCallout type="tip" title="Generate a Proposal">
        Click &ldquo;Generate Proposal&rdquo; on any token detail page to create
        a structured migration proposal with bridge recommendations, liquidity
        estimates, and risk assessment.
      </DocsCallout>
    </DocsSection>
  );
}
