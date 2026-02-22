"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { OnboardingConfig } from "@/lib/config/onboarding";

interface WalletStepProps {
  config: OnboardingConfig;
  onNext: () => void;
}

export function WalletStep({ config, onNext }: WalletStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Set Up Your Solana Wallet</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          You need a Solana wallet to hold {config.symbol} on Solana. Pick one
          below or skip if you already have one.
        </p>
      </div>

      <div className="space-y-3">
        {config.wallets.map((wallet) => (
          <Card key={wallet.name} className="glass-card hover:bg-white/[0.04] transition-colors">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="text-2xl">{wallet.icon}</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{wallet.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {wallet.description}
                </p>
              </div>
              <a
                href={wallet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="outline" size="sm" className="gap-1.5">
                  Install
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 pt-2">
        <Button
          size="lg"
          onClick={onNext}
          className={`bg-gradient-to-r ${config.colors.primary} text-white hover:opacity-90 px-8`}
        >
          I Have a Wallet
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <button
          onClick={onNext}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip — I already have a Solana wallet
        </button>
      </div>
    </div>
  );
}
