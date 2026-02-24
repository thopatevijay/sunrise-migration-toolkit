import {
  BarChart3,
  Hash,
  TrendingUp,
  ArrowRightLeft,
  Trophy,
  ArrowUpDown,
  Search,
  Filter,
  MousePointerClick,
  BarChart,
  Layers,
  Sparkles,
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

const kpis = [
  {
    icon: Hash,
    title: "Migration Candidates",
    description: "Total tokens scored by the MDS engine across all tracked chains.",
  },
  {
    icon: TrendingUp,
    title: "Average MDS",
    description:
      "Mean Migration Demand Score across all candidates. A rising average signals growing ecosystem-wide demand.",
  },
  {
    icon: ArrowRightLeft,
    title: "7d Bridge Volume",
    description:
      "Total cross-chain bridge outflow volume in the last 7 days, aggregated from WormholeScan data.",
  },
  {
    icon: Trophy,
    title: "Top Demand",
    description:
      "The token with the highest current MDS score — the strongest migration candidate right now.",
  },
];

const columns = [
  { column: "Rank", description: "Position by MDS score (highest first)" },
  { column: "Token", description: "Name, symbol, and origin chain badge" },
  {
    column: "MDS",
    description: "Migration Demand Score (0\u2013100) with color-coded badge",
  },
  {
    column: "Bridge Vol",
    description: "7-day cross-chain bridge outflow volume in USD",
  },
  {
    column: "Market Cap",
    description: "Current market capitalization on origin chain",
  },
  {
    column: "Search",
    description: "Search intent score with visual progress bar",
  },
  {
    column: "7d Change",
    description: "7-day price change percentage with trend arrow",
  },
];

const chartTabs = [
  {
    icon: BarChart,
    title: "Bridge Outflows",
    description:
      "Bar chart showing the top 5 tokens by 7-day bridge volume. Highlights where capital is actively leaving other chains.",
  },
  {
    icon: Search,
    title: "Search Intent",
    description:
      "Bar chart showing the top 5 tokens by search intent score. Derived from DEX volume, pair count, and listing gaps on Jupiter.",
  },
  {
    icon: Layers,
    title: "MDS Breakdown",
    description:
      "Stacked area chart showing weighted signal contributions for the top 5 tokens. See how Bridge, Search, Social, Chain Health, and Wallet Overlap contribute to each token\u2019s MDS.",
  },
];

export function DashboardSection() {
  return (
    <DocsSection
      id="dashboard"
      title="Dashboard"
      icon={BarChart3}
      description="The main command center for migration demand discovery"
    >
      {/* Stats Bar */}
      <div>
        <h3 className="text-base font-semibold mb-3">Stats Bar</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Four KPI cards across the top of the dashboard provide an at-a-glance
          summary of the migration landscape.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.title} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <kpi.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{kpi.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Token Rankings Table */}
      <div>
        <h3 className="text-base font-semibold mb-3">Token Rankings Table</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The primary ranking view lists every scored token with sortable
          columns, search, and chain filters.
        </p>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columns.map((c) => (
                <TableRow key={c.column}>
                  <TableCell className="font-mono text-sm whitespace-nowrap">
                    {c.column}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {c.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="gap-1 text-xs">
            <ArrowUpDown className="h-3 w-3" />
            Sortable columns
          </Badge>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Search className="h-3 w-3" />
            Search by name / symbol
          </Badge>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Filter className="h-3 w-3" />
            Filter by origin chain
          </Badge>
          <Badge variant="secondary" className="gap-1 text-xs">
            <MousePointerClick className="h-3 w-3" />
            Click row for detail
          </Badge>
        </div>
      </div>

      {/* Demand Charts */}
      <div>
        <h3 className="text-base font-semibold mb-3">Demand Charts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Three tabbed chart views visualize the top demand signals across the
          candidate pool.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chartTabs.map((tab) => (
            <Card key={tab.title} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <tab.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{tab.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tab.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Onboarding Analytics */}
      <div>
        <h3 className="text-base font-semibold mb-3">Onboarding Analytics</h3>
        <p className="text-sm text-muted-foreground mb-3">
          A community onboarding conversion funnel backed by Upstash Redis.
          Shows unique visitor counts at each step of the guided migration flow:
        </p>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="text-muted-foreground">Welcome</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="text-muted-foreground">Wallet</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="text-muted-foreground">Bridge</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="text-muted-foreground">Trade</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="text-muted-foreground">DeFi</span>
          </div>
        </div>
        <DocsCallout type="info" title="Real data">
          Funnel data is real, tracked via anonymous session IDs stored in
          Upstash Redis. No PII is collected. Each step records unique visitor
          counts to measure drop-off and conversion rates.
        </DocsCallout>
      </div>

      {/* Migrated Tokens Banner */}
      <div>
        <h3 className="text-base font-semibold mb-3">
          Migrated Tokens Banner
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          A horizontal scroll at the bottom of the dashboard highlights tokens
          that have already successfully migrated to Solana via Sunrise:
        </p>
        <div className="flex flex-wrap gap-2">
          {["RENDER", "HNT", "POWR", "GEOD"].map((token) => (
            <Badge key={token} variant="outline" className="gap-1.5 text-xs">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              {token}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Click any migrated token to jump to the Migration Health page and
          review its post-migration performance.
        </p>
        <div className="mt-4">
          <DocsCallout type="info" title="Source of truth">
            These 4 tokens were identified from Sunrise&apos;s (by Wormhole)
            public portfolio of completed migrations. Each project publicly
            announced its move to Solana &mdash; RENDER migrated in Nov 2023,
            HNT (Helium) in Apr 2023, POWR (Power Ledger) via Wormhole NTT in
            Feb 2025, and GEOD (GEODNET) in Sep 2024. Their Solana mint
            addresses are verified on-chain and stored in{" "}
            <span className="font-mono text-xs text-foreground">
              MIGRATED_TOKENS
            </span>{" "}
            inside{" "}
            <span className="font-mono text-xs text-foreground">
              lib/config/tokens.ts
            </span>
            . All live metrics (price, volume, health scores) are fetched from
            CoinGecko and WormholeScan at runtime &mdash; only the token
            registry itself is static.
          </DocsCallout>
        </div>
      </div>
    </DocsSection>
  );
}
