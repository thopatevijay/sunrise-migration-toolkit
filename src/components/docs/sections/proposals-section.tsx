import {
  FileText,
  Sparkles,
  GitBranch,
  Droplets,
  Copy,
  Trash2,
  ExternalLink,
  Eye,
  AlertTriangle,
  Bot,
  RefreshCw,
  Palette,
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

const bridgeLogic = [
  {
    condition: "Origin chain supports Wormhole",
    recommendation: "NTT (Wormhole Native Token Transfers)",
    detail: "Sunrise's preferred framework for native token migrations",
  },
  {
    condition: "Wormhole not supported",
    recommendation: "CCIP (Chainlink) or LayerZero OFT",
    detail: "Alternative cross-chain protocols with broad chain coverage",
  },
];

const poolAllocations = [
  { venue: "Jupiter", pair: "TOKEN/USDC", allocation: "40%" },
  { venue: "Raydium", pair: "TOKEN/SOL", allocation: "30%" },
  { venue: "Orca", pair: "TOKEN/USDC", allocation: "20%" },
  { venue: "Kamino", pair: "TOKEN Lending", allocation: "10%" },
];

const riskFactors = [
  {
    factor: "Supply Concentration",
    severity: "High",
    severityColor: "text-red-400",
    severityBg: "bg-red-500/10",
    trigger: "Total-to-circulating supply ratio > 3",
  },
  {
    factor: "Low Wallet Overlap",
    severity: "Medium",
    severityColor: "text-yellow-400",
    severityBg: "bg-yellow-500/10",
    trigger: "Less than 15% Solana wallet overlap",
  },
  {
    factor: "Declining Bridge Activity",
    severity: "Medium",
    severityColor: "text-yellow-400",
    severityBg: "bg-yellow-500/10",
    trigger: "Bridge outflow trend is falling",
  },
  {
    factor: "Negative Sentiment",
    severity: "Medium",
    severityColor: "text-yellow-400",
    severityBg: "bg-yellow-500/10",
    trigger: "Community sentiment score below 0",
  },
  {
    factor: "Low TVL vs Market Cap",
    severity: "Low",
    severityColor: "text-blue-400",
    severityBg: "bg-blue-500/10",
    trigger: "TVL under $10M with market cap over $100M",
  },
];

const proposalActions = [
  { icon: Copy, label: "Copy to clipboard", description: "Share the full proposal as formatted text" },
  { icon: Trash2, label: "Delete", description: "Remove a saved proposal from localStorage" },
  { icon: Eye, label: "View token detail", description: "Jump back to the token's signal analysis page" },
  { icon: ExternalLink, label: "Submit to Sunrise", description: "Open an external link to submit for review" },
];

export function ProposalsSection() {
  return (
    <DocsSection
      id="proposals"
      title="Proposals"
      icon={FileText}
      description="Auto-generated migration proposals with actionable analysis"
    >
      {/* How Proposals Work */}
      <div>
        <h3 className="text-base font-semibold mb-3">How Proposals Work</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Proposals turn raw signal data into structured, actionable migration
          documents. Powered by GPT-4o-mini with real-time token data.
        </p>
        <div className="space-y-2">
          {[
            {
              icon: Sparkles,
              text: 'Navigate to any token detail page and click "Generate Proposal"',
            },
            {
              icon: Palette,
              text: "Choose a tone: Executive (board-ready), Technical (protocol-focused), or Community (holder-friendly)",
            },
            {
              icon: Bot,
              text: "AI streams a narrative analysis using live token data — demand evidence, risk narrative, bridge strategy, liquidity plan, and timeline",
            },
            {
              icon: RefreshCw,
              text: 'Click "Regenerate" to get a fresh analysis, or switch tones for a different audience',
            },
            {
              icon: Sparkles,
              text: "Proposals are saved to localStorage and accessible from the Proposals page",
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

      {/* AI Tones */}
      <div>
        <h3 className="text-base font-semibold mb-3">AI Analysis Tones</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          The same token data produces distinctly different analysis depending on the audience.
        </p>
        <div className="space-y-3">
          {[
            {
              tone: "Executive",
              audience: "Sunrise leadership",
              style: "Concise, strategic, ROI-focused. Leads with the verdict, backs it with evidence.",
              example: "\"Bridge outflows of $28.8M signal steady cross-chain demand — Solana users are actively leaving other chains to access this asset.\"",
            },
            {
              tone: "Technical",
              audience: "Engineering team",
              style: "Precise, protocol-aware. References bridge mechanics, pool math, and integration complexity.",
              example: "\"NTT via Wormhole is recommended given Ethereum-origin with existing Guardian support. Initial pool deployment: 40% Jupiter CLMM, 30% Raydium concentrated.\"",
            },
            {
              tone: "Community",
              audience: "Token holders",
              style: "Approachable, holder-friendly. Explains in plain language what migration means for you.",
              example: "\"Your tokens will be available on Solana with near-instant swaps on Jupiter. Bridge takes under a minute, and you can start earning yield on day one.\"",
            },
          ].map((t) => (
            <Card key={t.tone} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-semibold">
                    {t.tone}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    for {t.audience}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{t.style}</p>
                <div className="rounded bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                  <p className="text-xs text-muted-foreground italic">{t.example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <DocsCallout type="info" title="Classic fallback">
          If the OpenAI API key is not configured or the AI service is
          unavailable, proposals automatically fall back to the rule-based
          analysis engine. Click &ldquo;Switch to Classic&rdquo; to use it
          manually.
        </DocsCallout>
      </div>

      {/* Bridge Recommendation */}
      <div>
        <h3 className="text-base font-semibold mb-3">Bridge Recommendation</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          The proposal engine automatically selects the best bridge based on the
          token&apos;s origin chain.
        </p>
        <div className="space-y-3">
          {bridgeLogic.map((b) => (
            <Card key={b.condition} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <GitBranch className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-semibold">
                    {b.recommendation}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">When:</span>{" "}
                  {b.condition}
                </p>
                <p className="text-xs text-muted-foreground">{b.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <DocsCallout type="tip" title="Alternative Bridges">
          Every proposal lists alternative bridge options with pros and cons, so
          the Sunrise team can make an informed choice even when the primary
          recommendation doesn&apos;t fit.
        </DocsCallout>
      </div>

      {/* Liquidity Estimates */}
      <div>
        <h3 className="text-base font-semibold mb-3">Liquidity Estimates</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Proposals calculate initial liquidity requirements based on trading
          activity.
        </p>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-4 mb-4">
          <div className="font-mono text-sm space-y-1">
            <div className="flex items-center gap-2">
              <Droplets className="h-3.5 w-3.5 text-primary" />
              <span>
                <span className="text-muted-foreground">
                  Minimum liquidity:{" "}
                </span>
                <span className="text-foreground">24h volume x 10%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-3.5 w-3.5 text-primary" />
              <span>
                <span className="text-muted-foreground">
                  Recommended liquidity:{" "}
                </span>
                <span className="text-foreground">24h volume x 30%</span>
              </span>
            </div>
          </div>
        </div>
        <h3 className="text-base font-semibold mb-3">
          Target Pool Allocation
        </h3>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.08]">
                <TableHead className="text-xs">Venue</TableHead>
                <TableHead className="text-xs">Pair</TableHead>
                <TableHead className="text-xs text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poolAllocations.map((p) => (
                <TableRow key={p.venue} className="border-white/[0.08]">
                  <TableCell className="text-sm font-medium">
                    {p.venue}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {p.pair}
                  </TableCell>
                  <TableCell className="text-sm text-right font-semibold">
                    {p.allocation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Risk Assessment */}
      <div>
        <h3 className="text-base font-semibold mb-3">Risk Assessment</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Each proposal evaluates 5 risk factors and assigns an overall risk
          level.
        </p>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-4">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.08]">
                <TableHead className="text-xs">Factor</TableHead>
                <TableHead className="text-xs">Severity</TableHead>
                <TableHead className="text-xs">Trigger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskFactors.map((r) => (
                <TableRow key={r.factor} className="border-white/[0.08]">
                  <TableCell className="text-sm font-medium">
                    {r.factor}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${r.severityColor} ${r.severityBg} border-0 text-xs`}
                    >
                      {r.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.trigger}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold">
              Overall Risk Level Calculation
            </span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="text-red-400 bg-red-500/10 border-0 text-[10px]"
              >
                High
              </Badge>
              <span>Any high-severity factor is present</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="text-yellow-400 bg-yellow-500/10 border-0 text-[10px]"
              >
                Medium
              </Badge>
              <span>Two or more medium-severity factors are present</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="text-emerald-400 bg-emerald-500/10 border-0 text-[10px]"
              >
                Low
              </Badge>
              <span>Default — no high factors, fewer than two medium factors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Actions */}
      <div>
        <h3 className="text-base font-semibold mb-3">Proposal Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proposalActions.map((a) => (
            <div
              key={a.label}
              className="flex items-start gap-3 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-3"
            >
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <a.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold">{a.label}</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {a.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DocsSection>
  );
}
