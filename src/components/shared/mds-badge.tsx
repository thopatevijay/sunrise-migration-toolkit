import { cn } from "@/lib/utils";
import { getScoreBgColor, getScoreColor } from "@/lib/types/scoring";

interface MdsBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function MdsBadge({ score, size = "md" }: MdsBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-mono font-bold",
        getScoreBgColor(score),
        getScoreColor(score),
        sizeClasses[size]
      )}
    >
      {score}
    </span>
  );
}
