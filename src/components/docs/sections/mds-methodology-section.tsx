import { Target, BarChart3 } from "lucide-react";
import { DocsSection } from "@/components/docs/docs-section";
import { DocsCallout } from "@/components/docs/docs-callout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const signals = [
  {
    signal: "Bridge Outflow",
    weight: "30%",
    source: "WormholeScan",
    measures: "Cross-chain bridge volume for this token",
  },
  {
    signal: "Search Intent",
    weight: "25%",
    source: "DexScreener + Jupiter",
    measures: "DEX trading activity and Solana listing status",
  },
  {
    signal: "Social Demand",
    weight: "20%",
    source: "CoinGecko",
    measures: "Community size, engagement, and sentiment",
  },
  {
    signal: "Chain Health",
    weight: "15%",
    source: "CoinGecko + DefiLlama",
    measures: "Origin chain fundamentals (mcap, volume, TVL)",
  },
  {
    signal: "Wallet Overlap",
    weight: "10%",
    source: "Heuristic + DefiLlama",
    measures: "Estimated Solana wallet presence among holders",
  },
];

const normalizationDetails = [
  {
    title: "Bridge Outflow",
    details:
      "avgDaily from 7d/30d volumes, normalized to 0\u2013100 (max ~$500K/day)",
  },
  {
    title: "Search Intent",
    details:
      "35% DEX volume ($1M+ = max) + 25% txn count (10K+ = max) + 15% liquidity ($5M+ = max) + 15% pair count + unmet demand bonus (+15 if NOT on Jupiter) + boost bonus",
  },
  {
    title: "Social Demand",
    details:
      "60% community score + 25% sentiment + 15% reddit engagement. Community score = 40% Twitter followers + 20% Reddit subs + 20% Reddit active + 20% sentiment votes",
  },
  {
    title: "Chain Health",
    details:
      "30% mcap ($5B+ = max) + 25% volume ($500M+ = max) + 25% TVL ($5B+ = max) + 20% holders (500K+ = max)",
  },
  {
    title: "Wallet Overlap",
    details:
      "Chain proximity model (Arbitrum 18%, Optimism 16%, Ethereum 15%, Base 14%) \u00d7 category affinity \u00d7 DefiLlama TVL ratios",
  },
];

const scoreRanges = [
  { range: "90\u2013100", label: "Extremely High Demand", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { range: "70\u201389", label: "Strong Demand", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { range: "50\u201369", label: "Moderate Demand", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { range: "30\u201349", label: "Emerging Demand", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { range: "0\u201329", label: "Low Demand", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

export function MdsMethodologySection() {
  return (
    <DocsSection
      id="mds-methodology"
      title="MDS Methodology"
      icon={Target}
      description="How the Migration Demand Score is calculated"
    >
      {/* Signal Categories */}
      <div>
        <h3 className="text-base font-semibold mb-3">Signal Categories</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The MDS is composed of five weighted signals, each capturing a
          different dimension of migration demand.
        </p>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Signal</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>What It Measures</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signals.map((s) => (
                <TableRow key={s.signal}>
                  <TableCell className="font-mono text-sm whitespace-nowrap">
                    {s.signal}
                  </TableCell>
                  <TableCell className="text-sm font-semibold">
                    {s.weight}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.source}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.measures}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Normalization Details */}
      <div>
        <h3 className="text-base font-semibold mb-3">Normalization Details</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Each signal is normalized to a 0&ndash;100 scale using sub-metric
          breakdowns specific to the data source.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {normalizationDetails.map((nd) => (
            <Card key={nd.title} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{nd.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                  {nd.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Score Calculation */}
      <div>
        <h3 className="text-base font-semibold mb-3">Score Calculation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The final MDS is a weighted sum with dynamic rescaling when signals
          are missing.
        </p>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-4">
          <pre className="font-mono text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
{`available_weight = sum(weight_i for signals with data)
scale = 1 / available_weight
MDS = sum(normalized_i × weight_i) × scale   (clamped 0-100)
confidence = available_signals / 5            (0.0 to 1.0)`}
          </pre>
        </div>
      </div>

      {/* Score Ranges */}
      <div>
        <h3 className="text-base font-semibold mb-3">Score Ranges</h3>
        <div className="flex flex-wrap gap-3">
          {scoreRanges.map((sr) => (
            <div
              key={sr.range}
              className={`rounded-lg border px-4 py-2.5 ${sr.color}`}
            >
              <span className="font-mono text-sm font-bold">{sr.range}</span>
              <span className="ml-2 text-sm">{sr.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Partial Data Handling */}
      <div>
        <h3 className="text-base font-semibold mb-3">Partial Data Handling</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          When a signal is unavailable (API down, rate limited, or no data for
          that token), its weight is redistributed proportionally to the
          available signals. The confidence score drops accordingly. For example,
          a token with 3 out of 5 signals available gets a confidence score of
          0.6. This ensures every token receives a score even with incomplete
          data, while clearly indicating data completeness.
        </p>
      </div>

      {/* Bridge Estimation Discount */}
      <div>
        <h3 className="text-base font-semibold mb-3">
          Bridge Estimation Discount
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          When WormholeScan lacks data for a specific token, bridge volume is
          estimated from the token&apos;s market cap and volume ratio. This
          estimated data receives a{" "}
          <span className="font-semibold text-foreground">
            50% confidence discount
          </span>{" "}
          &mdash; the effective weight drops from 30% to 15%. This prevents
          speculative estimates from dominating the score while still
          incorporating partial bridge intelligence.
        </p>
      </div>

      <DocsCallout type="info" title="Demand, not popularity">
        The MDS is designed to surface real demand, not popularity. A token with
        low social following but high bridge activity and search intent may score
        higher than a well-known token with no cross-chain movement.
      </DocsCallout>
    </DocsSection>
  );
}
