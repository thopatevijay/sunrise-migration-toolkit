import { MDS_WEIGHTS } from "./weights";
import {
  normalizeBridgeOutflow,
  normalizeSearchIntent,
  normalizeSocialDemand,
  normalizeChainHealth,
  normalizeWalletOverlap,
} from "./normalizers";
import type { MigrationDemandScore, ScoreBreakdown, SignalScore, ScoreTrend } from "@/lib/types/scoring";
import type {
  TokenBridgeData,
  TokenSearchData,
  TokenSocialData,
  TokenMarketData,
  TokenWalletOverlap,
} from "@/lib/types/signals";

export interface SignalInputs {
  bridge: TokenBridgeData | null;
  search: TokenSearchData | null;
  social: TokenSocialData | null;
  market: TokenMarketData | null;
  wallet: TokenWalletOverlap | null;
}

function deriveTrend(value: number): ScoreTrend {
  if (value > 5) return "rising";
  if (value < -5) return "falling";
  return "stable";
}

function buildSignalScore(
  raw: number,
  normalized: number,
  weight: number,
  trendValue: number
): SignalScore {
  return {
    raw,
    normalized,
    weighted: Math.round(normalized * weight * 100) / 100,
    weight,
    trend: deriveTrend(trendValue),
  };
}

const EMPTY_SIGNAL: SignalScore = { raw: 0, normalized: 0, weighted: 0, weight: 0, trend: "stable" };

export function calculateMDS(
  tokenId: string,
  inputs: SignalInputs
): MigrationDemandScore {
  const { bridge, search, social, market, wallet } = inputs;

  // Count available signals and accumulate active weights
  let availableCount = 0;
  let activeWeightSum = 0;

  const bridgeNorm = bridge ? normalizeBridgeOutflow(bridge) : 0;
  const searchNorm = search ? normalizeSearchIntent(search) : 0;
  const socialNorm = social ? normalizeSocialDemand(social) : 0;
  const healthNorm = market ? normalizeChainHealth(market) : 0;
  const walletNorm = wallet ? normalizeWalletOverlap(wallet) : 0;

  if (bridge) { availableCount++; activeWeightSum += MDS_WEIGHTS.bridgeOutflow; }
  if (search) { availableCount++; activeWeightSum += MDS_WEIGHTS.searchIntent; }
  if (social) { availableCount++; activeWeightSum += MDS_WEIGHTS.socialDemand; }
  if (market) { availableCount++; activeWeightSum += MDS_WEIGHTS.chainHealth; }
  if (wallet) { availableCount++; activeWeightSum += MDS_WEIGHTS.walletOverlap; }

  // Scale factor: redistribute missing weights proportionally across available signals
  const scale = activeWeightSum > 0 ? 1 / activeWeightSum : 0;

  // Build breakdown
  const breakdown: ScoreBreakdown = {
    bridgeOutflow: bridge
      ? buildSignalScore(bridge.total7d, bridgeNorm, MDS_WEIGHTS.bridgeOutflow, bridge.trend)
      : EMPTY_SIGNAL,
    searchIntent: search
      ? buildSignalScore(search.avgDaily, searchNorm, MDS_WEIGHTS.searchIntent, search.trend)
      : EMPTY_SIGNAL,
    socialDemand: social
      ? buildSignalScore(social.communityScore, socialNorm, MDS_WEIGHTS.socialDemand, social.trend)
      : EMPTY_SIGNAL,
    chainHealth: market
      ? buildSignalScore(market.marketCap, healthNorm, MDS_WEIGHTS.chainHealth, market.change30d)
      : EMPTY_SIGNAL,
    walletOverlap: wallet
      ? buildSignalScore(wallet.overlapPercentage, walletNorm, MDS_WEIGHTS.walletOverlap, 0)
      : EMPTY_SIGNAL,
  };

  // Calculate weighted total — scale up so available signals fill 0-100 range
  const rawWeightedSum = Object.entries(breakdown).reduce((sum, [, signal]) => {
    return sum + signal.normalized * signal.weight;
  }, 0);
  const totalScore = Math.round(rawWeightedSum * scale);

  // Confidence: proportional to how many signals we have
  const confidence = Math.round((availableCount / 5) * 100) / 100;

  // Overall trend: weighted average of available signal trends
  let trendSum = 0;
  let trendWeight = 0;
  if (bridge) { trendSum += bridge.trend * 0.3; trendWeight += 0.3; }
  if (search) { trendSum += search.trend * 0.25; trendWeight += 0.25; }
  if (social) { trendSum += social.trend * 0.2; trendWeight += 0.2; }
  if (market) { trendSum += market.change30d * 0.15; trendWeight += 0.15; }
  const avgTrend = trendWeight > 0 ? trendSum / trendWeight * (0.3 + 0.25 + 0.2 + 0.15) : 0;

  return {
    tokenId,
    totalScore: Math.min(100, Math.max(0, totalScore)),
    confidence,
    trend: deriveTrend(avgTrend),
    breakdown,
    calculatedAt: new Date().toISOString(),
  };
}
