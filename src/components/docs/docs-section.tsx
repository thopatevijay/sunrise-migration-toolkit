import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

interface DocsSectionProps {
  id: string;
  title: string;
  icon: LucideIcon;
  description?: string;
  children: ReactNode;
}

export function DocsSection({
  id,
  title,
  icon: Icon,
  description,
  children,
}: DocsSectionProps) {
  return (
    <section id={id} data-section={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <Separator className="mb-6" />
      <div className="space-y-6">{children}</div>
    </section>
  );
}
