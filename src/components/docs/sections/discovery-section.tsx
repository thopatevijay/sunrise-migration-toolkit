import {
  Globe,
  Search,
  ArrowDownUp,
  Download,
  ThumbsUp,
  Zap,
  Filter,
  ExternalLink,
} from "lucide-react";
import { DocsSection } from "@/components/docs/docs-section";
import { DocsCallout } from "@/components/docs/docs-callout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pipelineSteps = [
  {
    step: 1,
    label: "Fetch top 500 tokens",
    detail: "CoinGecko /coins/markets — 2 calls, 250 per page",
  },
  {
    step: 2,
    label: "Fetch all coins with platform data",
    detail: "CoinGecko /coins/list?include_platform=true",
  },
  {
    step: 3,
    label: "Cross-reference",
    detail: "Filter out tokens that already have a Solana contract address",
  },
  {
    step: 4,
    label: "Exclude & threshold",
    detail: "Remove stablecoins (USDT, USDC, DAI, etc.) and tokens under $5M market cap",
  },
  {
    step: 5,
    label: "Result",
    detail: "~300 tokens without Solana presence, ranked by market cap, cached 60 min",
  },
];

const tableFeatures = [
  {
    icon: Filter,
    title: "Pagination",
    description: "25, 50, 100, 200, or all tokens per page",
  },
  {
    icon: Search,
    title: "Search",
    description: "Filter by token name, symbol, or origin chain",
  },
  {
    icon: ArrowDownUp,
    title: "Sort",
    description: "Rank, market cap, 24h volume, 7d change, demand votes, MDS score",
  },
  {
    icon: Download,
    title: "CSV Export",
    description: "Download the full filtered dataset (includes CoinGecko URLs)",
  },
  {
    icon: ExternalLink,
    title: "External Links",
    description: "Click any row to view on CoinGecko",
  },
];

export function DiscoverySection() {
  return (
    <DocsSection
      id="discovery"
      title="Discovery"
      icon={Globe}
      description="Scan the top 500 tokens to find migration candidates"
    >
      {/* Methodology */}
      <div>
        <h3 className="text-base font-semibold mb-3">Methodology</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Discovery scans the top 500 tokens by market cap and isolates those
          without a Solana presence — surfacing the best migration candidates for
          the Sunrise team.
        </p>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-4 space-y-3">
          {pipelineSteps.map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{s.step}</span>
              </div>
              <div>
                <span className="font-mono text-sm text-foreground">
                  {s.label}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Features */}
      <div>
        <h3 className="text-base font-semibold mb-3">Table Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tableFeatures.map((f) => (
            <Card key={f.title} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <f.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{f.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demand Votes */}
      <div>
        <h3 className="text-base font-semibold mb-3">Demand Votes</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Community-driven demand signalling lets visitors express which tokens
          they want on Solana.
        </p>
        <div className="space-y-2">
          {[
            {
              icon: ThumbsUp,
              text: "Each visitor gets an anonymous user ID (stored in localStorage)",
            },
            {
              icon: ThumbsUp,
              text: "One vote per token per user — no spam",
            },
            {
              icon: ThumbsUp,
              text: "Votes are persisted in Upstash Redis (survive page reloads and deployments)",
            },
            {
              icon: ThumbsUp,
              text: 'Vote counts visible in the "Demand" column, sorted by popularity',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <item.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* On-Demand MDS Scoring */}
      <div>
        <h3 className="text-base font-semibold mb-3">On-Demand MDS Scoring</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Score any token directly from the discovery table without leaving the
          page.
        </p>
        <div className="space-y-2">
          {[
            {
              icon: Zap,
              text: 'Click the "Score" (zap icon) button next to any token',
            },
            {
              icon: Zap,
              text: "Fetches all 5 signal categories in real time via POST /api/tokens/score",
            },
            {
              icon: Zap,
              text: "Displays the MDS badge inline once computed",
            },
            {
              icon: Zap,
              text: "Cached per token for 5 minutes",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <item.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Example
          </Badge>
          <span className="text-xs text-muted-foreground">
            Click <Zap className="inline h-3 w-3 text-primary" /> on AVAX →
            fetches signals → shows{" "}
            <Badge className="text-[10px] px-1.5 py-0">MDS 72</Badge> inline
          </span>
        </div>
      </div>

      <DocsCallout type="info">
        Discovery data refreshes every 60 minutes. The list updates
        automatically as tokens launch Solana contracts or cross the $5M market
        cap threshold.
      </DocsCallout>
    </DocsSection>
  );
}
