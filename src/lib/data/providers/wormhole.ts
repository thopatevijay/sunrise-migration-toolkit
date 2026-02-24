import { cache, TTL } from "./cache";
import { trackedFetch } from "./health";
import type { TokenBridgeData } from "@/lib/types/signals";

const BASE = "https://api.wormholescan.io/api/v1";

// Wormhole chain IDs
const WORMHOLE_CHAIN_IDS: Record<string, number> = {
  solana: 1,
  ethereum: 2,
  bsc: 4,
  polygon: 5,
  avalanche: 6,
  arbitrum: 23,
  optimism: 24,
  base: 30,
};

// --- Raw response types ---

interface WormholeAsset {
  emitter_chain: number;
  symbol: string;
  token_address: string;
  token_chain: number;
  txs: string;
  volume: string;
}

interface WormholeTopAssetsResponse {
  assets: WormholeAsset[];
}

interface WormholeScorecard {
  "24h_messages"?: string;
  "24h_tx_count"?: string;
  "24h_volume"?: string;
  total_messages?: string;
  total_tx_count?: string;
  tvl?: string;
}

export interface WormholeScorecards {
  volume24h: number;
  txCount24h: number;
  messages24h: number;
  tvl: number;
  totalMessages: number;
  totalTxCount: number;
}

// --- Exports ---

export async function fetchBridgeData(
  tokenId: string,
  symbol: string,
  marketCap?: number,
  volume24h?: number
): Promise<TokenBridgeData | null> {
  const cacheKey = `wh:bridge:${tokenId}`;
  const cached = cache.get<TokenBridgeData>(cacheKey);
  if (cached) return cached;

  try {
    // Strategy 1: Check WormholeScan top-assets for exact token match
    const [res7d, res30d] = await Promise.all([
      trackedFetch<WormholeTopAssetsResponse>(
        "wormholescan",
        `${BASE}/top-assets-by-volume?timeSpan=7d`
      ),
      trackedFetch<WormholeTopAssetsResponse>(
        "wormholescan",
        `${BASE}/top-assets-by-volume?timeSpan=30d`
      ),
    ]);

    let total7d = 0;
    let total30d = 0;

    if (res7d.data?.assets && res30d.data?.assets) {
      const sym = symbol.toUpperCase();
      const match7d = res7d.data.assets.filter(
        (a) => a.symbol?.toUpperCase() === sym
      );
      const match30d = res30d.data.assets.filter(
        (a) => a.symbol?.toUpperCase() === sym
      );
      total7d = match7d.reduce((sum, a) => sum + parseFloat(a.volume || "0"), 0);
      total30d = match30d.reduce((sum, a) => sum + parseFloat(a.volume || "0"), 0);
    }

    // Strategy 2: If WormholeScan doesn't have this token, estimate bridge
    // activity from market volume data (tokens with higher volume on non-Solana
    // chains likely have more bridge demand to Solana)
    let dataSource: "live" | "estimated" = total30d > 0 ? "live" : "estimated";

    if (total30d === 0 && marketCap && marketCap > 0 && volume24h && volume24h > 0) {
      const velocityRatio = Math.min(1, (volume24h * 30) / marketCap);
      const mcapTier = Math.min(1, Math.log10(marketCap / 1e6) / 4);
      const bridgePercent = 0.005 * velocityRatio * mcapTier;
      total30d = Math.round(volume24h * 30 * bridgePercent);
      total7d = Math.round(volume24h * 7 * bridgePercent);
      dataSource = "estimated";
    }

    if (total30d === 0 && total7d === 0) return null;

    const avgDaily = total30d / 30;

    const priorWeekEstimate = total30d > total7d
      ? ((total30d - total7d) / 23) * 7
      : total7d * 0.8;
    const trend = priorWeekEstimate > 0
      ? Math.round(((total7d - priorWeekEstimate) / priorWeekEstimate) * 100 * 10) / 10
      : 0;

    const result: TokenBridgeData = {
      tokenId,
      total30d: Math.round(total30d),
      total7d: Math.round(total7d),
      avgDaily: Math.round(avgDaily),
      trend,
      timeseries: [],
      dataSource,
    };

    cache.set(cacheKey, result, TTL.BRIDGE_DATA);
    return result;
  } catch {
    console.error(`[wormhole] Failed to fetch bridge data for ${tokenId}`);
    return null;
  }
}


export async function fetchScorecards(): Promise<WormholeScorecards | null> {
  const cacheKey = "wh:scorecards";
  const cached = cache.get<WormholeScorecards>(cacheKey);
  if (cached) return cached;

  try {
    const result = await trackedFetch<WormholeScorecard>("wormholescan", `${BASE}/scorecards`);
    if (!result.data) return null;

    const sc = result.data;
    const parsed: WormholeScorecards = {
      volume24h: parseFloat(sc["24h_volume"] ?? "0"),
      txCount24h: parseFloat(sc["24h_tx_count"] ?? "0"),
      messages24h: parseFloat(sc["24h_messages"] ?? "0"),
      tvl: parseFloat(sc.tvl ?? "0"),
      totalMessages: parseFloat(sc.total_messages ?? "0"),
      totalTxCount: parseFloat(sc.total_tx_count ?? "0"),
    };

    cache.set(cacheKey, parsed, TTL.SCORECARDS);
    return parsed;
  } catch {
    console.error("[wormhole] Failed to fetch scorecards");
    return null;
  }
}

export { WORMHOLE_CHAIN_IDS };
