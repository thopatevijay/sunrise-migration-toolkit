import { cache, TTL } from "./cache";
import { trackedFetch } from "./health";

const PROTOCOLS_URL = "https://api.llama.fi/protocols";
const CHAINS_URL = "https://api.llama.fi/v2/chains";
const BRIDGES_URL = "https://bridges.llama.fi/bridges?includeChains=true";

// --- Raw types ---

interface DefiLlamaProtocol {
  id: string;
  name: string;
  slug: string;
  gecko_id: string | null;
  tvl: number;
  chain: string;
  chains: string[];
  category: string;
}

interface DefiLlamaChain {
  gecko_id: string | null;
  tvl: number;
  tokenSymbol: string;
  cmcId: string;
  name: string;
  chainId: number | null;
}

interface DefiLlamaBridge {
  id: number;
  name: string;
  displayName: string;
  lastHourlyVolume: number;
  currentDayVolume: number;
  lastDailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
  chains: string[];
}

// --- Exports ---

export async function fetchProtocolTvl(
  coingeckoId: string,
  name: string
): Promise<number | null> {
  const cacheKey = `dl:tvl:${coingeckoId}`;
  const cached = cache.get<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    const protocols = await getAllProtocols();
    if (!protocols) return null;

    // Match by gecko_id first, then by name
    const match =
      protocols.find((p) => p.gecko_id === coingeckoId) ??
      protocols.find(
        (p) => p.name.toLowerCase() === name.toLowerCase() ||
               p.slug?.toLowerCase() === name.toLowerCase()
      );

    if (!match) return null;

    cache.set(cacheKey, match.tvl, TTL.PROTOCOLS);
    return match.tvl;
  } catch {
    console.error(`[defillama] Failed to fetch TVL for ${coingeckoId}`);
    return null;
  }
}

export async function fetchChainBridgeVolume(
  chainName: string
): Promise<{ daily: number; weekly: number; monthly: number } | null> {
  const cacheKey = `dl:bridge-vol:${chainName}`;
  const cached = cache.get<{ daily: number; weekly: number; monthly: number }>(cacheKey);
  if (cached) return cached;

  try {
    const result = await trackedFetch<DefiLlamaBridge[]>("defillama", BRIDGES_URL);
    if (!result.data) return null;

    const chainLower = chainName.toLowerCase();
    const matching = result.data.filter((b) =>
      b.chains?.some((c) => c.toLowerCase() === chainLower)
    );

    if (matching.length === 0) return null;

    const volumes = {
      daily: matching.reduce((s, b) => s + (b.lastDailyVolume || 0), 0),
      weekly: matching.reduce((s, b) => s + (b.weeklyVolume || 0), 0),
      monthly: matching.reduce((s, b) => s + (b.monthlyVolume || 0), 0),
    };

    cache.set(cacheKey, volumes, TTL.BRIDGE_DATA);
    return volumes;
  } catch {
    console.error(`[defillama] Failed to fetch bridge volume for ${chainName}`);
    return null;
  }
}

export async function fetchSolanaChainTvl(): Promise<number | null> {
  const cacheKey = "dl:solana-tvl";
  const cached = cache.get<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    const result = await trackedFetch<DefiLlamaChain[]>("defillama", CHAINS_URL);
    if (!result.data) return null;

    const solana = result.data.find(
      (c) => c.name.toLowerCase() === "solana"
    );
    if (!solana) return null;

    cache.set(cacheKey, solana.tvl, TTL.PROTOCOLS);
    return solana.tvl;
  } catch {
    console.error("[defillama] Failed to fetch Solana TVL");
    return null;
  }
}

// --- Internal ---

async function getAllProtocols(): Promise<DefiLlamaProtocol[] | null> {
  const cacheKey = "dl:all-protocols";
  const cached = cache.get<DefiLlamaProtocol[]>(cacheKey);
  if (cached) return cached;

  const result = await trackedFetch<DefiLlamaProtocol[]>("defillama", PROTOCOLS_URL);
  if (!result.data) return null;

  cache.set(cacheKey, result.data, TTL.PROTOCOLS);
  return result.data;
}
