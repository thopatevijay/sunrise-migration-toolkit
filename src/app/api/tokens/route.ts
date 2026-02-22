import { NextResponse } from "next/server";
import { getTokenCandidates, getMigratedTokens, getAggregateStats } from "@/lib/data";

export async function GET() {
  const candidates = getTokenCandidates();
  const migrated = getMigratedTokens();
  const stats = getAggregateStats();

  return NextResponse.json({
    candidates,
    migrated,
    stats,
  });
}
