"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const pageTitles: Record<string, string> = {
  "/": "Demand Discovery",
  "/tokens": "Token Candidates",
  "/proposals": "Migration Proposals",
};

export function AppHeader() {
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
