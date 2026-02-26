import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { formatUSD } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ScoutToken {
  rank: number;
  symbol: string;
  name: string;
  marketCap: number;
  volume24h: number;
  change7d: number;
  originChains: string[];
  solanaStatus: string;
}

function serializeDiscoveryToken(t: ScoutToken): string {
  return [
    `#${t.rank} ${t.name} (${t.symbol})`,
    `Market Cap: ${formatUSD(t.marketCap)} | 24h Vol: ${formatUSD(t.volume24h)} | 7d: ${t.change7d >= 0 ? "+" : ""}${t.change7d.toFixed(1)}%`,
    `Chains: ${t.originChains.join(", ")} | Solana: ${t.solanaStatus === "wrapped" ? "Bridged only" : "Not present"}`,
  ].join("\n");
}

const SCOUT_SYSTEM_PROMPT = `You are Migration Scout, an autonomous AI agent within Tideshift — Solana's migration intelligence platform.

You have been given market data for migration candidates — tokens that lack a native Solana presence. Your job is to produce a Migration Brief — a concise, actionable report that the Sunrise BD team can use to prioritize outreach this week.

Structure your response with these sections:

## Executive Summary
2-3 sentences: overall migration pipeline health, how many strong candidates exist, and the single most important finding.

## Top 5 Recommendations
Ranked list. For each token include:
- Token name and key metrics
- One-line verdict (why it's a strong migration candidate)
- Which chain it comes from and whether bridged tokens already exist

## Surging Demand
Tokens with strong 7d momentum or unusually high volume-to-market-cap ratios that signal emerging opportunity.

## Risk Flags
Tokens that look strong on paper but have concerning signals (low volume, negative 7d trend, very small market cap relative to peers).

## This Week's Priority
One concrete recommendation: which single token should Sunrise reach out to first, and why. Include the suggested approach (NTT for Wormhole-supported chains, CCIP/OFT for others, or community-first).

Guidelines:
- Be direct and data-driven. Every claim must reference a specific number from the data.
- Use plain language — this is for business development, not engineers.
- Keep the total response under 800 words.
- Do not use bullet points excessively — prefer concise paragraphs within each section.`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI features unavailable — OPENAI_API_KEY not configured" },
      { status: 503 }
    );
  }

  let body: { tokens?: ScoutToken[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tokens = body.tokens;
  if (!tokens || tokens.length === 0) {
    return NextResponse.json({ error: "tokens array is required" }, { status: 400 });
  }

  const top = tokens.slice(0, 15);
  const serialized = top
    .map((t, i) => `--- TOKEN ${i + 1} ---\n${serializeDiscoveryToken(t)}`)
    .join("\n\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    temperature: 0.4,
    maxOutputTokens: 2000,
    system: SCOUT_SYSTEM_PROMPT,
    prompt: `Analyze these ${top.length} migration candidates and produce a Migration Brief:\n\n${serialized}`,
  });

  return result.toTextStreamResponse();
}
