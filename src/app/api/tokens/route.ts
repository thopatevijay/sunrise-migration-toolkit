import { NextResponse } from "next/server";
import { getTokenCandidates, getMigratedTokens, getAggregateStats } from "@/lib/data";
import { getHealthSnapshot } from "@/lib/data/providers";
import { cache } from "@/lib/data/providers/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RESPONSE_TTL = 3 * 60 * 1000; // 3 minutes
const CACHE_KEY = "api:tokens:full-response";

interface CachedResponse {
  candidates: Awaited<ReturnType<typeof getTokenCandidates>>;
  migrated: ReturnType<typeof getMigratedTokens>;
  stats: Awaited<ReturnType<typeof getAggregateStats>>;
}

export async function GET() {
  try {
    // Return cached response if available (provider health is always fresh)
    const cached = cache.get<CachedResponse>(CACHE_KEY);
    if (cached) {
      return NextResponse.json({
        ...cached,
        providerHealth: getHealthSnapshot(),
      });
    }

    // Score all tokens (first load takes ~20-30s with 50 tokens)
    const candidates = await getTokenCandidates();
    const stats = await getAggregateStats(candidates);
    const migrated = getMigratedTokens();

    const response: CachedResponse = { candidates, migrated, stats };
    cache.set(CACHE_KEY, response, RESPONSE_TTL);

    return NextResponse.json({
      ...response,
      providerHealth: getHealthSnapshot(),
    });
  } catch (error) {
    console.error("[api/tokens] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
