import Link from "next/link";
import { Waves } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <Waves className="h-12 w-12 text-primary/30 mb-6" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        This page doesn&apos;t exist yet. Maybe it hasn&apos;t migrated to
        Solana.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
