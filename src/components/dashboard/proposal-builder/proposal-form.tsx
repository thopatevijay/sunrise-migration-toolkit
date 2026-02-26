"use client";

import { useState, useMemo, useCallback } from "react";
import { useCompletion } from "@ai-sdk/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MdsBadge } from "@/components/shared/mds-badge";
import { ChainBadge } from "@/components/shared/chain-badge";
import { formatUSD, formatNumber } from "@/lib/utils";
import { saveProposal, type MigrationProposal } from "@/lib/types/proposals";
import {
  generateMigrationAnalysis,
  type MigrationAnalysis,
} from "@/lib/scoring/migration-analysis";
import {
  FileText,
  Copy,
  Check,
  Shield,
  Droplets,
  GitBranch,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  RefreshCw,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import type { TokenDetail } from "@/lib/data";
import ReactMarkdown from "react-markdown";
import type { Tone } from "@/lib/ai/prompts";

interface ProposalFormProps {
  token: TokenDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const severityColors = {
  low: "text-emerald-400 border-emerald-500/30",
  medium: "text-yellow-400 border-yellow-500/30",
  high: "text-red-400 border-red-500/30",
};

const severityIcons = {
  low: CheckCircle2,
  medium: Info,
  high: AlertTriangle,
};

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: "executive", label: "Executive", desc: "Board-ready, ROI-focused" },
  { value: "technical", label: "Technical", desc: "Bridge mechanics, pool math" },
  { value: "community", label: "Community", desc: "Holder-friendly, approachable" },
];

export function ProposalForm({ token, open, onOpenChange }: ProposalFormProps) {
  const [step, setStep] = useState<"analysis" | "ai-analysis" | "preview">("ai-analysis");
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<Tone>("executive");
  const [aiError, setAiError] = useState(false);
  const [savedFromAI, setSavedFromAI] = useState(false);

  const analysis = useMemo(() => generateMigrationAnalysis(token), [token]);

  const [summary, setSummary] = useState(
    `${token.symbol} has a Migration Demand Score of ${token.mds.totalScore}, indicating ${token.mds.totalScore >= 70 ? "strong" : token.mds.totalScore >= 50 ? "moderate" : "emerging"} demand from Solana users. Key signals include ${formatUSD(token.bridgeVolume7d)} in weekly bridge outflows and a ${token.walletOverlap.overlapPercentage}% wallet overlap with Solana.`
  );

  const {
    completion,
    complete,
    isLoading: aiLoading,
    setCompletion,
    stop,
    error: completionError,
  } = useCompletion({
    api: "/api/ai/proposal",
    streamProtocol: "text",
    body: { tokenId: token.id, tone },
    onError: () => setAiError(true),
  });

  const handleGenerateAI = useCallback(async () => {
    setAiError(false);
    setCompletion("");
    await complete(`Analyze ${token.symbol} for Solana migration`);
  }, [complete, setCompletion, token.symbol]);

  const handleToneChange = useCallback((newTone: Tone) => {
    setTone(newTone);
    // If already generated, re-generate with new tone
    if (completion) {
      setCompletion("");
      // Trigger re-generation after state update
      setTimeout(() => {
        complete(`Analyze ${token.symbol} for Solana migration`);
      }, 50);
    }
  }, [completion, complete, setCompletion, token.symbol]);

  const proposalText = useMemo(() => {
    if (step === "preview" && savedFromAI && completion) {
      return completion;
    }
    return buildProposalText(token, analysis, summary);
  }, [step, savedFromAI, completion, token, analysis, summary]);

  const handleGenerate = (fromAI: boolean) => {
    const proposal: MigrationProposal = {
      id: `${token.id}-${Date.now()}`,
      tokenId: token.id,
      tokenSymbol: token.symbol,
      tokenName: token.name,
      mdsScore: token.mds.totalScore,
      whyThisToken: fromAI && completion ? completion : summary,
      proposedStrategy: `${analysis.bridgeRecommendation.primary} — ${analysis.timeline}`,
      createdAt: new Date().toISOString(),
      marketCap: token.marketCap,
      bridgeVolume7d: token.bridgeVolume7d,
      communityScore: token.socialData.communityScore,
      walletOverlap: token.walletOverlap.overlapPercentage,
    };
    saveProposal(proposal);
    setSavedFromAI(fromAI);
    setStep("preview");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(proposalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setStep("ai-analysis");
      setCopied(false);
      setSavedFromAI(false);
      stop();
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl glass-card border-white/10 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            {step === "preview"
              ? "Proposal Preview"
              : step === "ai-analysis"
                ? "AI Migration Analysis"
                : "Classic Analysis"}
          </DialogTitle>
        </DialogHeader>

        {step === "ai-analysis" ? (
          <div className="space-y-4">
            {/* Token Summary */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03]">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                {token.symbol.slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{token.symbol}</span>
                  <ChainBadge chainId={token.originChain} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">{token.name}</p>
              </div>
              <MdsBadge score={token.mds.totalScore} size="md" />
            </div>

            {/* Tone Selector */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Analysis tone</p>
              <div className="flex gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => handleToneChange(t.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all border ${
                      tone === t.value
                        ? "bg-primary/15 border-primary/40 text-foreground font-medium"
                        : "bg-white/[0.03] border-white/10 text-muted-foreground hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="block font-medium">{t.label}</span>
                    <span className="block text-[10px] mt-0.5 opacity-70">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Output Area */}
            {!completion && !aiLoading && !aiError && (
              <div className="flex flex-col items-center gap-4 py-8 px-4 rounded-lg bg-white/[0.02] border border-white/5">
                <Sparkles className="h-8 w-8 text-primary/60" />
                <div className="text-center">
                  <p className="text-sm font-medium mb-1">Generate AI Analysis</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    GPT-4o-mini will analyze {token.symbol}&apos;s migration potential using
                    all 5 MDS signals, market data, and bridge activity.
                  </p>
                </div>
                <Button
                  onClick={handleGenerateAI}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Analysis
                </Button>
              </div>
            )}

            {aiLoading && !completion && (
              <div className="flex flex-col items-center gap-3 py-8 rounded-lg bg-white/[0.02] border border-white/5">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Analyzing {token.symbol}...</p>
              </div>
            )}

            {(completion || (aiLoading && completion)) && (
              <div className="relative">
                <div className="rounded-lg bg-black/30 border border-white/5 p-4 max-h-80 overflow-y-auto">
                  <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-2 [&_h2:first-child]:mt-0 [&_p]:text-muted-foreground [&_p]:mb-2 [&_strong]:text-foreground [&_ul]:text-muted-foreground [&_li]:mb-1">
                    <ReactMarkdown>{completion}</ReactMarkdown>
                    {aiLoading && (
                      <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                </div>
                {!aiLoading && completion && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateAI}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className="h-3 w-3 mr-1.5" />
                      Regenerate
                    </Button>
                    <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground">
                      {tone} tone
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {(aiError || completionError) && !aiLoading && (
              <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-4 text-center">
                <p className="text-sm text-red-400 mb-2">AI analysis unavailable</p>
                <p className="text-xs text-muted-foreground mb-3">
                  {completionError?.message || "OpenAI API key may be missing or rate-limited."}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setAiError(false); setStep("analysis"); }}
                  className="text-xs"
                >
                  Switch to Classic Analysis
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("analysis")}
                className="text-xs text-muted-foreground"
              >
                Switch to Classic
              </Button>
              <div className="flex-1" />
              <Button
                onClick={() => handleGenerate(true)}
                disabled={!completion || aiLoading}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90"
              >
                Save Proposal
              </Button>
            </div>
          </div>
        ) : step === "analysis" ? (
          <div className="space-y-5">
            {/* Back to AI */}
            <button
              onClick={() => setStep("ai-analysis")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to AI Analysis
            </button>

            {/* Token Summary */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03]">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                {token.symbol.slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{token.symbol}</span>
                  <ChainBadge chainId={token.originChain} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">{token.name}</p>
              </div>
              <MdsBadge score={token.mds.totalScore} size="md" />
            </div>

            {/* Bridge Recommendation */}
            <AnalysisSection
              icon={GitBranch}
              title="Bridge Framework"
              color="text-purple-400"
            >
              <p className="text-sm font-medium mb-1">
                {analysis.bridgeRecommendation.primary}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {analysis.bridgeRecommendation.reasoning}
              </p>
              {analysis.bridgeRecommendation.alternatives.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Alternatives</p>
                  {analysis.bridgeRecommendation.alternatives.map((alt) => (
                    <div key={alt.framework} className="text-xs p-2 rounded bg-white/[0.02]">
                      <span className="font-medium">{alt.framework}</span>
                      <span className="text-muted-foreground"> — {alt.pros}</span>
                    </div>
                  ))}
                </div>
              )}
            </AnalysisSection>

            {/* Liquidity Estimate */}
            <AnalysisSection
              icon={Droplets}
              title="Liquidity Requirements"
              color="text-cyan-400"
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 rounded bg-white/[0.02]">
                  <p className="text-[10px] text-muted-foreground">Minimum</p>
                  <p className="text-sm font-mono font-bold">
                    {formatUSD(analysis.liquidityEstimate.minimum)}
                  </p>
                </div>
                <div className="p-2 rounded bg-white/[0.02]">
                  <p className="text-[10px] text-muted-foreground">Recommended</p>
                  <p className="text-sm font-mono font-bold">
                    {formatUSD(analysis.liquidityEstimate.recommended)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {analysis.liquidityEstimate.pools.map((pool) => (
                  <div key={pool.venue} className="flex items-center justify-between text-xs">
                    <span>
                      {pool.venue} — <span className="text-muted-foreground">{pool.pair}</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] border-white/10">
                      {pool.allocation}
                    </Badge>
                  </div>
                ))}
              </div>
            </AnalysisSection>

            {/* Risk Assessment */}
            <AnalysisSection
              icon={Shield}
              title={`Risk Assessment — ${analysis.riskAssessment.level.toUpperCase()}`}
              color={
                analysis.riskAssessment.level === "low"
                  ? "text-emerald-400"
                  : analysis.riskAssessment.level === "medium"
                    ? "text-yellow-400"
                    : "text-red-400"
              }
            >
              <div className="space-y-2">
                {analysis.riskAssessment.factors.map((factor) => {
                  const Icon = severityIcons[factor.severity];
                  return (
                    <div
                      key={factor.name}
                      className="flex items-start gap-2 text-xs p-2 rounded bg-white/[0.02]"
                    >
                      <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${severityColors[factor.severity].split(" ")[0]}`} />
                      <div>
                        <span className="font-medium">{factor.name}</span>
                        <p className="text-muted-foreground mt-0.5">{factor.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnalysisSection>

            {/* Competitive Landscape */}
            <AnalysisSection
              icon={Target}
              title="Competitive Landscape"
              color="text-orange-400"
            >
              <p className="text-xs text-muted-foreground mb-2">
                Similar tokens on Solana: {analysis.competitiveLandscape.similarOnSolana.join(", ")}
              </p>
              <p className="text-xs">{analysis.competitiveLandscape.marketGap}</p>
            </AnalysisSection>

            {/* Timeline */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03]">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">
                <span className="font-medium">Est. Timeline:</span>{" "}
                <span className="text-muted-foreground">{analysis.timeline}</span>
              </span>
            </div>

            {/* Executive Summary */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Executive Summary (editable)
              </label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="bg-white/5 border-white/10 text-sm"
              />
            </div>

            <Button
              onClick={() => handleGenerate(false)}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90"
            >
              Generate Proposal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
              Saved to proposals
            </Badge>

            {savedFromAI && completion ? (
              <div className="p-4 rounded-lg bg-black/30 max-h-96 overflow-y-auto">
                <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-2 [&_h2:first-child]:mt-0 [&_p]:text-muted-foreground [&_p]:mb-2 [&_strong]:text-foreground [&_ul]:text-muted-foreground [&_li]:mb-1">
                  <ReactMarkdown>{proposalText}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <pre className="p-4 rounded-lg bg-black/30 text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto text-muted-foreground leading-relaxed">
                {proposalText}
              </pre>
            )}

            <div className="flex gap-2">
              <Button onClick={handleCopy} variant="outline" className="flex-1">
                {copied ? (
                  <Check className="h-4 w-4 mr-2 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90"
              >
                <a
                  href="https://sunrisedefi.com/apply"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Submit to Sunrise
                </a>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// --- Sub-components ---

function AnalysisSection({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
      <div className={`flex items-center gap-2 text-xs font-medium mb-2 ${color}`}>
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      {children}
    </div>
  );
}

// --- Text builder ---

function buildProposalText(
  token: TokenDetail,
  analysis: MigrationAnalysis,
  summary: string
): string {
  return `
MIGRATION PROPOSAL: ${token.symbol} (${token.name})
${"=".repeat(50)}

Migration Demand Score: ${token.mds.totalScore}/100 (${token.mds.trend})
Origin Chain: ${token.originChain}
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
${"-".repeat(30)}
${summary}

MARKET DATA
${"-".repeat(30)}
Market Cap:      ${formatUSD(token.marketCap)}
24h Volume:      ${formatUSD(token.volume24h)}
TVL:             ${formatUSD(token.tvl)}
Holders:         ${formatNumber(token.holders)}
7d Change:       ${token.change7d > 0 ? "+" : ""}${token.change7d.toFixed(1)}%

DEMAND EVIDENCE
${"-".repeat(30)}
Bridge Outflow (7d):    ${formatUSD(token.bridgeVolume7d)}
Search Intent Score:    ${token.mds.breakdown.searchIntent.normalized}/100
Community Score:         ${token.socialData.communityScore}/100
Wallet Overlap:         ${token.walletOverlap.overlapPercentage}% (${formatNumber(token.walletOverlap.solanaWallets)} wallets)
Sentiment:              ${token.socialData.sentimentUpPct.toFixed(0)}% positive

BRIDGE RECOMMENDATION
${"-".repeat(30)}
Primary: ${analysis.bridgeRecommendation.primary}
Rationale: ${analysis.bridgeRecommendation.reasoning}
${analysis.bridgeRecommendation.alternatives.map((a) => `  Alternative: ${a.framework} — ${a.pros}`).join("\n")}

LIQUIDITY REQUIREMENTS
${"-".repeat(30)}
Minimum:     ${formatUSD(analysis.liquidityEstimate.minimum)}
Recommended: ${formatUSD(analysis.liquidityEstimate.recommended)}
${analysis.liquidityEstimate.pools.map((p) => `  ${p.venue} (${p.pair}): ${p.allocation}`).join("\n")}

RISK ASSESSMENT: ${analysis.riskAssessment.level.toUpperCase()}
${"-".repeat(30)}
${analysis.riskAssessment.factors.map((f) => `  [${f.severity.toUpperCase()}] ${f.name}: ${f.detail}`).join("\n")}

COMPETITIVE LANDSCAPE
${"-".repeat(30)}
Similar on Solana: ${analysis.competitiveLandscape.similarOnSolana.join(", ")}
Market Gap: ${analysis.competitiveLandscape.marketGap}

TIMELINE
${"-".repeat(30)}
${analysis.timeline}

---
Generated by Tideshift — tideshift.app
Powered by Sunrise
`.trim();
}
