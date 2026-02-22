import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  value: number;
  showValue?: boolean;
  size?: "sm" | "md";
}

export function TrendIndicator({
  value,
  showValue = true,
  size = "sm",
}: TrendIndicatorProps) {
  const isUp = value > 0;
  const isDown = value < 0;
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-mono",
        textSize,
        isUp && "text-emerald-400",
        isDown && "text-red-400",
        !isUp && !isDown && "text-muted-foreground"
      )}
    >
      {isUp && <TrendingUp className={iconSize} />}
      {isDown && <TrendingDown className={iconSize} />}
      {!isUp && !isDown && <Minus className={iconSize} />}
      {showValue && (
        <span>
          {isUp ? "+" : ""}
          {value.toFixed(1)}%
        </span>
      )}
    </span>
  );
}
