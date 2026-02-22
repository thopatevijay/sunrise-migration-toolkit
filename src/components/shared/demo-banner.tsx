"use client";

import { useState } from "react";
import { X, Beaker, Radio } from "lucide-react";

interface DemoBannerProps {
  dataSource?: "live" | "mixed" | "demo";
}

export function DemoBanner({ dataSource = "demo" }: DemoBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Hide banner when live data is active or dismissed
  if (dataSource === "live" || dismissed) return null;

  const isDemo = dataSource === "demo";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div className="flex items-center gap-3 rounded-lg bg-purple-500/10 border border-purple-500/20 backdrop-blur-md px-4 py-2.5 text-sm shadow-lg">
        {isDemo ? (
          <Beaker className="h-4 w-4 text-purple-400 shrink-0" />
        ) : (
          <Radio className="h-4 w-4 text-yellow-400 shrink-0" />
        )}
        <p className="flex-1 text-xs text-purple-300">
          {isDemo
            ? "Demo mode — using realistic sample data. No API keys required."
            : "Mixed mode — some data from live APIs, some from demo fallback."}
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-purple-400 hover:text-purple-300 shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
