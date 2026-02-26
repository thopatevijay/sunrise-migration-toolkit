import {
  Rocket,
  BarChart3,
  Coins,
  Globe,
  Activity,
  FileText,
  Users,
  ArrowRight,
  Briefcase,
  HeartHandshake,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import { DocsSection } from "@/components/docs/docs-section";
import { DocsCallout } from "@/components/docs/docs-callout";
import { Card, CardContent } from "@/components/ui/card";

const audiences = [
  {
    icon: Briefcase,
    title: "Sunrise BD Team",
    description:
      "Identify the strongest migration candidates using data-driven scoring. Prioritize outreach with ranked demand signals instead of gut feeling.",
  },
  {
    icon: HeartHandshake,
    title: "Token Communities",
    description:
      "Understand your token's migration readiness at a glance. Use guided onboarding flows to bring your community onto Solana smoothly.",
  },
  {
    icon: LineChart,
    title: "Ecosystem Analysts",
    description:
      "Track post-migration health metrics, explore the competitive landscape, and surface emerging demand before it becomes obvious.",
  },
];

const features = [
  {
    icon: BarChart3,
    title: "Dashboard",
    description: "Rankings, demand charts, and migration stats at a glance.",
    link: "/",
    linkText: "Open Dashboard",
  },
  {
    icon: Coins,
    title: "Token Detail",
    description: "Deep signal analysis, radar charts, AI proposals, and Ask Tideshift chat.",
    link: "/tokens",
    linkText: "Explore Tokens",
  },
  {
    icon: Globe,
    title: "Discovery",
    description:
      "Scan 500+ tokens without a Solana presence and vote for demand.",
    link: "/discovery",
    linkText: "Discover Tokens",
  },
  {
    icon: Activity,
    title: "Migration Health",
    description: "Track post-migration token health and adoption metrics.",
    link: "/migrations",
    linkText: "View Migrations",
  },
  {
    icon: FileText,
    title: "Proposals",
    description: "AI-powered proposals in 3 tones with risk assessments.",
    link: "/proposals",
    linkText: "Browse Proposals",
  },
  {
    icon: Users,
    title: "Onboarding",
    description: "Guided community migration flows from wallet to DeFi.",
    link: "/onboard/render",
    linkText: "Start Onboarding",
  },
];

export function GettingStarted() {
  return (
    <DocsSection
      id="getting-started"
      title="Getting Started"
      icon={Rocket}
      description="What is Tideshift and how to navigate the platform"
    >
      {/* What is Tideshift */}
      <div>
        <h3 className="text-base font-semibold mb-3">What is Tideshift</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tideshift is full-lifecycle token migration infrastructure for Solana.
          It scores 50+ tokens by real migration demand — measuring bridge
          outflows, search intent, social signals, and wallet overlap — to
          produce a single Migration Demand Score (MDS) from 0 to 100. Built for
          the{" "}
          <span className="gradient-text font-medium">
            Sunrise Migrations track
          </span>{" "}
          at the Solana Graveyard Hackathon.
        </p>
      </div>

      {/* Who is it for */}
      <div>
        <h3 className="text-base font-semibold mb-3">Who is it for</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audiences.map((a) => (
            <Card key={a.title} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <a.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{a.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {a.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Tour */}
      <div>
        <h3 className="text-base font-semibold mb-3">Quick Tour</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card key={f.title} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <f.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{f.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {f.description}
                </p>
                <Link
                  href={f.link}
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                >
                  {f.linkText}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <DocsCallout type="info" title="Navigation">
        Use the sidebar to navigate between pages. The{" "}
        <span className="font-medium text-foreground">API Health Board</span> at
        the bottom of the sidebar shows real-time status of all data providers
        (CoinGecko, DexScreener, WormholeScan, DefiLlama, Jupiter).
      </DocsCallout>
    </DocsSection>
  );
}
