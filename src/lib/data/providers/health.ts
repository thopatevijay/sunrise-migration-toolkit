import { fetchJson } from "./http";
import type { FetchResult } from "./http";

// --- Types ---

export type ProviderName =
  | "coingecko"
  | "wormholescan"
  | "defillama"
  | "jupiter"
  | "dexscreener"
  | "helius";

export type ProviderStatus = "healthy" | "degraded" | "down" | "unknown";

export interface ProviderHealth {
  name: ProviderName;
  displayName: string;
  status: ProviderStatus;
  lastSuccess: string | null; // ISO timestamp
  lastAttempt: string | null; // ISO timestamp
  lastLatencyMs: number | null;
  consecutiveFailures: number;
  lastError: string | null;
}

// --- Display names ---

const DISPLAY_NAMES: Record<ProviderName, string> = {
  coingecko: "CoinGecko",
  wormholescan: "WormholeScan",
  defillama: "DefiLlama",
  jupiter: "Jupiter",
  dexscreener: "DexScreener",
  helius: "Helius",
};

// --- Singleton store ---

interface HealthEntry {
  lastSuccess: string | null;
  lastAttempt: string | null;
  lastLatencyMs: number | null;
  consecutiveFailures: number;
  lastError: string | null;
}

const healthStore = new Map<ProviderName, HealthEntry>();

function getOrCreate(provider: ProviderName): HealthEntry {
  let entry = healthStore.get(provider);
  if (!entry) {
    entry = {
      lastSuccess: null,
      lastAttempt: null,
      lastLatencyMs: null,
      consecutiveFailures: 0,
      lastError: null,
    };
    healthStore.set(provider, entry);
  }
  return entry;
}

// --- Tracked fetch wrapper ---

export async function trackedFetch<T>(
  provider: ProviderName,
  url: string,
  options?: Parameters<typeof fetchJson>[1]
): Promise<FetchResult<T>> {
  const entry = getOrCreate(provider);
  const start = Date.now();
  entry.lastAttempt = new Date().toISOString();

  const result = await fetchJson<T>(url, options);
  entry.lastLatencyMs = Date.now() - start;

  if (result.data !== null && !result.error) {
    entry.lastSuccess = new Date().toISOString();
    entry.consecutiveFailures = 0;
    entry.lastError = null;
  } else {
    entry.consecutiveFailures++;
    entry.lastError = result.error ?? `HTTP ${result.status}`;
  }

  return result;
}

// --- Snapshot ---

function deriveStatus(entry: HealthEntry): ProviderStatus {
  if (!entry.lastAttempt) return "unknown";
  if (entry.consecutiveFailures === 0) return "healthy";
  if (entry.consecutiveFailures <= 2) return "degraded";
  return "down";
}

export function getHealthSnapshot(): ProviderHealth[] {
  const providers: ProviderName[] = [
    "coingecko",
    "wormholescan",
    "defillama",
    "jupiter",
    "dexscreener",
  ];

  return providers.map((name) => {
    const entry = getOrCreate(name);
    return {
      name,
      displayName: DISPLAY_NAMES[name],
      status: deriveStatus(entry),
      lastSuccess: entry.lastSuccess,
      lastAttempt: entry.lastAttempt,
      lastLatencyMs: entry.lastLatencyMs,
      consecutiveFailures: entry.consecutiveFailures,
      lastError: entry.lastError,
    };
  });
}
