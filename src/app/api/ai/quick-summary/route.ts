import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { getTokenDetail } from "@/lib/data";
import { serializeTokenForAI } from "@/lib/ai/serialize";
import { cache } from "@/lib/data/providers/cache";

export const dynamic = "force-dynamic";

const SUMMARY_TTL = 10 * 60 * 1000; // 10 minutes

const SYSTEM_PROMPT = `You are Tideshift, a Solana migration intelligence assistant.
Produce a 2-3 sentence assessment of this token's migration potential to Solana.
Focus on: the strongest demand signal, the biggest risk, and a verdict (strong/moderate/weak candidate).
Cite one key number from the data. No markdown formatting. Plain text only.`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI features unavailable — OPENAI_API_KEY not configured" },
      { status: 503 }
    );
  }

  let body: { coingeckoId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { coingeckoId } = body;
  if (!coingeckoId) {
    return NextResponse.json({ error: "coingeckoId is required" }, { status: 400 });
  }

  // Check cache first
  const cacheKey = `ai-summary:${coingeckoId}`;
  const cached = cache.get<string>(cacheKey);
  if (cached) {
    return NextResponse.json({ summary: cached });
  }

  const token = await getTokenDetail(coingeckoId);
  if (!token) {
    return NextResponse.json({ error: `Token '${coingeckoId}' not found` }, { status: 404 });
  }

  const serialized = serializeTokenForAI(token);

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    temperature: 0.3,
    maxOutputTokens: 150,
    system: SYSTEM_PROMPT,
    prompt: serialized,
  });

  // Cache the result
  cache.set(cacheKey, text, SUMMARY_TTL);

  return NextResponse.json({ summary: text });
}
