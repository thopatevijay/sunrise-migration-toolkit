import {
  fetchMarketData,
  fetchSocialData,
  fetchBridgeData,
  fetchSearchIntent,
  fetchProtocolTvl,
  estimateWalletOverlap,
} from "./providers";
import { discoverMigrationCandidates, getAlreadyMigratedTokens } from "./token-discovery";
import { calculateMDS } from "@/lib/scoring/mds";
import type { MigrationDemandScore } from "@/lib/types/scoring";
import type { TokenCandidate, MigratedToken } from "@/lib/config/tokens";
import type { TokenBridgeData, TokenSearchData, TokenSocialData, TokenMarketData, TokenWalletOverlap } from "@/lib/types/signals";

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
  dataSource: "live" | "demo";
}

export interface AggregateStats {
  candidateCount: number;
  migratedCount: number;
  avgMDS: number;
  totalBridgeVolume7d: number;
  topDemandToken: { symbol: string; score: number };
  risingCount: number;
  dataSource: "live" | "mixed" | "demo";
  lastUpdated: string;
}

// --- Signal fetching with live→demo fallback ---

async function fetchSignals(token: TokenCandidate): Promise<{
  bridge: TokenBridgeData;
  search: TokenSearchData;
  social: TokenSocialData;
  market: TokenMarketData;
  wallet: TokenWalletOverlap;
  liveCount: number;
} | null> {
  let liveCount = 0;

  // Fetch all signals in parallel — live providers first, demo fallback
  const [marketResult, bridgeResult, searchResult, socialResult] = await Promise.allSettled([
    fetchMarketData(token.id, token.coingeckoId),
    fetchBridgeData(token.id, token.symbol),
    fetchSearchIntent(token.id, token.symbol, 50),
    fetchSocialData(token.id, token.coingeckoId, token.symbol),
  ]);

  // Market data
  let market = marketResult.status === "fulfilled" ? marketResult.value : null;
  if (market) {
    // Supplement TVL from DefiLlama if CoinGecko returned 0
    if (market.tvl === 0) {
      const tvl = await fetchProtocolTvl(token.coingeckoId, token.name).catch(() => null);
      if (tvl) market = { ...market, tvl };
    }
    liveCount++;
  }

  // Bridge data
  const bridge = bridgeResult.status === "fulfilled" ? bridgeResult.value : null;
  if (bridge) liveCount++;

  // Search intent
  const search = searchResult.status === "fulfilled" ? searchResult.value : null;
  if (search) liveCount++;

  // Social data
  const social = socialResult.status === "fulfilled" ? socialResult.value : null;
  if (social) liveCount++;

  // Wallet overlap — uses heuristic from other signals
  const wallet = estimateWalletOverlap(
    token.id,
    token.originChain,
    token.category,
    market,
    bridge
  );
  if (wallet) liveCount++;

  if (!bridge || !search || !social || !market || !wallet) return null;

  return { bridge, search, social, market, wallet, liveCount };
}

// --- Public API ---

export async function getTokenCandidates(): Promise<TokenWithScore[]> {
  const candidates = await discoverMigrationCandidates();

  const results = await Promise.allSettled(
    candidates.map(async (token) => {
      const signals = await fetchSignals(token);
      if (!signals) return null;

      const { bridge, search, social, market, wallet } = signals;
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
      } as TokenWithScore;
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<TokenWithScore> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value)
    .sort((a, b) => b.mds.totalScore - a.mds.totalScore);
}

export function getMigratedTokens(): MigratedToken[] {
  return getAlreadyMigratedTokens();
}

export async function getTokenDetail(id: string): Promise<TokenDetail | null> {
  const candidates = await discoverMigrationCandidates();
  const token = candidates.find((t) => t.id === id);
  if (!token) return null;

  const signals = await fetchSignals(token);
  if (!signals) return null;

  const { bridge, search, social, market, wallet, liveCount } = signals;
  const mds = calculateMDS(id, { bridge, search, social, market, wallet });
  const dataSource = liveCount >= 3 ? "live" : "demo";

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
    dataSource,
  };
}

export async function getAggregateStats(): Promise<AggregateStats> {
  const tokens = await getTokenCandidates();
  const migrated = getMigratedTokens();

  if (tokens.length === 0) {
    return {
      candidateCount: 0,
      migratedCount: migrated.length,
      avgMDS: 0,
      totalBridgeVolume7d: 0,
      topDemandToken: { symbol: "N/A", score: 0 },
      risingCount: 0,
      dataSource: "demo",
      lastUpdated: new Date().toISOString(),
    };
  }

  const totalBridge = tokens.reduce((sum, t) => sum + t.bridgeVolume7d, 0);
  const avgMDS = Math.round(
    tokens.reduce((sum, t) => sum + t.mds.totalScore, 0) / tokens.length
  );
  const top = tokens[0];
  const risingCount = tokens.filter((t) => t.mds.trend === "rising").length;

  return {
    candidateCount: tokens.length,
    migratedCount: migrated.length,
    avgMDS,
    totalBridgeVolume7d: totalBridge,
    topDemandToken: { symbol: top.symbol, score: top.mds.totalScore },
    risingCount,
    dataSource: "live",
    lastUpdated: new Date().toISOString(),
  };
}
