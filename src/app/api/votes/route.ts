import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const VOTES_KEY = "votes:counts";
const userVotesKey = (userId: string) => `votes:user:${userId}`;

// GET /api/votes — return all vote counts
export async function GET() {
  if (!redis) {
    return NextResponse.json({}, { status: 200 });
  }

  try {
    const counts = await redis.hgetall(VOTES_KEY);
    return NextResponse.json(counts ?? {});
  } catch (e) {
    console.error("[votes] GET error:", e);
    return NextResponse.json({}, { status: 200 });
  }
}

// POST /api/votes — toggle a vote for a user
export async function POST(request: Request) {
  if (!redis) {
    return NextResponse.json(
      { error: "Voting backend not configured" },
      { status: 503 }
    );
  }

  try {
    const { coingeckoId, userId } = await request.json();

    if (!coingeckoId || !userId) {
      return NextResponse.json(
        { error: "Missing coingeckoId or userId" },
        { status: 400 }
      );
    }

    const userKey = userVotesKey(userId);
    const alreadyVoted = await redis.sismember(userKey, coingeckoId);

    const pipeline = redis.pipeline();

    if (alreadyVoted) {
      pipeline.srem(userKey, coingeckoId);
      pipeline.hincrby(VOTES_KEY, coingeckoId, -1);
    } else {
      pipeline.sadd(userKey, coingeckoId);
      pipeline.hincrby(VOTES_KEY, coingeckoId, 1);
    }

    await pipeline.exec();

    const count = (await redis.hget<number>(VOTES_KEY, coingeckoId)) ?? 0;

    return NextResponse.json({
      count: Math.max(0, count),
      voted: !alreadyVoted,
    });
  } catch (e) {
    console.error("[votes] POST error:", e);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}

// GET /api/votes?userId=xxx — return user's voted set
// We extend the GET to support userId param for fetching user-specific votes
