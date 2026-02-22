import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const SUPPORTED_TOKENS = ["hype", "mon"];

export default function OnboardingPage({
  params,
}: {
  params: { token: string };
}) {
  const tokenSlug = params.token.toLowerCase();

  if (!SUPPORTED_TOKENS.includes(tokenSlug)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-2">Token Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          Onboarding for <span className="font-mono">{params.token}</span> is
          not available yet. Check back after this token migrates to Solana via
          Sunrise.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            {i < 4 && <Skeleton className="h-0.5 w-8" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="glass-card">
        <CardContent className="pt-8 pb-8 space-y-6 text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
          <div className="space-y-3 pt-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <Skeleton className="h-11 w-48 mx-auto rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}
