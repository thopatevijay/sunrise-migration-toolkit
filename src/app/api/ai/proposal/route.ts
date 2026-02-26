import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { getTokenDetail } from "@/lib/data";
import { serializeTokenForAI } from "@/lib/ai/serialize";
import { getSystemPrompt, type Tone } from "@/lib/ai/prompts";

export const dynamic = "force-dynamic";

const VALID_TONES: Tone[] = ["executive", "technical", "community"];

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI features unavailable — OPENAI_API_KEY not configured" },
      { status: 503 }
    );
  }

  let body: { tokenId?: string; tone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { tokenId, tone: rawTone } = body;

  if (!tokenId || typeof tokenId !== "string") {
    return NextResponse.json({ error: "tokenId is required" }, { status: 400 });
  }

  const tone = (rawTone as Tone) || "executive";
  if (!VALID_TONES.includes(tone)) {
    return NextResponse.json(
      { error: `tone must be one of: ${VALID_TONES.join(", ")}` },
      { status: 400 }
    );
  }

  const token = await getTokenDetail(tokenId);
  if (!token) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  const serialized = serializeTokenForAI(token);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    temperature: 0.3,
    maxOutputTokens: 2000,
    system: getSystemPrompt(tone),
    messages: [
      {
        role: "user",
        content: `Analyze the following token for Solana migration potential:\n\n${serialized}`,
      },
    ],
  });

  return result.toTextStreamResponse();
}
