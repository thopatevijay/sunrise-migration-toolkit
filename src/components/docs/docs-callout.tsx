import type { ReactNode } from "react";
import { Info, Lightbulb, AlertTriangle } from "lucide-react";

const VARIANTS = {
  info: {
    icon: Info,
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
    iconColor: "text-purple-400",
  },
  tip: {
    icon: Lightbulb,
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
    iconColor: "text-yellow-400",
  },
} as const;

interface DocsCalloutProps {
  type: keyof typeof VARIANTS;
  title?: string;
  children: ReactNode;
}

export function DocsCallout({ type, title, children }: DocsCalloutProps) {
  const v = VARIANTS[type];
  const Icon = v.icon;

  return (
    <div className={`rounded-lg border ${v.border} ${v.bg} p-4`}>
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${v.iconColor}`} />
        <div className="text-sm">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
