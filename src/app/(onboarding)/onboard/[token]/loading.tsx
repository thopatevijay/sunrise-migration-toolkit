import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function OnboardingLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      {/* Stepper skeleton */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            {i < 4 && <Skeleton className="h-0.5 w-8" />}
          </div>
        ))}
      </div>
      {/* Step content skeleton */}
      <Card className="glass-card">
        <CardContent className="pt-8 pb-8 space-y-6 text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="space-y-3 pt-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
