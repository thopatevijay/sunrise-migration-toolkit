import {
  fetchMarketData,
  fetchBatchMarketData,
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
  dataSource: "live" | "partial";
}

export interface AggregateStats {
  candidateCount: number;
  migratedCount: number;
  avgMDS: number;
  totalBridgeVolume7d: number;
  topDemandToken: { symbol: string; score: number };
  risingCount: number;
  dataSource: "live" | "partial";
  lastUpdated: string;
}

// --- Signal fetching — partial data approach ---

interface FetchedSignals {
  bridge: TokenBridgeData | null;
  search: TokenSearchData | null;
  social: TokenSocialData | null;
  market: TokenMarketData | null;
  wallet: TokenWalletOverlap | null;
  signalCount: number; // how many signals we got (0-5)
}

async function fetchSignals(
  token: TokenCandidate,
  prefetchedMarket?: TokenMarketData | null
): Promise<FetchedSignals> {
  let signalCount = 0;

  // Use pre-fetched market data if available (from batch call), otherwise fetch individually
  const fetchMarketPromise = prefetchedMarket !== undefined
    ? Promise.resolve(prefetchedMarket)
    : fetchMarketData(token.id, token.coingeckoId);

  const [marketResult, bridgeResult, searchResult, socialResult] = await Promise.allSettled([
    fetchMarketPromise,
    fetchBridgeData(token.id, token.symbol),
    fetchSearchIntent(token.id, token.symbol, 50),
    fetchSocialData(token.id, token.coingeckoId, token.symbol),
  ]);

  // Market data
  let market = marketResult.status === "fulfilled" ? marketResult.value : null;
  if (market) {
    if (market.tvl === 0) {
      const tvl = await fetchProtocolTvl(token.coingeckoId, token.name).catch(() => null);
      if (tvl) market = { ...market, tvl };
    }
    signalCount++;
  }

  // Bridge data
  const bridge = bridgeResult.status === "fulfilled" ? bridgeResult.value : null;
  if (bridge) signalCount++;

  // Search intent
  const search = searchResult.status === "fulfilled" ? searchResult.value : null;
  if (search) signalCount++;

  // Social data
  const social = socialResult.status === "fulfilled" ? socialResult.value : null;
  if (social) signalCount++;

  // Wallet overlap — heuristic from other signals
  const wallet = estimateWalletOverlap(
    token.id,
    token.originChain,
    token.category,
    market,
    bridge
  );
  if (wallet) signalCount++;

  return { bridge, search, social, market, wallet, signalCount };
}

// --- Public API ---

export async function getTokenCandidates(): Promise<TokenWithScore[]> {
  const candidates = discoverMigrationCandidates();

  // Batch-fetch all market data in a single CoinGecko call
  const batchMarket = await fetchBatchMarketData(
    candidates.map((t) => ({ tokenId: t.id, coingeckoId: t.coingeckoId }))
  );

  // Now fetch remaining signals per token (bridge, search, social use different APIs)
  const results = await Promise.allSettled(
    candidates.map(async (token) => {
      const signals = await fetchSignals(token, batchMarket.get(token.id) ?? null);

      if (signals.signalCount === 0) return null;

      const { bridge, search, social, market, wallet } = signals;
      const mds = calculateMDS(token.id, { bridge, search, social, market, wallet });

      return {
        ...token,
        mds,
        marketCap: market?.marketCap ?? 0,
        price: market?.price ?? 0,
        volume24h: market?.volume24h ?? 0,
        change7d: market?.change7d ?? 0,
        bridgeVolume7d: bridge?.total7d ?? 0,
        searchTrend: search?.trend ?? 0,
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
  const candidates = discoverMigrationCandidates();
  const token = candidates.find((t) => t.id === id);
  if (!token) return null;

  const signals = await fetchSignals(token);
  if (signals.signalCount === 0) return null;

  const { bridge, search, social, market, wallet, signalCount } = signals;
  const mds = calculateMDS(id, { bridge, search, social, market, wallet });
  const dataSource = signalCount >= 3 ? "live" : "partial";

  return {
    ...token,
    mds,
    marketCap: market?.marketCap ?? 0,
    price: market?.price ?? 0,
    volume24h: market?.volume24h ?? 0,
    change7d: market?.change7d ?? 0,
    change30d: market?.change30d ?? 0,
    tvl: market?.tvl ?? 0,
    holders: market?.holders ?? 0,
    ath: market?.ath ?? 0,
    athDate: market?.athDate ?? "",
    bridgeVolume7d: bridge?.total7d ?? 0,
    searchTrend: search?.trend ?? 0,
    priceHistory30d: market?.priceHistory30d ?? [],
    bridgeTimeseries: bridge?.timeseries ?? [],
    searchTimeseries: search?.timeseries ?? [],
    walletOverlap: {
      overlapPercentage: wallet?.overlapPercentage ?? 0,
      solanaWallets: wallet?.solanaWallets ?? 0,
      totalHolders: wallet?.totalHolders ?? 0,
      activeOverlap: wallet?.activeOverlap ?? 0,
      topWalletCategories: wallet?.topWalletCategories ?? [],
    },
    socialData: {
      tweets7d: social?.tweets7d ?? 0,
      tweets30d: social?.tweets30d ?? 0,
      sentiment: social?.sentiment ?? 0,
      topHashtags: social?.topHashtags ?? [],
      demandMentions: social?.demandMentions ?? 0,
      influencerMentions: social?.influencerMentions ?? 0,
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
      dataSource: "partial",
      lastUpdated: new Date().toISOString(),
    };
  }

  const totalBridge = tokens.reduce((sum, t) => sum + t.bridgeVolume7d, 0);
  const avgMDS = Math.round(
    tokens.reduce((sum, t) => sum + t.mds.totalScore, 0) / tokens.length
  );
  const top = tokens[0];
  const risingCount = tokens.filter((t) => t.mds.trend === "rising").length;

  // Check if all tokens have high confidence (all 5 signals)
  const allFullConfidence = tokens.every((t) => t.mds.confidence === 1);

  return {
    candidateCount: tokens.length,
    migratedCount: migrated.length,
    avgMDS,
    totalBridgeVolume7d: totalBridge,
    topDemandToken: { symbol: top.symbol, score: top.mds.totalScore },
    risingCount,
    dataSource: allFullConfidence ? "live" : "partial",
    lastUpdated: new Date().toISOString(),
  };
}
