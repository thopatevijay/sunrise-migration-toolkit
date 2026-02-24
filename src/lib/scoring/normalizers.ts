import type { TokenBridgeData, TokenSearchData, TokenSocialData, TokenMarketData, TokenWalletOverlap } from "@/lib/types/signals";

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
 * Based on real CoinGecko community data: followers, reddit activity, sentiment
 */
export function normalizeSocialDemand(data: TokenSocialData): number {
  // communityScore is already a 0-100 composite, weight 60%
  const communityPart = data.communityScore * 0.6;
  // Positive sentiment bonus, weight 25%
  const sentimentPart = Math.max(0, data.sentiment) * 100 * 0.25;
  // Reddit engagement ratio as activity signal, weight 15%
  const engagementRatio = data.redditSubscribers > 0
    ? Math.min(100, (data.redditActive48h / data.redditSubscribers) * 1000)
    : 0;
  const engagementPart = engagementRatio * 0.15;
  return Math.min(100, Math.round(communityPart + sentimentPart + engagementPart));
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
