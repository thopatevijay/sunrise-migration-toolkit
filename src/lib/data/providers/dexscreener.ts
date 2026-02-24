import { cache, TTL } from "./cache";
import { trackedFetch } from "./health";
import type { TokenSearchData } from "@/lib/types/signals";

const DEXSCREENER_BASE = "https://api.dexscreener.com";

// --- Raw types ---

interface DexScreenerPair {
  chainId: string;
  baseToken: { address: string; name: string; symbol: string };
  volume: { h24?: number };
  txns: { h24?: { buys: number; sells: number } };
  liquidity: { usd?: number };
}

interface DexScreenerSearchResponse {
  pairs: DexScreenerPair[] | null;
}

interface DexScreenerBoostToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  totalAmount: number;
}

// --- Exports ---

export async function fetchDexScreenerActivity(
  tokenId: string,
  symbol: string,
  existsOnJupiter: boolean
): Promise<TokenSearchData | null> {
  const cacheKey = `dex:activity:${tokenId}`;
  const cached = cache.get<TokenSearchData>(cacheKey);
  if (cached) return cached;

  try {
    const [searchResult, boostsResult] = await Promise.allSettled([
      trackedFetch<DexScreenerSearchResponse>(
        "dexscreener",
        `${DEXSCREENER_BASE}/latest/dex/search?q=${encodeURIComponent(symbol)}`
      ),
      trackedFetch<DexScreenerBoostToken[]>(
        "dexscreener",
        `${DEXSCREENER_BASE}/token-boosts/top/v1`
      ),
    ]);

    // Aggregate volume and txns across all pairs matching this symbol
    let totalVolume24h = 0;
    let totalTxns24h = 0;
    let totalLiquidity = 0;
    let pairCount = 0;
    let solanaPairCount = 0;

    if (searchResult.status === "fulfilled" && searchResult.value.data?.pairs) {
      const sym = symbol.toUpperCase();
      const pairs = searchResult.value.data.pairs.filter(
        (p) => p.baseToken.symbol.toUpperCase() === sym
      );

      for (const pair of pairs) {
        totalVolume24h += pair.volume?.h24 ?? 0;
        totalTxns24h += (pair.txns?.h24?.buys ?? 0) + (pair.txns?.h24?.sells ?? 0);
        totalLiquidity += pair.liquidity?.usd ?? 0;
        pairCount++;
        if (pair.chainId === "solana") solanaPairCount++;
      }
    }

    // Check if token appears in trending boosts
    let boostScore = 0;
    if (boostsResult.status === "fulfilled" && boostsResult.value.data) {
      const boosts = Array.isArray(boostsResult.value.data) ? boostsResult.value.data : [];
      const sym = symbol.toLowerCase();
      const boostEntry = boosts.find((b) =>
        b.url?.toLowerCase().includes(sym)
      );
      if (boostEntry) boostScore = boostEntry.totalAmount;
    }

    // Unmet demand multiplier: NOT on Solana = higher demand signal
    const unmetMultiplier = existsOnJupiter ? 0.5 : 1.5;

    const avgDaily = Math.round(totalTxns24h * unmetMultiplier + (boostScore > 0 ? 500 : 0));

    // Trend based on boost presence and volume
    const trend = boostScore > 0 ? 15 : (totalVolume24h > 100_000 ? 5 : -5);

    const data: TokenSearchData = {
      tokenId,
      avgDaily,
      trend,
      existsOnJupiter,
      pairCount,
      solanaPairCount,
      totalVolume24h,
      totalLiquidity,
      boostScore,
    };

    cache.set(cacheKey, data, TTL.SEARCH_DATA);
    return data;
  } catch {
    console.error(`[dexscreener] Failed to fetch activity for ${tokenId}`);
    return null;
  }
}
