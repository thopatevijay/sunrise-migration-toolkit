import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

// GET /api/votes/user?userId=xxx — return set of coingeckoIds the user has voted for
export async function GET(request: Request) {
  if (!redis) {
    return NextResponse.json({ votes: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ votes: [] });
    }

    const votes = await redis.smembers(`votes:user:${userId}`);
    return NextResponse.json({ votes: votes ?? [] });
  } catch (e) {
    console.error("[votes/user] GET error:", e);
    return NextResponse.json({ votes: [] });
  }
}
