"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Demand Discovery",
  "/tokens": "Token Candidates",
  "/proposals": "Migration Proposals",
};

interface AppHeaderProps {
  lastUpdated?: string;
  dataSource?: "live" | "partial";
}

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export function AppHeader({ lastUpdated, dataSource }: AppHeaderProps) {
  const pathname = usePathname();

  const title =
    pageTitles[pathname] ??
    (pathname.startsWith("/tokens/") ? "Token Detail" : "Tideshift");

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border/50 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="text-sm font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        {lastUpdated && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="font-mono">{formatTimeAgo(lastUpdated)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Data last refreshed: {new Date(lastUpdated).toLocaleTimeString()}</p>
              {dataSource && <p className="text-xs text-muted-foreground">Source: {dataSource}</p>}
            </TooltipContent>
          </Tooltip>
        )}
        <Badge
          variant="outline"
          className="gap-1.5 border-emerald-500/30 text-emerald-400 font-mono text-[11px]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Solana Mainnet
        </Badge>
      </div>
    </header>
  );
}
