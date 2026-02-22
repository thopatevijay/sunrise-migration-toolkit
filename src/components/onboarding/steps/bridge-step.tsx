"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, Clock, Percent } from "lucide-react";
import type { OnboardingConfig } from "@/lib/config/onboarding";

interface BridgeStepProps {
  config: OnboardingConfig;
  onNext: () => void;
}

export function BridgeStep({ config, onNext }: BridgeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Bridge {config.symbol} to Solana
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Move your {config.symbol} from {config.originChainName} to Solana.
          We recommend Sunrise NTT for the fastest, most secure bridge.
        </p>
      </div>

      <div className="space-y-3">
        {config.bridges.map((bridge) => (
          <Card
            key={bridge.name}
            className={`glass-card transition-colors ${
              bridge.recommended
                ? "ring-1 ring-primary/30 bg-primary/[0.03]"
                : "hover:bg-white/[0.04]"
            }`}
          >
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{bridge.name}</h3>
                  {bridge.recommended && (
                    <Badge className="bg-primary/20 text-primary text-[10px] px-1.5 py-0">
                      Recommended
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {bridge.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    Fee: {bridge.fee}
                  </span>
                </div>
              </div>
              <a
                href={bridge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button
                  variant={bridge.recommended ? "default" : "outline"}
                  size="sm"
                  className={
                    bridge.recommended
                      ? `bg-gradient-to-r ${config.colors.primary} text-white hover:opacity-90`
                      : ""
                  }
                >
                  Bridge
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-lg bg-white/[0.03] p-4 text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          After bridging, your {config.symbol} tokens will appear in your Solana
          wallet within a few minutes.
        </p>
      </div>

      <div className="text-center">
        <Button
          size="lg"
          onClick={onNext}
          className={`bg-gradient-to-r ${config.colors.primary} text-white hover:opacity-90 px-8`}
        >
          I&apos;ve Bridged My Tokens
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
