"use client";

import { Activity } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import type { ProviderHealth, ProviderStatus } from "@/lib/data/providers/health";

function statusColor(status: ProviderStatus): string {
  switch (status) {
    case "healthy":
      return "bg-emerald-500";
    case "degraded":
      return "bg-yellow-500 animate-pulse";
    case "down":
      return "bg-red-500";
    default:
      return "bg-muted-foreground/40";
  }
}

function compositeStatus(providers: ProviderHealth[]): ProviderStatus {
  if (providers.every((p) => p.status === "unknown")) return "unknown";
  if (providers.some((p) => p.status === "down")) return "degraded";
  if (providers.every((p) => p.status === "healthy")) return "healthy";
  return "degraded";
}

function timeAgo(iso: string | null): string {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

interface ApiHealthBoardProps {
  providers: ProviderHealth[];
}

export function ApiHealthBoard({ providers }: ApiHealthBoardProps) {
  if (providers.length === 0) return null;

  const composite = compositeStatus(providers);

  return (
    <TooltipProvider delayDuration={200}>
      {/* Expanded sidebar */}
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>API Status</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="flex flex-col gap-1 px-2">
            {providers.map((p) => (
              <Tooltip key={p.name}>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between py-1 px-1 rounded text-xs hover:bg-sidebar-accent/50 cursor-default transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${statusColor(p.status)}`} />
                      <span className="text-muted-foreground">{p.displayName}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                      {timeAgo(p.lastSuccess)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[220px]">
                  <div className="text-xs space-y-1">
                    <p className="font-medium">{p.displayName}</p>
                    <p>Status: {p.status}</p>
                    {p.lastLatencyMs !== null && <p>Latency: {p.lastLatencyMs}ms</p>}
                    {p.consecutiveFailures > 0 && (
                      <p className="text-red-400">Failures: {p.consecutiveFailures}</p>
                    )}
                    {p.lastError && (
                      <p className="text-red-400 truncate">Error: {p.lastError}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Collapsed sidebar — single icon */}
      <div className="hidden group-data-[collapsible=icon]:flex justify-center py-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative cursor-default">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span
                className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${statusColor(composite)}`}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="text-xs space-y-1">
              <p className="font-medium">API Status</p>
              {providers.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${statusColor(p.status)}`} />
                  <span>{p.displayName}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
