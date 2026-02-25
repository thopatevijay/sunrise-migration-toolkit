import { cache, TTL } from "./cache";
import { trackedFetch } from "./health";

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

// --- Token list for Solana presence detection ---

export interface JupiterTokenInfo {
  mint: string;
  symbol: string;
  name: string;
}

/**
 * Fetch all verified Jupiter tokens and return a map keyed by uppercase symbol.
 * Used to detect wrapped/bridged tokens that exist on Solana but aren't listed
 * as native on CoinGecko. Single API call, cached for 60 minutes.
 */
export async function fetchJupiterTokenMap(): Promise<Map<string, JupiterTokenInfo>> {
  const cacheKey = "jup:token-map";
  const cached = cache.get<Map<string, JupiterTokenInfo>>(cacheKey);
  if (cached) return cached;

  try {
    const result = await trackedFetch<JupiterToken[]>(
      "jupiter",
      `${LITE_BASE}/tokens/v2/all`
    );

    const map = new Map<string, JupiterTokenInfo>();
    if (!result.data) return map;

    for (const token of result.data) {
      if (!token.symbol || !token.id) continue;
      const key = token.symbol.toUpperCase();
      // Keep the first match per symbol (Jupiter returns verified first)
      if (!map.has(key)) {
        map.set(key, {
          mint: token.id,
          symbol: token.symbol,
          name: token.name,
        });
      }
    }

    cache.set(cacheKey, map, TTL.TOKEN_DISCOVERY);
    return map;
  } catch {
    console.error("[jupiter] Failed to fetch token list");
    return new Map();
  }
}

// --- Exports ---

/**
 * Check if a token with the given symbol is verified on Jupiter (exists on Solana).
 */
export async function checkJupiterListing(
  symbol: string
): Promise<boolean> {
  const cacheKey = `jup:exists:${symbol}`;
  const cached = cache.get<boolean>(cacheKey);
  if (cached !== null) return cached;

  try {
    const result = await trackedFetch<JupiterToken[]>(
      "jupiter",
      `${LITE_BASE}/tokens/v2/search?query=${encodeURIComponent(symbol)}`
    );

    if (!result.data) return false;

    const sym = symbol.toUpperCase();
    const exists = result.data.some(
      (t) => t.symbol?.toUpperCase() === sym && t.isVerified === true
    );

    cache.set(cacheKey, exists, TTL.SEARCH_DATA);
    return exists;
  } catch {
    return false;
  }
}

export async function fetchJupiterPrice(
  mintAddress: string
): Promise<{ price: number; priceChange24h: number } | null> {
  const cacheKey = `jup:price:${mintAddress}`;
  const cached = cache.get<{ price: number; priceChange24h: number }>(cacheKey);
  if (cached) return cached;

  try {
    const result = await trackedFetch<JupiterPriceResponse>(
      "jupiter",
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
