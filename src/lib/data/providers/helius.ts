import { cache, TTL } from "./cache";

const HELIUS_RPC = "https://mainnet.helius-rpc.com";
const MAX_PAGES = 10; // 1000 per page × 10 = 10K holders max scan

interface HeliusTokenAccount {
  address: string;
  mint: string;
  amount: number;
  owner: string;
}

interface HeliusResponse {
  total: number;
  token_accounts: HeliusTokenAccount[];
  cursor?: string;
}

export interface HolderCountResult {
  count: number;
  isExact: boolean; // true if we scanned all pages; false if hit MAX_PAGES limit
}

export async function fetchTokenHolderCount(
  mintAddress: string
): Promise<HolderCountResult | null> {
  const cacheKey = `helius:holders:${mintAddress}`;
  const cached = cache.get<HolderCountResult>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    console.warn("[helius] HELIUS_API_KEY not set, skipping holder count");
    return null;
  }

  try {
    let totalCount = 0;
    let cursor: string | undefined;
    let pages = 0;

    while (pages < MAX_PAGES) {
      const body: Record<string, unknown> = {
        jsonrpc: "2.0",
        id: `holders-${mintAddress}-${pages}`,
        method: "getTokenAccounts",
        params: {
          mint: mintAddress,
          limit: 1000,
          ...(cursor ? { cursor } : {}),
        },
      };

      const res = await fetch(`${HELIUS_RPC}/?api-key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error(`[helius] HTTP ${res.status} for ${mintAddress}`);
        return null;
      }

      const json = await res.json();
      const result = json.result as HeliusResponse | undefined;
      if (!result) return null;

      totalCount += result.token_accounts.length;
      pages++;

      if (!result.cursor || result.token_accounts.length < 1000) {
        // No more pages — we have exact count
        const exact: HolderCountResult = { count: totalCount, isExact: true };
        cache.set(cacheKey, exact, TTL.WALLET_DATA);
        return exact;
      }

      cursor = result.cursor;
    }

    // Hit page limit — count is lower bound
    const approx: HolderCountResult = { count: totalCount, isExact: false };
    cache.set(cacheKey, approx, TTL.WALLET_DATA);
    return approx;
  } catch (err) {
    console.error(`[helius] Failed to fetch holders for ${mintAddress}:`, err);
    return null;
  }
}
