import { NextResponse } from "next/server";
import { fetchNoSolanaTokens } from "@/lib/data/discovery-no-solana";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const tokens = await fetchNoSolanaTokens();
    return NextResponse.json({
      tokens,
      totalFound: tokens.length,
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[api/discovery/no-solana] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch discovery tokens" },
      { status: 500 }
    );
  }
}
