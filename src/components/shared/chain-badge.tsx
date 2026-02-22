import { CHAINS } from "@/lib/config/chains";
import type { ChainId } from "@/lib/config/tokens";
import { cn } from "@/lib/utils";

interface ChainBadgeProps {
  chainId: ChainId;
  size?: "sm" | "md";
}

export function ChainBadge({ chainId, size = "sm" }: ChainBadgeProps) {
  const chain = CHAINS[chainId];
  if (!chain) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      )}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: chain.color }}
      />
      <span className="text-muted-foreground">{chain.shortName}</span>
    </span>
  );
}
