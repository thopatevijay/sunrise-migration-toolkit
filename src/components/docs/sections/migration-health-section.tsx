import {
  Activity,
  TrendingUp,
  ArrowUpDown,
  BarChart3,
  Calendar,
  DollarSign,
  LineChart,
} from "lucide-react";
import { DocsSection } from "@/components/docs/docs-section";
import { DocsCallout } from "@/components/docs/docs-callout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const scoreComponents = [
  {
    name: "Volume Score",
    weight: "0.30",
    description:
      "Trading volume relative to market cap. Healthy tokens show active, consistent trading activity.",
  },
  {
    name: "Stability Score",
    weight: "0.30",
    description:
      "30-day price direction. Positive price movement scores higher, indicating post-migration growth and adoption.",
  },
  {
    name: "Bridge Score",
    weight: "0.20",
    description:
      "Ongoing bridge activity volume, log-scaled. Shows continued interest in cross-chain movement.",
  },
  {
    name: "Momentum Score",
    weight: "0.20",
    description:
      "7-day price momentum. Positive momentum signals growth and ecosystem adoption.",
  },
];

const statusThresholds = [
  {
    range: "70 - 100",
    status: "Healthy",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    meaning: "Strong post-migration performance",
  },
  {
    range: "40 - 69",
    status: "Moderate",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    meaning: "Acceptable but needs monitoring",
  },
  {
    range: "0 - 39",
    status: "Concerning",
    color: "text-red-400",
    bg: "bg-red-500/10",
    meaning: "Potential issues, may need intervention",
  },
];

const metricsDisplayed = [
  { icon: DollarSign, label: "Current price" },
  { icon: BarChart3, label: "Market cap" },
  { icon: Activity, label: "24h volume" },
  { icon: TrendingUp, label: "7d price change with trend arrow" },
  { icon: LineChart, label: "30-day price sparkline" },
  { icon: ArrowUpDown, label: "7d bridge volume with trend indicator" },
  { icon: Calendar, label: "Days since migration" },
];

export function MigrationHealthSection() {
  return (
    <DocsSection
      id="migration-health"
      title="Migration Health"
      icon={Activity}
      description="Post-migration monitoring for tokens already on Solana"
    >
      {/* Overview */}
      <div>
        <h3 className="text-base font-semibold mb-3">Overview</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Migration Health tracks the ongoing performance of tokens that have
          already migrated to Solana via Sunrise. It answers the question: is
          the migration succeeding? Currently monitors{" "}
          <span className="text-foreground font-medium">RENDER</span>,{" "}
          <span className="text-foreground font-medium">HNT</span> (Helium),{" "}
          <span className="text-foreground font-medium">POWR</span>{" "}
          (Powerledger), and{" "}
          <span className="text-foreground font-medium">GEOD</span> (GEODNET).
        </p>
      </div>

      {/* Health Score Formula */}
      <div>
        <h3 className="text-base font-semibold mb-3">Health Score Formula</h3>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-4 mb-4">
          <pre className="font-mono text-sm text-foreground leading-relaxed">
{`healthScore = volumeScore    x 0.30
            + stabilityScore x 0.30
            + bridgeScore    x 0.20
            + momentumScore  x 0.20`}
          </pre>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoreComponents.map((c) => (
            <Card key={c.name} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold">{c.name}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {c.weight}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {c.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Status Thresholds */}
      <div>
        <h3 className="text-base font-semibold mb-3">Status Thresholds</h3>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.08]">
                <TableHead className="text-xs">Score</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Meaning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusThresholds.map((t) => (
                <TableRow key={t.status} className="border-white/[0.08]">
                  <TableCell className="font-mono text-sm">
                    {t.range}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${t.color} ${t.bg} border-0 text-xs`}
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.meaning}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Metrics Displayed */}
      <div>
        <h3 className="text-base font-semibold mb-3">Metrics Displayed</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Each migration health card surfaces the following data points:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {metricsDisplayed.map((m) => (
            <div
              key={m.label}
              className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2"
            >
              <m.icon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      <DocsCallout type="info" title="Data Freshness">
        Health scores recalculate on each page load using live market data from
        CoinGecko and bridge data from WormholeScan. Sparklines reflect the most
        recent 30-day window.
      </DocsCallout>
    </DocsSection>
  );
}
