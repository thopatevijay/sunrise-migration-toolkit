import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoveryLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <Skeleton className="h-[600px] rounded-xl" />
    </div>
  );
}
