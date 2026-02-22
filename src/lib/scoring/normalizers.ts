import type { TokenBridgeData, TokenSearchData, TokenSocialData, TokenMarketData, TokenWalletOverlap } from "@/lib/data/demo";

/**
 * Normalize a value to 0-100 using min-max scaling with soft caps.
 * Values above the cap are compressed logarithmically.
 */
function normalize(value: number, min: number, max: number): number {
  if (value <= min) return 0;
  if (value >= max) return 100;
  return ((value - min) / (max - min)) * 100;
}

/**
 * Bridge Outflow Score (0-100)
 * Based on 7-day bridge volume + trend bonus
 */
export function normalizeBridgeOutflow(data: TokenBridgeData): number {
  // $500K+ weekly outflow = max score
  const volumeScore = normalize(data.total7d, 0, 500_000 * 7);
  // Rising trend gets a bonus
  const trendBonus = Math.max(0, data.trend) * 0.3;
  return Math.min(100, Math.round(volumeScore + trendBonus));
}

/**
 * Search Intent Score (0-100)
 * Based on average daily searches + trend
 */
export function normalizeSearchIntent(data: TokenSearchData): number {
  // 5000+ daily searches = max score
  const searchScore = normalize(data.avgDaily, 0, 5000);
  const trendBonus = Math.max(0, data.trend) * 0.2;
  return Math.min(100, Math.round(searchScore + trendBonus));
}

/**
 * Social Demand Score (0-100)
 * Based on demand-specific mentions, sentiment, and influencer reach
 */
export function normalizeSocialDemand(data: TokenSocialData): number {
  // 200+ demand mentions = max
  const mentionScore = normalize(data.demandMentions, 0, 200) * 0.5;
  // Sentiment from 0-1 mapped to 0-100
  const sentimentScore = Math.max(0, data.sentiment) * 100 * 0.3;
  // 30+ influencer mentions = max
  const influencerScore = normalize(data.influencerMentions, 0, 30) * 0.2;
  return Math.min(100, Math.round(mentionScore + sentimentScore + influencerScore));
}

/**
 * Chain Health Score (0-100)
 * Based on market cap, 24h volume, TVL, holder count
 */
export function normalizeChainHealth(data: TokenMarketData): number {
  // $5B+ mcap = max
  const mcapScore = normalize(data.marketCap, 0, 5_000_000_000) * 0.3;
  // $500M+ daily volume = max
  const volumeScore = normalize(data.volume24h, 0, 500_000_000) * 0.25;
  // $5B+ TVL = max
  const tvlScore = normalize(data.tvl, 0, 5_000_000_000) * 0.25;
  // 500K+ holders = max
  const holderScore = normalize(data.holders, 0, 500_000) * 0.2;
  return Math.min(100, Math.round(mcapScore + volumeScore + tvlScore + holderScore));
}

/**
 * Wallet Overlap Score (0-100)
 * Based on overlap percentage + active overlap
 */
export function normalizeWalletOverlap(data: TokenWalletOverlap): number {
  // 40%+ overlap = max
  const overlapScore = normalize(data.overlapPercentage, 0, 40) * 0.6;
  // 80%+ active overlap = max
  const activeScore = normalize(data.activeOverlap, 0, 80) * 0.4;
  return Math.min(100, Math.round(overlapScore + activeScore));
}
