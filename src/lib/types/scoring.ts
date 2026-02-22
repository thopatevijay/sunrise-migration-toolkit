export interface MigrationDemandScore {
  tokenId: string;
  totalScore: number;
  confidence: number;
  trend: ScoreTrend;
  breakdown: ScoreBreakdown;
  calculatedAt: string;
}

export interface ScoreBreakdown {
  bridgeOutflow: SignalScore;
  searchIntent: SignalScore;
  socialDemand: SignalScore;
  chainHealth: SignalScore;
  walletOverlap: SignalScore;
}

export interface SignalScore {
  raw: number;
  normalized: number;
  weighted: number;
  weight: number;
  trend: ScoreTrend;
}

export type ScoreTrend = "rising" | "stable" | "falling";

export type ScoreRange = "extreme" | "strong" | "moderate" | "emerging" | "low";

export function getScoreRange(score: number): ScoreRange {
  if (score >= 90) return "extreme";
  if (score >= 70) return "strong";
  if (score >= 50) return "moderate";
  if (score >= 30) return "emerging";
  return "low";
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-purple-400";
  if (score >= 50) return "text-cyan-400";
  if (score >= 30) return "text-yellow-400";
  return "text-zinc-400";
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 70) return "bg-purple-500/20 border-purple-500/30";
  if (score >= 50) return "bg-cyan-500/20 border-cyan-500/30";
  if (score >= 30) return "bg-yellow-500/20 border-yellow-500/30";
  return "bg-zinc-500/20 border-zinc-500/30";
}
