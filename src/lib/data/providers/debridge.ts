import { cache, TTL } from "./cache";
import { trackedFetch } from "./health";

const CHAINS_URL = "https://dln.debridge.finance/v1.0/supported-chains-info";
const ORDERS_URL = "https://stats-api.dln.trade/api/Orders/filteredList";

// --- Types ---

interface DebridgeChainInfo {
  chainId: number;
  chainName: string;
}

interface DebridgeSupportedChains {
  chains: Record<string, DebridgeChainInfo>;
}

export interface DebridgeOrder {
  orderId: string;
  giveChainId: number;
  takeChainId: number;
  giveAmount: string;
  takeAmount: string;
  status: string;
  createdAt: string;
}

interface DebridgeOrdersResponse {
  orders: DebridgeOrder[];
}

// --- Exports ---

export async function fetchDebridgeChains(): Promise<
  { chainId: number; chainName: string }[] | null
> {
  const cacheKey = "db:chains";
  const cached = cache.get<{ chainId: number; chainName: string }[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await trackedFetch<DebridgeSupportedChains>("debridge", CHAINS_URL);
    if (!result.data?.chains) return null;

    const chains = Object.values(result.data.chains).map((c) => ({
      chainId: c.chainId,
      chainName: c.chainName,
    }));

    cache.set(cacheKey, chains, TTL.PROTOCOLS);
    return chains;
  } catch {
    console.error("[debridge] Failed to fetch supported chains");
    return null;
  }
}

export async function fetchRecentOrders(
  limit: number = 20
): Promise<DebridgeOrder[] | null> {
  const cacheKey = `db:orders:${limit}`;
  const cached = cache.get<DebridgeOrder[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await trackedFetch<DebridgeOrdersResponse>("debridge", ORDERS_URL, {
      method: "POST",
      body: JSON.stringify({
        filter: {},
        skip: 0,
        take: limit,
      }),
    });

    if (!result.data?.orders) return null;

    cache.set(cacheKey, result.data.orders, TTL.BRIDGE_DATA);
    return result.data.orders;
  } catch {
    console.error("[debridge] Failed to fetch recent orders");
    return null;
  }
}
