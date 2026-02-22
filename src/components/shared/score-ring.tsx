"use client";

import { cn } from "@/lib/utils";
import { getScoreColor } from "@/lib/types/scoring";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreRing({
  score,
  size = 56,
  strokeWidth = 4,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    score >= 90
      ? "#34d399"
      : score >= 70
        ? "#a78bfa"
        : score >= 50
          ? "#22d3ee"
          : score >= 30
            ? "#facc15"
            : "#71717a";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span
        className={cn(
          "absolute font-mono font-bold",
          getScoreColor(score),
          size >= 56 ? "text-base" : "text-xs"
        )}
      >
        {score}
      </span>
    </div>
  );
}
