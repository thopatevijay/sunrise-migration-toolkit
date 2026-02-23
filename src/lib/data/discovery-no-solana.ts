import { cache, TTL } from "./providers/cache";
import { trackedFetch } from "./providers/health";
import type { DiscoveryToken } from "@/lib/types/discovery";

const BASE = "https://api.coingecko.com/api/v3";

function headers(): Record<string, string> {
  const key = process.env.COINGECKO_API_KEY;
  return key ? { "x-cg-demo-api-key": key } : {};
}

// --- CoinGecko response types ---

interface CGMarketItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  market_cap: number;
  total_volume: number;
  price_change_percentage_7d_in_currency: number | null;
}

interface CGCoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms: Record<string, string>;
}

// --- Stablecoin filter ---

const STABLECOIN_SYMBOLS = new Set([
  "usdt", "usdc", "dai", "busd", "tusd", "usdp", "frax", "lusd",
  "usdd", "gusd", "pyusd", "fdusd", "usde", "crvusd", "gho",
  "eurc", "eurt", "susd", "usds", "eurs", "usdj", "tribe",
  "flexusd", "musd", "husd", "ust", "cusd",
]);

const STABLECOIN_IDS = new Set([
  "tether", "usd-coin", "dai", "binance-usd", "true-usd",
  "paxos-standard", "frax", "liquity-usd", "usdd", "gemini-dollar",
  "paypal-usd", "first-digital-usd", "ethena-usde", "crvusd",
  "gho", "euro-coin", "tether-eurt", "nusd",
]);

function isStablecoin(id: string, symbol: string): boolean {
  return STABLECOIN_IDS.has(id) || STABLECOIN_SYMBOLS.has(symbol.toLowerCase());
}

// --- Platform display names ---

const CHAIN_DISPLAY: Record<string, string> = {
  ethereum: "Ethereum",
  "arbitrum-one": "Arbitrum",
  "optimistic-ethereum": "Optimism",
  "polygon-pos": "Polygon",
  "binance-smart-chain": "BSC",
  avalanche: "Avalanche",
  base: "Base",
  fantom: "Fantom",
  "near-protocol": "NEAR",
  aptos: "Aptos",
  sui: "Sui",
  "mantle-network": "Mantle",
  linea: "Linea",
  scroll: "Scroll",
  blast: "Blast",
  zkSync: "zkSync",
  "zksync-era": "zkSync",
};

function getDisplayChains(platforms: Record<string, string>): string[] {
  return Object.keys(platforms)
    .filter((p) => p !== "" && p !== "solana" && platforms[p] !== "")
    .map((p) => CHAIN_DISPLAY[p] ?? p)
    .filter((v, i, arr) => arr.indexOf(v) === i) // dedupe
    .slice(0, 5); // max 5 chains shown
}

// --- Fetch platform map (cached separately, expensive call) ---

async function getPlatformMap(): Promise<Map<string, Record<string, string>> | null> {
  const cacheKey = "discovery:coins-list-platforms";
  const cached = cache.get<Map<string, Record<string, string>>>(cacheKey);
  if (cached) return cached;

  const result = await trackedFetch<CGCoinListItem[]>(
    "coingecko",
    `${BASE}/coins/list?include_platform=true`,
    { headers: headers(), timeoutMs: 30_000 }
  );

  if (!result.data) return null;

  const map = new Map<string, Record<string, string>>();
  for (const coin of result.data) {
    if (coin.platforms && Object.keys(coin.platforms).length > 0) {
      map.set(coin.id, coin.platforms);
    }
  }

  cache.set(cacheKey, map, TTL.TOKEN_DISCOVERY);
  return map;
}

// --- Main discovery function ---

export async function fetchNoSolanaTokens(): Promise<DiscoveryToken[]> {
  const cacheKey = "discovery:no-solana-top200";
  const cached = cache.get<DiscoveryToken[]>(cacheKey);
  if (cached) return cached;

  // Call 1: Top 250 tokens by market cap
  const marketsResult = await trackedFetch<CGMarketItem[]>(
    "coingecko",
    `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=7d`,
    { headers: headers() }
  );

  if (!marketsResult.data) return [];

  // Call 2: Full coin list with platform data
  const platformMap = await getPlatformMap();
  if (!platformMap) return [];

  // Cross-reference and filter
  const results: DiscoveryToken[] = [];
  let rank = 0;

  for (const market of marketsResult.data) {
    // Skip stablecoins
    if (isStablecoin(market.id, market.symbol)) continue;

    // Skip tokens with very low market cap
    if (!market.market_cap || market.market_cap < 5_000_000) continue;

    const platforms = platformMap.get(market.id);
    if (!platforms) continue;

    // Check Solana presence
    const solanaAddress = platforms["solana"];
    const hasSolana = solanaAddress && solanaAddress.trim() !== "";

    if (hasSolana) continue; // Has Solana CA — skip

    // Determine origin chains
    const originChains = getDisplayChains(platforms);
    if (originChains.length === 0) continue; // No chain presence

    rank++;
    results.push({
      rank,
      coingeckoId: market.id,
      symbol: market.symbol.toUpperCase(),
      name: market.name,
      logo: market.image ?? "",
      marketCap: market.market_cap ?? 0,
      volume24h: market.total_volume ?? 0,
      change7d: market.price_change_percentage_7d_in_currency ?? 0,
      originChains,
      solanaStatus: "none",
    });
  }

  cache.set(cacheKey, results, TTL.TOKEN_DISCOVERY);
  return results;
}
