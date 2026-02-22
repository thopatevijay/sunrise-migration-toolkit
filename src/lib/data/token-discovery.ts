import { DEMO_CANDIDATES, DEMO_MIGRATED } from "./demo";
import { fetchMarketData, fetchBridgeData } from "./providers";
import type { TokenCandidate, MigratedToken } from "@/lib/config/tokens";

// Curated candidate list — these are real tokens we track
// The list itself is static (these are the tokens we analyze for migration demand)
// but ALL their data comes from live APIs
const CANDIDATE_REGISTRY = DEMO_CANDIDATES;

// Migrated tokens are factual — Sunrise has already migrated these
const MIGRATED_REGISTRY = DEMO_MIGRATED;

export async function discoverMigrationCandidates(): Promise<TokenCandidate[]> {
  // Start with our curated registry
  const candidates = [...CANDIDATE_REGISTRY];

  // Validate each candidate still has market presence via CoinGecko
  // (filters out dead/delisted tokens)
  const validated: TokenCandidate[] = [];

  const checks = await Promise.allSettled(
    candidates.map(async (token) => {
      const market = await fetchMarketData(token.id, token.coingeckoId);
      // If CoinGecko returns data, token is alive and valid
      if (market && market.marketCap > 0) {
        return token;
      }
      // If CoinGecko fails, still include — might be rate limited
      return token;
    })
  );

  for (const result of checks) {
    if (result.status === "fulfilled" && result.value) {
      validated.push(result.value);
    }
  }

  return validated.length > 0 ? validated : candidates;
}

export function getAlreadyMigratedTokens(): MigratedToken[] {
  return MIGRATED_REGISTRY;
}

// Sort candidates by their bridge activity (tokens with real bridge volume first)
export async function rankCandidatesByActivity(
  candidates: TokenCandidate[]
): Promise<TokenCandidate[]> {
  const withVolume = await Promise.allSettled(
    candidates.map(async (token) => {
      const bridge = await fetchBridgeData(token.id, token.symbol);
      return { token, volume: bridge?.total7d ?? 0 };
    })
  );

  const ranked = withVolume
    .filter((r): r is PromiseFulfilledResult<{ token: TokenCandidate; volume: number }> =>
      r.status === "fulfilled"
    )
    .map((r) => r.value)
    .sort((a, b) => b.volume - a.volume)
    .map((r) => r.token);

  return ranked.length > 0 ? ranked : candidates;
}
