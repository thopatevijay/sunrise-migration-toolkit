"use client";

import {
  Rocket,
  BarChart3,
  Coins,
  Globe,
  Activity,
  FileText,
  Users,
  Target,
  Database,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TocItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const TOC_ITEMS: TocItem[] = [
  { id: "getting-started", label: "Getting Started", icon: Rocket },
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "token-detail", label: "Token Detail", icon: Coins },
  { id: "discovery", label: "Discovery", icon: Globe },
  { id: "migration-health", label: "Migration Health", icon: Activity },
  { id: "proposals", label: "Proposals", icon: FileText },
  { id: "onboarding", label: "Onboarding Flows", icon: Users },
  { id: "mds-methodology", label: "MDS Methodology", icon: Target },
  { id: "data-sources", label: "Data Sources", icon: Database },
  { id: "glossary", label: "Glossary", icon: BookOpen },
];

interface DocsSidebarProps {
  activeId: string;
  onItemClick?: () => void;
}

export function DocsSidebar({ activeId, onItemClick }: DocsSidebarProps) {
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
    onItemClick?.();
  };

  return (
    <nav className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
        On this page
      </p>
      {TOC_ITEMS.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? "bg-white/[0.06] text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
            }`}
          >
            <item.icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
