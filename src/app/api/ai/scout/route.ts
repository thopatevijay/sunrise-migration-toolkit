import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { getTokenCandidates, getTokenDetail } from "@/lib/data";
import { serializeTokenForAI } from "@/lib/ai/serialize";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SCOUT_SYSTEM_PROMPT = `You are Migration Scout, an autonomous AI agent within Tideshift — Solana's migration intelligence platform.

You have been given detailed signal data for the top migration candidates. Your job is to produce a Migration Brief — a concise, actionable report that the Sunrise BD team can use to prioritize outreach this week.

Structure your response with these sections:

## Executive Summary
2-3 sentences: overall migration pipeline health, how many strong candidates exist, and the single most important finding.

## Top 5 Recommendations
Ranked list. For each token include:
- Token name and MDS score
- One-line verdict (why it's ranked here)
- Strongest signal and one key number

## Surging Demand
Tokens with rising trends or unusually strong individual signals that may not be in the top 5 overall but show emerging opportunity.

## Risk Flags
Tokens that look strong on paper but have concerning signals (supply concentration, declining bridge activity, low wallet overlap, negative sentiment).

## This Week's Priority
One concrete recommendation: which single token should Sunrise reach out to first, and why. Include the suggested approach (NTT, CCIP, or community-first).

Guidelines:
- Be direct and data-driven. Every claim must reference a specific number from the data.
- Use plain language — this is for business development, not engineers.
- Keep the total response under 800 words.
- Do not use bullet points excessively — prefer concise paragraphs within each section.`;

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI features unavailable — OPENAI_API_KEY not configured" },
      { status: 503 }
    );
  }

  // Get top candidates by MDS score
  const candidates = await getTokenCandidates();
  const top10 = candidates.slice(0, 10);

  if (top10.length === 0) {
    return NextResponse.json(
      { error: "No token candidates available" },
      { status: 404 }
    );
  }

  // Fetch detailed data for each candidate
  const detailResults = await Promise.allSettled(
    top10.map((t) => getTokenDetail(t.id))
  );

  const serializedTokens = detailResults
    .map((r, i) => {
      if (r.status === "fulfilled" && r.value) {
        return `--- TOKEN ${i + 1} ---\n${serializeTokenForAI(r.value)}`;
      }
      return `--- TOKEN ${i + 1} ---\n${top10[i].symbol}: Detail data unavailable (MDS: ${top10[i].mds.totalScore.toFixed(1)})`;
    })
    .join("\n\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    temperature: 0.4,
    maxOutputTokens: 2000,
    system: SCOUT_SYSTEM_PROMPT,
    prompt: `Analyze these ${top10.length} migration candidates and produce a Migration Brief:\n\n${serializedTokens}`,
  });

  return result.toTextStreamResponse();
}
