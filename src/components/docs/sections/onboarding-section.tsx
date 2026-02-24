import {
  Users,
  Wallet,
  ArrowRightLeft,
  Repeat,
  Landmark,
  PartyPopper,
  BarChart3,
  Fingerprint,
  TrendingUp,
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

const stepperSteps = [
  {
    step: 1,
    icon: PartyPopper,
    title: "Welcome",
    description:
      "Token introduction and overview of why migrating to Solana unlocks better speed, lower fees, and deeper DeFi opportunities.",
  },
  {
    step: 2,
    icon: Wallet,
    title: "Wallet",
    description:
      "Guided setup for Phantom, Backpack, or Solflare wallet. Includes links to download, install, and configure each option.",
  },
  {
    step: 3,
    icon: ArrowRightLeft,
    title: "Bridge",
    description:
      "Transfer tokens from the origin chain to Solana via Wormhole Portal or deBridge. Step-by-step bridging instructions with fee estimates.",
  },
  {
    step: 4,
    icon: Repeat,
    title: "Trade",
    description:
      "Swap tokens on Jupiter, Raydium, or Orca. Shows available trading pairs, liquidity depth, and current prices.",
  },
  {
    step: 5,
    icon: Landmark,
    title: "DeFi",
    description:
      "Explore lending, LP positions, and staking opportunities with live APYs pulled from DefiLlama Yields API.",
  },
];

const supportedTokens = [
  {
    token: "RENDER",
    chain: "Ethereum",
    date: "Oct 2023",
    bridges: "Wormhole Portal",
  },
  {
    token: "HNT",
    chain: "Helium",
    date: "Apr 2023",
    bridges: "NTT, deBridge",
  },
  {
    token: "POWR",
    chain: "Ethereum",
    date: "Feb 2024",
    bridges: "Wormhole Portal, deBridge",
  },
  {
    token: "GEOD",
    chain: "Ethereum",
    date: "Mar 2024",
    bridges: "Wormhole Portal",
  },
];

const defiProtocols = [
  "Kamino",
  "MarginFi",
  "Raydium",
  "Orca",
  "Drift",
  "Sanctum",
  "Jupiter",
];

export function OnboardingSection() {
  return (
    <DocsSection
      id="onboarding"
      title="Onboarding Flows"
      icon={Users}
      description="Guided community migration for token holders"
    >
      {/* 5-Step Stepper */}
      <div>
        <h3 className="text-base font-semibold mb-3">5-Step Stepper</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Each onboarding flow walks token holders through the full migration
          journey in five guided steps.
        </p>
        <div className="space-y-3">
          {stepperSteps.map((s) => (
            <Card key={s.step} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">
                        Step {s.step}
                      </Badge>
                      <span className="text-sm font-semibold">{s.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Supported Tokens */}
      <div>
        <h3 className="text-base font-semibold mb-3">Supported Tokens</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Onboarding flows are pre-configured for the following migrated tokens.
        </p>
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.08]">
                <TableHead className="text-xs">Token</TableHead>
                <TableHead className="text-xs">Origin Chain</TableHead>
                <TableHead className="text-xs">Migration Date</TableHead>
                <TableHead className="text-xs">Bridge Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supportedTokens.map((t) => (
                <TableRow key={t.token} className="border-white/[0.08]">
                  <TableCell className="text-sm font-semibold">
                    {t.token}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.chain}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.date}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.bridges.split(", ").map((b) => (
                        <Badge
                          key={b}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Live DeFi APYs */}
      <div>
        <h3 className="text-base font-semibold mb-3">Live DeFi APYs</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          The DeFi step (Step 5) shows real-time yield data pulled from the
          DefiLlama Yields API. APYs update in real time and include risk level
          indicators.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {defiProtocols.map((protocol) => (
            <div
              key={protocol}
              className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2"
            >
              <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground">{protocol}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="text-emerald-400 bg-emerald-500/10 border-0 text-[10px]"
          >
            Low Risk
          </Badge>
          <Badge
            variant="outline"
            className="text-yellow-400 bg-yellow-500/10 border-0 text-[10px]"
          >
            Medium Risk
          </Badge>
          <Badge
            variant="outline"
            className="text-red-400 bg-red-500/10 border-0 text-[10px]"
          >
            High Risk
          </Badge>
          <span className="text-xs text-muted-foreground self-center">
            — shown per opportunity in the DeFi step
          </span>
        </div>
      </div>

      {/* Analytics Tracking */}
      <div>
        <h3 className="text-base font-semibold mb-3">Analytics Tracking</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Every step completion is tracked to measure conversion and identify
          drop-off points in the migration funnel.
        </p>
        <div className="space-y-2">
          {[
            {
              icon: Fingerprint,
              text: "Step completion tracked via Upstash Redis using anonymous session IDs",
            },
            {
              icon: BarChart3,
              text: "Conversion funnel visible on the main dashboard",
            },
            {
              icon: Users,
              text: "Each step uses Redis SETs for automatic deduplication — no double-counting",
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

      <DocsCallout type="tip">
        Each onboarding flow is white-label ready — branded with the
        token&apos;s colors and configured with chain-specific bridge routes,
        trading venues, and DeFi opportunities.
      </DocsCallout>
    </DocsSection>
  );
}
