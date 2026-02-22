import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProposalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Migration Proposals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate data-backed proposals for Sunrise token migrations
          </p>
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state hint */}
      <Card className="glass-card border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <p className="text-muted-foreground text-sm">
            Visit a token&apos;s detail page and click &quot;Generate
            Proposal&quot; to create your first migration proposal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
