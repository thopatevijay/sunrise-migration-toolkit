import { MDS_WEIGHTS, type SignalKey } from "./weights";
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
} from "@/lib/data/demo";

interface SignalInputs {
  bridge: TokenBridgeData;
  search: TokenSearchData;
  social: TokenSocialData;
  market: TokenMarketData;
  wallet: TokenWalletOverlap;
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

export function calculateMDS(
  tokenId: string,
  inputs: SignalInputs
): MigrationDemandScore {
  const { bridge, search, social, market, wallet } = inputs;

  // Normalize each signal to 0-100
  const bridgeNorm = normalizeBridgeOutflow(bridge);
  const searchNorm = normalizeSearchIntent(search);
  const socialNorm = normalizeSocialDemand(social);
  const healthNorm = normalizeChainHealth(market);
  const walletNorm = normalizeWalletOverlap(wallet);

  // Build breakdown
  const breakdown: ScoreBreakdown = {
    bridgeOutflow: buildSignalScore(
      bridge.total7d, bridgeNorm, MDS_WEIGHTS.bridgeOutflow, bridge.trend
    ),
    searchIntent: buildSignalScore(
      search.avgDaily, searchNorm, MDS_WEIGHTS.searchIntent, search.trend
    ),
    socialDemand: buildSignalScore(
      social.demandMentions, socialNorm, MDS_WEIGHTS.socialDemand, social.trend
    ),
    chainHealth: buildSignalScore(
      market.marketCap, healthNorm, MDS_WEIGHTS.chainHealth, market.change30d
    ),
    walletOverlap: buildSignalScore(
      wallet.overlapPercentage, walletNorm, MDS_WEIGHTS.walletOverlap, 0
    ),
  };

  // Calculate weighted total
  const totalScore = Math.round(
    Object.entries(breakdown).reduce((sum, [key, signal]) => {
      return sum + signal.normalized * MDS_WEIGHTS[key as SignalKey];
    }, 0)
  );

  // Confidence: based on data availability (all demo = 0.85 base)
  const signalCount = 5;
  const confidence = Math.round((0.7 + (signalCount / 5) * 0.3) * 100) / 100;

  // Overall trend: weighted average of signal trends
  const avgTrend =
    bridge.trend * 0.3 +
    search.trend * 0.25 +
    social.trend * 0.2 +
    market.change30d * 0.15;

  return {
    tokenId,
    totalScore: Math.min(100, Math.max(0, totalScore)),
    confidence,
    trend: deriveTrend(avgTrend),
    breakdown,
    calculatedAt: new Date().toISOString(),
  };
}
