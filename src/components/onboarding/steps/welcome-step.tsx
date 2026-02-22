"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from "lucide-react";
import type { OnboardingConfig } from "@/lib/config/onboarding";

interface WelcomeStepProps {
  config: OnboardingConfig;
  onNext: () => void;
}

export function WelcomeStep({ config, onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-400"
        >
          Migrated via Sunrise on {config.migrationDate}
        </Badge>
        <h1 className="text-3xl font-bold">
          <span className={`bg-gradient-to-r ${config.colors.primary} bg-clip-text text-transparent`}>
            {config.symbol}
          </span>{" "}
          is now on Solana
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {config.name} has migrated to Solana via Sunrise NTT. Follow this
          guide to set up your wallet, bridge your tokens, and start earning
          yield — all in under 5 minutes.
        </p>
      </div>

      <Card className="glass-card">
        <CardContent className="pt-6 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Why Solana?
          </h3>
          <ul className="space-y-2.5">
            {config.whySolana.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <span className="text-emerald-400 mt-0.5">&#10003;</span>
                {reason}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="text-center space-y-3">
        <Button
          size="lg"
          onClick={onNext}
          className={`bg-gradient-to-r ${config.colors.primary} text-white hover:opacity-90 px-8`}
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground">
          From {config.originChainName} to Solana in 5 minutes
        </p>
      </div>
    </div>
  );
}
