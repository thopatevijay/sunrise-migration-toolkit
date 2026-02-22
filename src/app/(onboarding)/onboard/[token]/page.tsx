"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  getOnboardingConfig,
  SUPPORTED_ONBOARDING_TOKENS,
} from "@/lib/config/onboarding";
import { OnboardingStepper } from "@/components/onboarding/onboarding-stepper";
import { SlideIn } from "@/components/shared/motion";
import { WelcomeStep } from "@/components/onboarding/steps/welcome-step";
import { WalletStep } from "@/components/onboarding/steps/wallet-step";
import { BridgeStep } from "@/components/onboarding/steps/bridge-step";
import { TradeStep } from "@/components/onboarding/steps/trade-step";
import { DeFiStep } from "@/components/onboarding/steps/defi-step";

export default function OnboardingPage({
  params,
}: {
  params: { token: string };
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const tokenSlug = params.token.toLowerCase();
  const config = getOnboardingConfig(tokenSlug);

  if (!SUPPORTED_ONBOARDING_TOKENS.includes(tokenSlug) || !config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-2">Token Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          Onboarding for <span className="font-mono">{params.token}</span> is
          not available yet. Check back after this token migrates to Solana via
          Sunrise.
        </p>
      </div>
    );
  }

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4));

  const steps = [
    <WelcomeStep key="welcome" config={config} onNext={goNext} />,
    <WalletStep key="wallet" config={config} onNext={goNext} />,
    <BridgeStep key="bridge" config={config} onNext={goNext} />,
    <TradeStep key="trade" config={config} onNext={goNext} />,
    <DeFiStep key="defi" config={config} />,
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <OnboardingStepper
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />
      <AnimatePresence mode="wait">
        <SlideIn key={currentStep}>{steps[currentStep]}</SlideIn>
      </AnimatePresence>
    </div>
  );
}
