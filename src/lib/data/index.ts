import {
  fetchMarketData,
  fetchBatchMarketData,
  fetchSocialData,
  fetchBridgeData,
  fetchSearchIntent,
  fetchProtocolTvl,
  fetchProtocolSolanaTvlRatio,
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
    isEstimated?: boolean;
  };
  bridgeDataSource: "live" | "estimated";
  socialData: {
    twitterFollowers: number;
    redditSubscribers: number;
    redditActive48h: number;
    sentimentUpPct: number;
    sentiment: number;
    communityScore: number;
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

  // Fetch market, search, and social in parallel (bridge needs market cap for DefiLlama fallback)
  const [marketResult, searchResult, socialResult] = await Promise.allSettled([
    fetchMarketPromise,
    fetchSearchIntent(token.id, token.symbol, 50),
    fetchSocialData(token.id, token.coingeckoId),
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

  // Bridge data — pass market cap + volume for estimation fallback when WormholeScan lacks data
  const bridge = await fetchBridgeData(
    token.id, token.symbol, market?.marketCap, market?.volume24h
  ).catch(() => null);
  if (bridge) signalCount++;

  // Search intent
  const search = searchResult.status === "fulfilled" ? searchResult.value : null;
  if (search) signalCount++;

  // Social data
  const social = socialResult.status === "fulfilled" ? socialResult.value : null;
  if (social) signalCount++;

  // Wallet overlap — heuristic enhanced with real TVL data
  const protocolTvl = await fetchProtocolSolanaTvlRatio(
    token.coingeckoId,
    token.name
  ).catch(() => null);

  const wallet = await estimateWalletOverlap(
    token.id,
    token.originChain,
    token.category,
    market,
    bridge,
    protocolTvl
  );
  if (wallet) signalCount++;

  return { bridge, search, social, market, wallet, signalCount };
}

// --- Public API ---

// Process tokens in batches to respect API rate limits (especially CoinGecko 30/min)
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 2000;

async function processBatch(
  tokens: TokenCandidate[],
  batchMarket: Map<string, TokenMarketData>
): Promise<(TokenWithScore | null)[]> {
  return Promise.all(
    tokens.map(async (token) => {
      try {
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
      } catch {
        console.error(`[data] Failed to score ${token.id}`);
        return null;
      }
    })
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getTokenCandidates(): Promise<TokenWithScore[]> {
  const candidates = await discoverMigrationCandidates();

  // Batch-fetch all market data in a single CoinGecko call
  const batchMarket = await fetchBatchMarketData(
    candidates.map((t) => ({ tokenId: t.id, coingeckoId: t.coingeckoId }))
  );

  // Process signals in batches to respect rate limits
  const allResults: (TokenWithScore | null)[] = [];
  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const batchResults = await processBatch(batch, batchMarket);
    allResults.push(...batchResults);

    // Delay between batches (skip after last batch)
    if (i + BATCH_SIZE < candidates.length) {
      await delay(BATCH_DELAY_MS);
    }
  }

  return allResults
    .filter((r): r is TokenWithScore => r !== null)
    .sort((a, b) => b.mds.totalScore - a.mds.totalScore);
}

export function getMigratedTokens(): MigratedToken[] {
  return getAlreadyMigratedTokens();
}

export async function getTokenDetail(id: string): Promise<TokenDetail | null> {
  const candidates = await discoverMigrationCandidates();
  let token = candidates.find((t) => t.id === id);

  // Fallback: build TokenCandidate on-the-fly from Discovery data
  if (!token) {
    const { fetchNoSolanaTokens } = await import("./discovery-no-solana");
    const { DISCOVERY_CHAIN_MAP } = await import("@/lib/config/tokens");
    const discoveryTokens = await fetchNoSolanaTokens();
    const dt = discoveryTokens.find((t) => t.coingeckoId === id);
    if (!dt) return null;

    token = {
      id: dt.coingeckoId,
      symbol: dt.symbol,
      name: dt.name,
      logo: dt.logo,
      originChain: DISCOVERY_CHAIN_MAP[dt.originChains[0]] ?? "other",
      category: "defi" as const,
      coingeckoId: dt.coingeckoId,
      description: `${dt.name} — rank #${dt.rank} by market cap, on ${dt.originChains.join(", ")}`,
      status: "candidate" as const,
    };
  }

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
      isEstimated: wallet?.isEstimated ?? true,
    },
    bridgeDataSource: bridge?.dataSource ?? "estimated",
    socialData: {
      twitterFollowers: social?.twitterFollowers ?? 0,
      redditSubscribers: social?.redditSubscribers ?? 0,
      redditActive48h: social?.redditActive48h ?? 0,
      sentimentUpPct: social?.sentimentUpPct ?? 50,
      sentiment: social?.sentiment ?? 0,
      communityScore: social?.communityScore ?? 0,
    },
    dataSource,
  };
}

export async function getAggregateStats(precomputed?: TokenWithScore[]): Promise<AggregateStats> {
  const tokens = precomputed ?? await getTokenCandidates();
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
