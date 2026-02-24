import {
  Database,
  Globe,
  Key,
  HardDrive,
  Clock,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import { DocsSection } from "@/components/docs/docs-section";
import { DocsCallout } from "@/components/docs/docs-callout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tier1 = [
  {
    provider: "WormholeScan",
    baseUrl: "api.wormholescan.io",
    data: "Bridge volumes, scorecards",
    rateLimit: "1000/min",
  },
  {
    provider: "DefiLlama",
    baseUrl: "api.llama.fi",
    data: "TVL, protocols, bridge volumes, DeFi APYs",
    rateLimit: "~100/min",
  },
  {
    provider: "DexScreener",
    baseUrl: "api.dexscreener.com",
    data: "DEX pairs, volume, liquidity, boosts",
    rateLimit: "300/min",
  },
  {
    provider: "Jupiter",
    baseUrl: "lite-api.jup.ag",
    data: "Token listing verification, prices",
    rateLimit: "60/min",
  },
];

const tier2 = [
  {
    provider: "CoinGecko",
    data: "Market data, community/social data, platform lookups",
    rateLimit: "10\u201330/min",
  },
  {
    provider: "Helius",
    data: "Real SPL token holder counts (DAS API)",
    rateLimit: "10 rps",
  },
];

const tier3 = [
  {
    service: "Upstash Redis",
    purpose: "Community demand votes, onboarding analytics",
    freeTier: "10K commands/day",
  },
];

const cachingStrategy = [
  { dataType: "Market data", ttl: "2 min", reason: "Prices change frequently" },
  { dataType: "Bridge data", ttl: "5 min", reason: "Volume updates regularly" },
  { dataType: "Search/DEX data", ttl: "10 min", reason: "Moderately stable" },
  { dataType: "Social data", ttl: "15 min", reason: "Changes slowly" },
  { dataType: "Wallet overlap", ttl: "30 min", reason: "Heuristic, infrequent" },
  { dataType: "Holder counts", ttl: "30 min", reason: "On-chain, changes slowly" },
  { dataType: "Protocol list", ttl: "1 hour", reason: "Rarely changes" },
  { dataType: "Token discovery", ttl: "1 hour", reason: "Top-500 list is stable" },
  { dataType: "API response", ttl: "3 min", reason: "Full dashboard cache" },
];

const errorPipeline = [
  { step: 1, label: "Check in-memory cache \u2192 return if valid" },
  { step: 2, label: "Call live API with 10s timeout + 1 retry on 5xx" },
  { step: 3, label: "On success \u2192 cache result \u2192 return" },
  {
    step: 4,
    label:
      "On failure \u2192 return null \u2192 scoring engine uses available signals only",
  },
];

export function DataSourcesSection() {
  return (
    <DocsSection
      id="data-sources"
      title="Data Sources"
      icon={Database}
      description="All APIs, caching, and health monitoring"
    >
      {/* Tier 1 */}
      <div>
        <h3 className="text-base font-semibold mb-3">
          <span className="inline-flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Tier 1: Free, No Auth Required
          </span>
        </h3>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Base URL</TableHead>
                <TableHead>Data Provided</TableHead>
                <TableHead>Rate Limit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tier1.map((t) => (
                <TableRow key={t.provider}>
                  <TableCell className="font-semibold text-sm whitespace-nowrap">
                    {t.provider}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {t.baseUrl}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.data}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {t.rateLimit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tier 2 */}
      <div>
        <h3 className="text-base font-semibold mb-3">
          <span className="inline-flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            Tier 2: Free with API Key
          </span>
        </h3>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Data Provided</TableHead>
                <TableHead>Rate Limit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tier2.map((t) => (
                <TableRow key={t.provider}>
                  <TableCell className="font-semibold text-sm whitespace-nowrap">
                    {t.provider}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.data}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {t.rateLimit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tier 3 */}
      <div>
        <h3 className="text-base font-semibold mb-3">
          <span className="inline-flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-primary" />
            Tier 3: Persistent Storage
          </span>
        </h3>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Free Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tier3.map((t) => (
                <TableRow key={t.service}>
                  <TableCell className="font-semibold text-sm whitespace-nowrap">
                    {t.service}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.purpose}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {t.freeTier}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Caching Strategy */}
      <div>
        <h3 className="text-base font-semibold mb-3">
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Caching Strategy
          </span>
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          All API responses are cached in-memory with TTLs tuned to each data
          type&apos;s volatility.
        </p>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data Type</TableHead>
                <TableHead>TTL</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cachingStrategy.map((c) => (
                <TableRow key={c.dataType}>
                  <TableCell className="font-mono text-sm whitespace-nowrap">
                    {c.dataType}
                  </TableCell>
                  <TableCell className="text-sm font-semibold whitespace-nowrap">
                    {c.ttl}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.reason}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Health Monitoring */}
      <div>
        <h3 className="text-base font-semibold mb-3">
          <span className="inline-flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-primary" />
            Health Monitoring
          </span>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Every API call uses{" "}
          <span className="font-mono text-sm text-foreground">
            trackedFetch()
          </span>{" "}
          which records latency, success/failure, and consecutive failure count
          per provider. Status is derived from consecutive failures:
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
            <span className="font-mono text-sm font-bold text-emerald-400">
              0 failures
            </span>
            <span className="ml-2 text-sm text-emerald-400">
              Healthy
            </span>
          </div>
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2">
            <span className="font-mono text-sm font-bold text-yellow-400">
              1\u20132 failures
            </span>
            <span className="ml-2 text-sm text-yellow-400">
              Degraded
            </span>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2">
            <span className="font-mono text-sm font-bold text-red-400">
              3+ failures
            </span>
            <span className="ml-2 text-sm text-red-400">Down</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          The API Health Board in the sidebar shows real-time status of all
          providers.
        </p>
      </div>

      {/* Error Handling */}
      <div>
        <h3 className="text-base font-semibold mb-3">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Error Handling
          </span>
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          A 4-step pipeline ensures graceful degradation when any provider is
          unreachable.
        </p>
        <div className="space-y-2">
          {errorPipeline.map((ep) => (
            <div
              key={ep.step}
              className="flex items-start gap-3 rounded-lg bg-white/[0.03] border border-white/[0.08] p-3"
            >
              <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {ep.step}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {ep.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <DocsCallout type="tip" title="Resilient by design">
        The entire data pipeline is built around the assumption that any API can
        fail at any time. Caching, retries, and graceful signal omission ensure
        the dashboard always loads with the best available data.
      </DocsCallout>
    </DocsSection>
  );
}
