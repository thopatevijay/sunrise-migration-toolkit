import { NextResponse } from "next/server";
import { getTokenCandidates, getMigratedTokens, getAggregateStats } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [candidates, stats] = await Promise.all([
      getTokenCandidates(),
      getAggregateStats(),
    ]);
    const migrated = getMigratedTokens();

    return NextResponse.json({
      candidates,
      migrated,
      stats,
    });
  } catch (error) {
    console.error("[api/tokens] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
