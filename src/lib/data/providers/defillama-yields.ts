import { cache, TTL } from "./cache";

const YIELDS_URL = "https://yields.llama.fi/pools";

// Map our protocol display names to DefiLlama project slugs
const PROTOCOL_SLUGS: Record<string, string[]> = {
  "Kamino Finance": ["kamino"],
  "MarginFi": ["marginfi"],
  "Raydium": ["raydium"],
  "Orca": ["orca"],
  "Drift Protocol": ["drift-protocol"],
  "Sanctum": ["sanctum"],
  "Jupiter": ["jupiter"],
};

export interface YieldPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
}

export interface ProtocolYield {
  protocol: string;
  bestApy: number;
  poolSymbol: string;
  tvlUsd: number;
}

const CACHE_KEY = "defillama:yields:solana";

export async function fetchSolanaYields(): Promise<Record<string, ProtocolYield>> {
  const cached = cache.get<Record<string, ProtocolYield>>(CACHE_KEY);
  if (cached) return cached;

  try {
    const res = await fetch(YIELDS_URL);
    if (!res.ok) {
      console.warn(`[defillama-yields] HTTP ${res.status}`);
      return {};
    }

    const data = await res.json();
    const pools: YieldPool[] = data.data ?? [];

    // Filter to Solana pools from tracked protocols
    const solanaProtocols = new Set(
      Object.values(PROTOCOL_SLUGS).flat()
    );

    const solanaPools = pools.filter(
      (p) => p.chain === "Solana" && solanaProtocols.has(p.project)
    );

    // Find best APY per protocol display name
    const result: Record<string, ProtocolYield> = {};

    for (const [displayName, slugs] of Object.entries(PROTOCOL_SLUGS)) {
      const protocolPools = solanaPools
        .filter((p) => slugs.includes(p.project))
        .filter((p) => (p.apy ?? 0) > 0 && (p.tvlUsd ?? 0) > 10000);

      if (protocolPools.length === 0) continue;

      // Sort by TVL descending to get the most liquid pool with good APY
      protocolPools.sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0));

      // Pick the best APY among top-TVL pools (top 10 by TVL)
      const topPools = protocolPools.slice(0, 10);
      const best = topPools.reduce((prev, curr) =>
        (curr.apy ?? 0) > (prev.apy ?? 0) ? curr : prev
      );

      result[displayName] = {
        protocol: displayName,
        bestApy: best.apy ?? 0,
        poolSymbol: best.symbol,
        tvlUsd: best.tvlUsd,
      };
    }

    cache.set(CACHE_KEY, result, TTL.WALLET_DATA);
    return result;
  } catch (e) {
    console.error("[defillama-yields] fetch error:", e);
    return {};
  }
}
