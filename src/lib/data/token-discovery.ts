import { STATIC_TOKEN_CANDIDATES, MIGRATED_TOKENS, DISCOVERY_CHAIN_MAP } from "@/lib/config/tokens";
import type { TokenCandidate, MigratedToken } from "@/lib/config/tokens";
import { fetchNoSolanaTokens } from "./discovery-no-solana";

const DYNAMIC_SCORING_LIMIT = 50;

/**
 * Discovers migration candidates dynamically from the top 500 tokens by market cap.
 * Falls back to the static 12-token list if Discovery API fails.
 */
export async function discoverMigrationCandidates(): Promise<TokenCandidate[]> {
  try {
    const discoveryTokens = await fetchNoSolanaTokens();
    if (discoveryTokens.length === 0) {
      console.warn("[token-discovery] Discovery returned 0 tokens, using static list");
      return STATIC_TOKEN_CANDIDATES;
    }

    const top = discoveryTokens.slice(0, DYNAMIC_SCORING_LIMIT);

    return top.map((dt) => ({
      id: dt.coingeckoId,
      symbol: dt.symbol,
      name: dt.name,
      logo: dt.logo,
      originChain: DISCOVERY_CHAIN_MAP[dt.originChains[0]] ?? "other",
      category: "defi" as const,
      coingeckoId: dt.coingeckoId,
      description: `${dt.name} — rank #${dt.rank} by market cap, on ${dt.originChains.join(", ")}`,
      status: "candidate" as const,
    }));
  } catch (error) {
    console.error("[token-discovery] Dynamic discovery failed, using static list:", error);
    return STATIC_TOKEN_CANDIDATES;
  }
}

export function getAlreadyMigratedTokens(): MigratedToken[] {
  return MIGRATED_TOKENS;
}
