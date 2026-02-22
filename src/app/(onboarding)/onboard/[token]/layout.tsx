import { Waves } from "lucide-react";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-purple-950/20">
      <header className="flex h-14 items-center justify-between border-b border-border/50 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
            <Waves className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold gradient-text">Tideshift</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-xs text-muted-foreground">
            Powered by Sunrise
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
        <p>
          Powered by{" "}
          <a
            href="https://sunrisedefi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Sunrise
          </a>{" "}
          &mdash; bringing tokens to Solana with day-one liquidity
        </p>
      </footer>
    </div>
  );
}
