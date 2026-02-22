"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Welcome", icon: "👋" },
  { label: "Wallet", icon: "💳" },
  { label: "Bridge", icon: "🌉" },
  { label: "Trade", icon: "📈" },
  { label: "DeFi", icon: "🏦" },
];

interface OnboardingStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function OnboardingStepper({
  currentStep,
  onStepClick,
}: OnboardingStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div key={step.label} className="flex items-center">
            <button
              onClick={() => isCompleted && onStepClick?.(i)}
              disabled={!isCompleted}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 transition-all",
                isCompleted && "cursor-pointer",
                !isCompleted && !isActive && "opacity-40"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all",
                  isCompleted &&
                    "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30",
                  isActive &&
                    "bg-primary/20 text-primary ring-2 ring-primary/50 scale-110",
                  !isCompleted &&
                    !isActive &&
                    "bg-white/5 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive && "text-primary",
                  isCompleted && "text-emerald-400",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 rounded-full transition-all",
                  i < currentStep ? "bg-emerald-500/50" : "bg-white/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
