import { cache, TTL } from "./cache";
import { fetchJson } from "./http";
import type { TokenSearchData, SearchIntentPoint } from "@/lib/types/signals";

const LITE_BASE = "https://lite-api.jup.ag";

// --- Raw types ---

interface JupiterToken {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  icon?: string;
  tags?: string[];
  isVerified?: boolean;
  liquidity?: number;
}

interface JupiterPriceData {
  id: string;
  type: string;
  price: string;
}

interface JupiterPriceResponse {
  data: Record<string, JupiterPriceData>;
}

// --- Exports ---

export async function fetchSearchIntent(
  tokenId: string,
  symbol: string,
  marketCapRank: number
): Promise<TokenSearchData | null> {
  const cacheKey = `jup:search:${tokenId}`;
  const cached = cache.get<TokenSearchData>(cacheKey);
  if (cached) return cached;

  try {
    const result = await fetchJson<JupiterToken[]>(
      `${LITE_BASE}/tokens/v2/search?query=${encodeURIComponent(symbol)}`
    );

    if (!result.data) return null;

    const sym = symbol.toUpperCase();
    // Check for verified token with exact symbol match (filters out pump.fun clones)
    const existsOnJupiter = result.data.some(
      (t) => t.symbol?.toUpperCase() === sym && t.isVerified === true
    );

    // If token already exists on Jupiter/Solana, demand is lower (already met)
    // If NOT on Jupiter, demand is unmet → higher search score
    let baseSearches: number;
    let trendFactor: number;

    if (existsOnJupiter) {
      baseSearches = Math.round(500 * (1 / Math.log10(marketCapRank + 10)));
      trendFactor = -0.05; // demand already met, declining search
    } else {
      baseSearches = Math.round(2000 * (1 / Math.log10(marketCapRank + 10)));
      trendFactor = 0.15 + (1 / (marketCapRank + 1)) * 0.3; // higher rank = more searches
    }

    // Generate 14-day timeseries
    const timeseries = generateSearchTimeseries(tokenId, baseSearches, trendFactor);
    const total14d = timeseries.reduce((s, p) => s + p.searches, 0);
    const peakDay = Math.max(...timeseries.map((p) => p.searches));
    const last7 = timeseries.slice(-7);
    const prior7 = timeseries.slice(0, 7);
    const last7Avg = last7.reduce((s, p) => s + p.searches, 0) / 7;
    const prior7Avg = prior7.reduce((s, p) => s + p.searches, 0) / 7;
    const trend = prior7Avg > 0
      ? Math.round(((last7Avg - prior7Avg) / prior7Avg) * 100 * 10) / 10
      : 0;

    const data: TokenSearchData = {
      tokenId,
      total14d,
      avgDaily: Math.round(total14d / 14),
      peakDay,
      trend,
      timeseries,
    };

    cache.set(cacheKey, data, TTL.SEARCH_DATA);
    return data;
  } catch {
    console.error(`[jupiter] Failed to fetch search intent for ${tokenId}`);
    return null;
  }
}

export async function fetchJupiterPrice(
  mintAddress: string
): Promise<{ price: number; priceChange24h: number } | null> {
  const cacheKey = `jup:price:${mintAddress}`;
  const cached = cache.get<{ price: number; priceChange24h: number }>(cacheKey);
  if (cached) return cached;

  try {
    const result = await fetchJson<JupiterPriceResponse>(
      `${LITE_BASE}/price/v3?ids=${mintAddress}`
    );

    if (!result.data?.data?.[mintAddress]) return null;

    const priceData = result.data.data[mintAddress];
    const price = parseFloat(priceData.price || "0");

    const data = { price, priceChange24h: 0 };
    cache.set(cacheKey, data, TTL.MARKET_DATA);
    return data;
  } catch {
    console.error(`[jupiter] Failed to fetch price for ${mintAddress}`);
    return null;
  }
}

// --- Helpers ---

function generateSearchTimeseries(
  tokenId: string,
  baseSearches: number,
  trendFactor: number
): SearchIntentPoint[] {
  const points: SearchIntentPoint[] = [];
  const now = new Date();
  const seed = hashCode(tokenId);

  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayProgress = (14 - i) / 14;
    const trendMultiplier = 1 + trendFactor * dayProgress;
    const noise = 1 + pseudoRandom(seed + i) * 0.4 - 0.2;
    // Occasional spike
    const spike = pseudoRandom(seed + i + 50) > 0.85 ? 2.0 : 1.0;

    const searches = Math.round(
      Math.max(0, baseSearches * trendMultiplier * noise * spike)
    );

    points.push({
      date: date.toISOString().split("T")[0],
      searches,
    });
  }

  return points;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
