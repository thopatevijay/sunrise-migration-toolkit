import { NextResponse } from "next/server";
import {
  fetchMarketData,
  fetchSocialData,
  fetchBridgeData,
  checkJupiterListing,
  fetchDexScreenerActivity,
  fetchProtocolTvl,
  fetchProtocolSolanaTvlRatio,
  estimateWalletOverlap,
} from "@/lib/data/providers";
import { calculateMDS } from "@/lib/scoring/mds";
import { cache } from "@/lib/data/providers/cache";
import { DISCOVERY_CHAIN_MAP } from "@/lib/config/tokens";
import type { ChainId, TokenCategory } from "@/lib/config/tokens";
import type { MigrationDemandScore } from "@/lib/types/scoring";

const SCORE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface ScoreRequest {
  coingeckoId: string;
  symbol: string;
  name: string;
  originChain?: string;
}

interface ScoreResponse {
  coingeckoId: string;
  symbol: string;
  mds: MigrationDemandScore;
  marketCap: number;
  volume24h: number;
  bridgeVolume7d: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ScoreRequest;
    const { coingeckoId, symbol, name, originChain } = body;

    if (!coingeckoId || !symbol) {
      return NextResponse.json(
        { error: "coingeckoId and symbol are required" },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `score:${coingeckoId}`;
    const cached = cache.get<ScoreResponse>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Map origin chain
    const chainId: ChainId = originChain
      ? DISCOVERY_CHAIN_MAP[originChain] ?? "other"
      : "other";

    const tokenId = coingeckoId;
    const category: TokenCategory = "defi";

    // Fetch signals in parallel where possible
    const existsOnJupiter = await checkJupiterListing(symbol).catch(() => false);
    const [marketResult, searchResult, socialResult] = await Promise.allSettled([
      fetchMarketData(tokenId, coingeckoId),
      fetchDexScreenerActivity(tokenId, symbol, existsOnJupiter),
      fetchSocialData(tokenId, coingeckoId),
    ]);

    let market = marketResult.status === "fulfilled" ? marketResult.value : null;
    if (market && market.tvl === 0) {
      const tvl = await fetchProtocolTvl(coingeckoId, name).catch(() => null);
      if (tvl) market = { ...market, tvl };
    }

    const bridge = await fetchBridgeData(
      tokenId,
      symbol,
      market?.marketCap,
      market?.volume24h
    ).catch(() => null);

    const search = searchResult.status === "fulfilled" ? searchResult.value : null;
    const social = socialResult.status === "fulfilled" ? socialResult.value : null;
    const protocolTvl = await fetchProtocolSolanaTvlRatio(coingeckoId, name).catch(() => null);
    const wallet = await estimateWalletOverlap(tokenId, chainId, category, market, bridge, protocolTvl);

    // Calculate MDS
    const mds = calculateMDS(tokenId, { bridge, search, social, market, wallet });

    const response: ScoreResponse = {
      coingeckoId,
      symbol,
      mds,
      marketCap: market?.marketCap ?? 0,
      volume24h: market?.volume24h ?? 0,
      bridgeVolume7d: bridge?.total7d ?? 0,
    };

    cache.set(cacheKey, response, SCORE_CACHE_TTL);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[api/tokens/score] Error:", error);
    return NextResponse.json(
      { error: "Failed to score token" },
      { status: 500 }
    );
  }
}
