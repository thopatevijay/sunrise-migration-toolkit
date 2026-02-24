import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const STEP_NAMES = ["Welcome", "Wallet", "Bridge", "Trade", "DeFi"];
const KNOWN_TOKENS = ["render", "hnt", "powr", "geod"];

function stepKey(token: string, step: number) {
  return `analytics:onboard:${token}:step:${step}`;
}

// GET /api/analytics/onboarding?token=render
export async function GET(request: Request) {
  if (!redis) {
    return NextResponse.json(emptyFunnel());
  }

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (token) {
      return NextResponse.json(await getFunnel(token));
    }

    // Aggregate across all known tokens
    const totals = new Array(5).fill(0);
    for (const t of KNOWN_TOKENS) {
      const pipeline = redis!.pipeline();
      for (let i = 0; i < 5; i++) pipeline.scard(stepKey(t, i));
      const counts = await pipeline.exec<number[]>();
      counts.forEach((c, i) => { totals[i] += c; });
    }

    const base = Math.max(1, totals[0]);
    return NextResponse.json(
      STEP_NAMES.map((name, i) => ({
        step: i,
        name,
        visitors: totals[i],
        conversionRate: totals[0] === 0 ? 0 : Math.round((totals[i] / base) * 100),
      }))
    );
  } catch (e) {
    console.error("[analytics/onboarding] GET error:", e);
    return NextResponse.json(emptyFunnel());
  }
}

// POST /api/analytics/onboarding
export async function POST(request: Request) {
  if (!redis) {
    return NextResponse.json({ ok: true });
  }

  try {
    const { token, step, sessionId } = await request.json();

    if (!token || step === undefined || !sessionId) {
      return NextResponse.json(
        { error: "Missing token, step, or sessionId" },
        { status: 400 }
      );
    }

    await redis.sadd(stepKey(token, step), sessionId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[analytics/onboarding] POST error:", e);
    return NextResponse.json({ ok: true });
  }
}

async function getFunnel(token: string) {
  const pipeline = redis!.pipeline();
  for (let i = 0; i < 5; i++) pipeline.scard(stepKey(token, i));
  const counts = await pipeline.exec<number[]>();

  const base = Math.max(1, counts[0]);
  return STEP_NAMES.map((name, i) => ({
    step: i,
    name,
    visitors: counts[i],
    conversionRate: counts[0] === 0 ? 0 : Math.round((counts[i] / base) * 100),
  }));
}

function emptyFunnel() {
  return STEP_NAMES.map((name, i) => ({
    step: i,
    name,
    visitors: 0,
    conversionRate: 0,
  }));
}
