import {
  DEMO_CANDIDATES,
  DEMO_MIGRATED,
  getBridgeData,
  getSearchData,
  getSocialData,
  getMarketData,
  getWalletOverlap,
} from "./demo";
import { calculateMDS } from "@/lib/scoring/mds";
import type { MigrationDemandScore } from "@/lib/types/scoring";
import type { TokenCandidate, MigratedToken } from "@/lib/config/tokens";

export interface TokenWithScore extends TokenCandidate {
  mds: MigrationDemandScore;
  marketCap: number;
  price: number;
  volume24h: number;
  change7d: number;
  bridgeVolume7d: number;
  searchTrend: number;
}

export interface TokenDetail extends TokenWithScore {
  tvl: number;
  holders: number;
  change30d: number;
  ath: number;
  athDate: string;
  priceHistory30d: { date: string; price: number }[];
  bridgeTimeseries: { date: string; volume: number; txCount: number }[];
  searchTimeseries: { date: string; searches: number }[];
  walletOverlap: {
    overlapPercentage: number;
    solanaWallets: number;
    totalHolders: number;
    activeOverlap: number;
    topWalletCategories: { category: string; percentage: number }[];
  };
  socialData: {
    tweets7d: number;
    tweets30d: number;
    sentiment: number;
    topHashtags: string[];
    demandMentions: number;
    influencerMentions: number;
  };
}

export interface AggregateStats {
  candidateCount: number;
  migratedCount: number;
  avgMDS: number;
  totalBridgeVolume7d: number;
  topDemandToken: { symbol: string; score: number };
  risingCount: number;
}

function scoreToken(token: TokenCandidate): TokenWithScore | null {
  const bridge = getBridgeData(token.id);
  const search = getSearchData(token.id);
  const social = getSocialData(token.id);
  const market = getMarketData(token.id);
  const wallet = getWalletOverlap(token.id);

  if (!bridge || !search || !social || !market || !wallet) return null;

  const mds = calculateMDS(token.id, { bridge, search, social, market, wallet });

  return {
    ...token,
    mds,
    marketCap: market.marketCap,
    price: market.price,
    volume24h: market.volume24h,
    change7d: market.change7d,
    bridgeVolume7d: bridge.total7d,
    searchTrend: search.trend,
  };
}

export function getTokenCandidates(): TokenWithScore[] {
  return DEMO_CANDIDATES
    .map(scoreToken)
    .filter((t): t is TokenWithScore => t !== null)
    .sort((a, b) => b.mds.totalScore - a.mds.totalScore);
}

export function getMigratedTokens(): MigratedToken[] {
  return DEMO_MIGRATED;
}

export function getTokenDetail(id: string): TokenDetail | null {
  const token = DEMO_CANDIDATES.find((t) => t.id === id);
  if (!token) return null;

  const bridge = getBridgeData(id);
  const search = getSearchData(id);
  const social = getSocialData(id);
  const market = getMarketData(id);
  const wallet = getWalletOverlap(id);

  if (!bridge || !search || !social || !market || !wallet) return null;

  const mds = calculateMDS(id, { bridge, search, social, market, wallet });

  return {
    ...token,
    mds,
    marketCap: market.marketCap,
    price: market.price,
    volume24h: market.volume24h,
    change7d: market.change7d,
    change30d: market.change30d,
    tvl: market.tvl,
    holders: market.holders,
    ath: market.ath,
    athDate: market.athDate,
    bridgeVolume7d: bridge.total7d,
    searchTrend: search.trend,
    priceHistory30d: market.priceHistory30d,
    bridgeTimeseries: bridge.timeseries,
    searchTimeseries: search.timeseries,
    walletOverlap: {
      overlapPercentage: wallet.overlapPercentage,
      solanaWallets: wallet.solanaWallets,
      totalHolders: wallet.totalHolders,
      activeOverlap: wallet.activeOverlap,
      topWalletCategories: wallet.topWalletCategories,
    },
    socialData: {
      tweets7d: social.tweets7d,
      tweets30d: social.tweets30d,
      sentiment: social.sentiment,
      topHashtags: social.topHashtags,
      demandMentions: social.demandMentions,
      influencerMentions: social.influencerMentions,
    },
  };
}

export function getAggregateStats(): AggregateStats {
  const tokens = getTokenCandidates();
  const totalBridge = tokens.reduce((sum, t) => sum + t.bridgeVolume7d, 0);
  const avgMDS = Math.round(
    tokens.reduce((sum, t) => sum + t.mds.totalScore, 0) / tokens.length
  );
  const top = tokens[0];
  const risingCount = tokens.filter((t) => t.mds.trend === "rising").length;

  return {
    candidateCount: tokens.length,
    migratedCount: DEMO_MIGRATED.length,
    avgMDS,
    totalBridgeVolume7d: totalBridge,
    topDemandToken: { symbol: top.symbol, score: top.mds.totalScore },
    risingCount,
  };
}
