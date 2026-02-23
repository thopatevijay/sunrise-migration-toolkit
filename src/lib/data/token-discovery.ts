import { TOKEN_CANDIDATES, MIGRATED_TOKENS } from "@/lib/config/tokens";
import type { TokenCandidate, MigratedToken } from "@/lib/config/tokens";

// Return the curated registry directly.
// Data availability is handled by the partial-data approach in fetchSignals —
// tokens with no API data get scored with whatever signals are available.
export function discoverMigrationCandidates(): TokenCandidate[] {
  return TOKEN_CANDIDATES;
}

export function getAlreadyMigratedTokens(): MigratedToken[] {
  return MIGRATED_TOKENS;
}
