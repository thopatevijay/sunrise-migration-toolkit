"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const LOADING_MESSAGES = [
  { text: "Connecting to CoinGecko...", duration: 3000 },
  { text: "Fetching market data for 50 tokens...", duration: 5000 },
  { text: "Querying WormholeScan bridge volumes...", duration: 5000 },
  { text: "Analyzing search intent via Jupiter...", duration: 4000 },
  { text: "Computing Migration Demand Scores...", duration: 5000 },
  { text: "Scoring batch 1 of 10...", duration: 4000 },
  { text: "Scoring batch 3 of 10...", duration: 4000 },
  { text: "Scoring batch 5 of 10...", duration: 4000 },
  { text: "Scoring batch 7 of 10...", duration: 4000 },
  { text: "Scoring batch 9 of 10...", duration: 4000 },
  { text: "Finalizing rankings...", duration: 3000 },
  { text: "Almost there...", duration: 10000 },
];

interface LoadingOverlayProps {
  isLoading: boolean;
  variant?: "dashboard" | "detail" | "migrations";
}

const VARIANT_MESSAGES: Record<string, { text: string; duration: number }[]> = {
  detail: [
    { text: "Fetching token data...", duration: 2000 },
    { text: "Loading price history...", duration: 1500 },
    { text: "Analyzing migration signals...", duration: 2000 },
    { text: "Almost there...", duration: 5000 },
  ],
  migrations: [
    { text: "Checking migration health...", duration: 2000 },
    { text: "Fetching bridge activity from WormholeScan...", duration: 2000 },
    { text: "Computing health scores...", duration: 2000 },
    { text: "Almost there...", duration: 5000 },
  ],
};

export function LoadingOverlay({ isLoading, variant = "dashboard" }: LoadingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const messages = variant === "dashboard" ? LOADING_MESSAGES : VARIANT_MESSAGES[variant] ?? VARIANT_MESSAGES.detail;

  useEffect(() => {
    if (!isLoading) {
      setMessageIndex(0);
      setProgress(0);
      return;
    }

    let elapsed = 0;
    const totalDuration = messages.reduce((sum, m) => sum + m.duration, 0);

    const interval = setInterval(() => {
      elapsed += 200;
      // Progress caps at 95% until data arrives
      const raw = (elapsed / totalDuration) * 100;
      setProgress(Math.min(95, raw));

      // Advance message based on cumulative duration
      let cumulative = 0;
      for (let i = 0; i < messages.length; i++) {
        cumulative += messages[i].duration;
        if (elapsed < cumulative) {
          setMessageIndex(i);
          break;
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading, messages]);

  if (!isLoading) return null;

  const currentMessage = messages[Math.min(messageIndex, messages.length - 1)];

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-2 max-w-md">
        <p className="text-sm font-medium text-foreground">
          {currentMessage.text}
        </p>
        <p className="text-xs text-muted-foreground">
          Scoring tokens from 5 live API providers
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[10px] text-muted-foreground/60">
        First load takes ~30s while scoring 50 tokens across 10 batches
      </p>
    </div>
  );
}
