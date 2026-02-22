import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Stats bar skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      {/* Chart skeleton */}
      <Skeleton className="h-80 rounded-xl" />
      {/* Table skeleton */}
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
