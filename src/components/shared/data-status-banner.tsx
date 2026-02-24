"use client";

import { useState } from "react";
import { X, Radio } from "lucide-react";

interface DataStatusBannerProps {
  dataSource?: "live" | "partial";
}

export function DataStatusBanner({ dataSource = "partial" }: DataStatusBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Hide banner when all signals are live or dismissed
  if (dataSource === "live" || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div className="flex items-center gap-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md px-4 py-2.5 text-sm shadow-lg">
        <Radio className="h-4 w-4 text-yellow-400 shrink-0" />
        <p className="flex-1 text-xs text-yellow-300">
          Partial data — some API signals unavailable. Scores reflect available data only.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-400 hover:text-yellow-300 shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
