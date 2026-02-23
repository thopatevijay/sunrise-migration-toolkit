import { cache, TTL } from "./cache";
import { fetchJson } from "./http";
import type { TokenMarketData } from "@/lib/types/signals";
import type { TokenSocialData } from "@/lib/types/signals";

const BASE = "https://api.coingecko.com/api/v3";

function headers(): Record<string, string> {
  const key = process.env.COINGECKO_API_KEY;
  return key ? { "x-cg-demo-api-key": key } : {};
}

// --- Raw CoinGecko types ---

interface CoinGeckoMarketData {
  current_price: Record<string, number>;
  market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  total_value_locked?: { usd?: number } | null;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  ath: Record<string, number>;
  ath_date: Record<string, string>;
  circulating_supply?: number;
  total_supply?: number;
}

interface CoinGeckoCommunityData {
  twitter_followers?: number | null;
  reddit_subscribers?: number | null;
  reddit_average_posts_48h?: number | null;
  reddit_accounts_active_48h?: number | null;
}

interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  market_data?: CoinGeckoMarketData;
  community_data?: CoinGeckoCommunityData;
  sentiment_votes_up_percentage?: number | null;
  platforms?: Record<string, string>;
}

interface CoinGeckoMarketChart {
  prices: [number, number][];
}

// --- Exports ---

export async function fetchMarketData(
  tokenId: string,
  coingeckoId: string
): Promise<TokenMarketData | null> {
  const cacheKey = `cg:market:${tokenId}`;
  const cached = cache.get<TokenMarketData>(cacheKey);
  if (cached) return cached;

  try {
    const [coinResult, chartResult] = await Promise.all([
      fetchJson<CoinGeckoCoin>(
        `${BASE}/coins/${coingeckoId}?localization=false&tickers=false&community_data=true&developer_data=false`,
        { headers: headers() }
      ),
      fetchJson<CoinGeckoMarketChart>(
        `${BASE}/coins/${coingeckoId}/market_chart?vs_currency=usd&days=30`,
        { headers: headers() }
      ),
    ]);

    if (!coinResult.data?.market_data) return null;

    const md = coinResult.data.market_data;
    const price = md.current_price?.usd ?? 0;
    const marketCap = md.market_cap?.usd ?? 0;

    const priceHistory30d = chartResult.data?.prices
      ? groupPricesByDay(chartResult.data.prices)
      : [];

    const holders = estimateHolders(marketCap, price);

    const result: TokenMarketData = {
      tokenId,
      price,
      marketCap,
      volume24h: md.total_volume?.usd ?? 0,
      tvl: md.total_value_locked?.usd ?? 0,
      holders,
      change7d: md.price_change_percentage_7d ?? 0,
      change30d: md.price_change_percentage_30d ?? 0,
      ath: md.ath?.usd ?? 0,
      athDate: md.ath_date?.usd?.split("T")[0] ?? "",
      circulatingSupply: md.circulating_supply ?? 0,
      totalSupply: md.total_supply ?? 0,
      priceHistory30d,
    };

    cache.set(cacheKey, result, TTL.MARKET_DATA);
    return result;
  } catch {
    console.error(`[coingecko] Failed to fetch market data for ${tokenId}`);
    return null;
  }
}

export async function fetchSocialData(
  tokenId: string,
  coingeckoId: string,
  symbol: string
): Promise<TokenSocialData | null> {
  const cacheKey = `cg:social:${tokenId}`;
  const cached = cache.get<TokenSocialData>(cacheKey);
  if (cached) return cached;

  try {
    const result = await fetchJson<CoinGeckoCoin>(
      `${BASE}/coins/${coingeckoId}?localization=false&tickers=false&community_data=true&developer_data=false`,
      { headers: headers() }
    );

    if (!result.data) return null;

    const coin = result.data;
    const community = coin.community_data;
    const sentimentUp = coin.sentiment_votes_up_percentage ?? 50;

    const twitterFollowers = community?.twitter_followers ?? 0;
    const redditSubs = community?.reddit_subscribers ?? 0;
    const redditActive = community?.reddit_accounts_active_48h ?? 0;

    // Derive social signals from CoinGecko community data
    const sentiment = Math.round(((sentimentUp / 100) * 2 - 1) * 100) / 100; // normalized -1..1
    const baseTweets = Math.round(twitterFollowers * 0.002 * Math.max(0.5, (sentimentUp / 50)));
    const tweets7d = Math.max(baseTweets, 10);
    const tweets30d = Math.round(tweets7d * 3.8);
    const demandMentions = Math.round(tweets7d * 0.15 * Math.max(0.5, sentimentUp / 50));
    const influencerMentions = Math.round(
      Math.min(30, (redditActive / 100) + (twitterFollowers / 50000) * 5)
    );

    // Trend from reddit activity + sentiment as proxy
    const trend = Math.round(
      (sentiment * 20) + (redditSubs > 0 ? Math.min(15, redditActive / redditSubs * 100) : 0)
    );

    const social: TokenSocialData = {
      tokenId,
      tweets7d,
      tweets30d,
      sentiment,
      topHashtags: [
        `#${symbol.toUpperCase()}`,
        `#${symbol.toUpperCase()}onSolana`,
        "#SolanaGraveyard",
        "#Sunrise",
      ],
      demandMentions,
      influencerMentions,
      trend,
    };

    cache.set(cacheKey, social, TTL.SOCIAL_DATA);
    return social;
  } catch {
    console.error(`[coingecko] Failed to fetch social data for ${tokenId}`);
    return null;
  }
}

export async function fetchCoinGeckoPlatforms(
  coingeckoId: string
): Promise<Record<string, string> | null> {
  const cacheKey = `cg:platforms:${coingeckoId}`;
  const cached = cache.get<Record<string, string>>(cacheKey);
  if (cached) return cached;

  try {
    const result = await fetchJson<CoinGeckoCoin>(
      `${BASE}/coins/${coingeckoId}?localization=false&tickers=false&community_data=false&developer_data=false`,
      { headers: headers() }
    );
    if (!result.data?.platforms) return null;
    cache.set(cacheKey, result.data.platforms, TTL.PROTOCOLS);
    return result.data.platforms;
  } catch {
    return null;
  }
}

// --- Helpers ---

function groupPricesByDay(prices: [number, number][]): { date: string; price: number }[] {
  const byDay = new Map<string, number>();
  for (const [ts, price] of prices) {
    const date = new Date(ts).toISOString().split("T")[0];
    byDay.set(date, price); // keep last price of day
  }
  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, price]) => ({
      date,
      price: Math.round(price * 10000) / 10000,
    }));
}

function estimateHolders(marketCap: number, price: number): number {
  if (price === 0 || marketCap === 0) return 10_000;
  const raw = Math.round(marketCap / (price * 500));
  return Math.max(10_000, Math.min(1_000_000, raw));
}
