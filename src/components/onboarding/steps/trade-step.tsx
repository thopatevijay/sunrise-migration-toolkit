"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { OnboardingConfig } from "@/lib/config/onboarding";

interface TradeStepProps {
  config: OnboardingConfig;
  onNext: () => void;
}

export function TradeStep({ config, onNext }: TradeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Trade {config.symbol} on Solana
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {config.symbol} is available to trade across Solana&apos;s top DEXs
          and aggregators. Get the best price with one click.
        </p>
      </div>

      <div className="space-y-3">
        {config.tradingVenues.map((venue) => (
          <Card key={venue.name} className="glass-card hover:bg-white/[0.04] transition-colors">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{venue.name}</h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-white/10"
                  >
                    {venue.type === "aggregator" ? "Aggregator" : "DEX"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {venue.description}
                </p>
              </div>
              <a
                href={venue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="outline" size="sm" className="gap-1.5">
                  Swap
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-dashed">
        <CardContent className="py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Tip: Jupiter aggregates prices from 20+ Solana DEXs to give
            you the best swap rate automatically.
          </p>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          size="lg"
          onClick={onNext}
          className={`bg-gradient-to-r ${config.colors.primary} text-white hover:opacity-90 px-8`}
        >
          Continue to DeFi
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
