"use client";

import { useCompletion } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { Loader2, RefreshCw, AlertCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DiscoveryToken } from "@/lib/types/discovery";

interface MigrationScoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: DiscoveryToken[];
}

export function MigrationScout({ open, onOpenChange, tokens }: MigrationScoutProps) {
  const { completion, isLoading, error, complete, setCompletion } =
    useCompletion({
      api: "/api/ai/scout",
      streamProtocol: "text",
    });

  const hasResult = completion.length > 0;

  const handleRun = () => {
    setCompletion("");
    const payload = tokens.slice(0, 15).map((t) => ({
      rank: t.rank,
      symbol: t.symbol,
      name: t.name,
      marketCap: t.marketCap,
      volume24h: t.volume24h,
      change7d: t.change7d,
      originChains: t.originChains,
      solanaStatus: t.solanaStatus,
    }));
    complete("", { body: { tokens: payload } });
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setCompletion("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl glass-card border-white/10 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            Migration Scout Agent
          </DialogTitle>
        </DialogHeader>

        {!hasResult && !isLoading && !error && (
          <div className="flex flex-col items-center gap-5 py-10">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
              <Bot className="h-8 w-8 text-purple-400" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Migration Scout</p>
              <p className="text-xs text-muted-foreground max-w-md">
                Analyzes the top migration candidates from the discovery table and recommends
                the best 5 with risk flags, surging demand signals, and a priority action.
              </p>
            </div>
            <Button
              onClick={handleRun}
              disabled={tokens.length === 0}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90"
            >
              <Bot className="h-4 w-4 mr-2" />
              Run Scout Analysis
            </Button>
          </div>
        )}

        {isLoading && !hasResult && (
          <div className="flex flex-col items-center gap-4 py-10">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">Generating migration brief...</p>
              <p className="text-xs text-muted-foreground">
                Analyzing {Math.min(tokens.length, 15)} candidates from the discovery table
              </p>
            </div>
          </div>
        )}

        {hasResult && (
          <div className="space-y-4">
            <div className="prose prose-invert prose-sm max-w-none [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_strong]:text-foreground [&_li]:text-muted-foreground [&_li]:mb-1">
              <ReactMarkdown>{completion}</ReactMarkdown>
              {isLoading && (
                <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-0.5 -mb-0.5" />
              )}
            </div>
            {!isLoading && (
              <div className="flex justify-end pt-2 border-t border-white/5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRun}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                  Re-run Analysis
                </Button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-8">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="text-sm text-red-400">Scout analysis failed</p>
            <p className="text-xs text-muted-foreground">
              Check that OPENAI_API_KEY is configured and try again.
            </p>
            <Button variant="outline" size="sm" onClick={handleRun}>
              <RefreshCw className="h-3 w-3 mr-1.5" />
              Retry
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
