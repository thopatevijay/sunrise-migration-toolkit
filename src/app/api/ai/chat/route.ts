import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getTokenDetail, getTokenCandidates } from "@/lib/data";
import { serializeTokenForAI } from "@/lib/ai/serialize";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI features unavailable — OPENAI_API_KEY not configured" },
      { status: 503 }
    );
  }

  let body: { messages?: unknown; tokenId?: string; tokenData?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages, tokenId, tokenData } = body;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "messages array is required" }, { status: 400 });
  }

  // Build system prompt — include pre-serialized token data when available
  let systemPrompt = CHAT_SYSTEM_PROMPT;
  if (tokenId && tokenData) {
    systemPrompt += `\n\nThe user is currently viewing token: "${tokenId}". When they say "this token" or "it", they mean "${tokenId}".\n\nYou already have this token's full data — use it directly to answer questions. Do NOT call getTokenData for "${tokenId}":\n\n${tokenData}`;
  } else if (tokenId) {
    systemPrompt += `\n\nThe user is currently viewing token: "${tokenId}". When they say "this token" or "it", they mean "${tokenId}".`;
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    temperature: 0.4,
    maxOutputTokens: 1000,
    stopWhen: stepCountIs(3),
    system: systemPrompt,
    messages: modelMessages,
    tools: {
      getTokenData: tool({
        description:
          "Fetch detailed migration data for a token including MDS score, market data, bridge activity, social metrics, and wallet overlap.",
        inputSchema: z.object({
          tokenId: z
            .string()
            .describe("The CoinGecko token ID (e.g., 'ondo', 'sui', 'bera')"),
        }),
        execute: async ({ tokenId: tid }) => {
          const token = await getTokenDetail(tid);
          if (!token) return { error: `Token '${tid}' not found` };
          return { data: serializeTokenForAI(token) };
        },
      }),
      compareTokens: tool({
        description:
          "Compare two tokens side-by-side on their migration demand signals, market data, and MDS scores.",
        inputSchema: z.object({
          tokenIdA: z.string().describe("First token CoinGecko ID"),
          tokenIdB: z.string().describe("Second token CoinGecko ID"),
        }),
        execute: async ({ tokenIdA, tokenIdB }) => {
          const [a, b] = await Promise.all([
            getTokenDetail(tokenIdA),
            getTokenDetail(tokenIdB),
          ]);
          if (!a) return { error: `Token '${tokenIdA}' not found` };
          if (!b) return { error: `Token '${tokenIdB}' not found` };
          return {
            tokenA: serializeTokenForAI(a),
            tokenB: serializeTokenForAI(b),
          };
        },
      }),
      explainSignal: tool({
        description:
          "Deep-dive into a specific MDS signal for a token. Useful when the user asks 'why is the bridge score low?' or 'explain the social demand'.",
        inputSchema: z.object({
          tokenId: z.string().describe("The CoinGecko token ID"),
          signal: z
            .enum([
              "bridgeOutflow",
              "searchIntent",
              "socialDemand",
              "chainHealth",
              "walletOverlap",
            ])
            .describe("Which MDS signal to explain"),
        }),
        execute: async ({ tokenId: tid, signal }) => {
          const token = await getTokenDetail(tid);
          if (!token) return { error: `Token '${tid}' not found` };
          const s = token.mds.breakdown[signal];
          const details: Record<string, unknown> = {
            signal,
            raw: s.raw,
            normalized: s.normalized,
            weighted: s.weighted,
            weight: s.weight,
            trend: s.trend,
          };

          if (signal === "bridgeOutflow") {
            details.bridgeVolume7d = token.bridgeVolume7d;
            details.bridgeDataSource = token.bridgeDataSource;
          } else if (signal === "searchIntent" && token.searchActivity) {
            details.dexVolume24h = token.searchActivity.totalVolume24h;
            details.dexLiquidity = token.searchActivity.totalLiquidity;
            details.pairCount = token.searchActivity.pairCount;
            details.existsOnJupiter = token.searchActivity.existsOnJupiter;
          } else if (signal === "socialDemand" && token.socialData) {
            details.twitterFollowers = token.socialData.twitterFollowers;
            details.redditSubscribers = token.socialData.redditSubscribers;
            details.sentiment = token.socialData.sentimentUpPct;
            details.communityScore = token.socialData.communityScore;
          } else if (signal === "chainHealth") {
            details.marketCap = token.marketCap;
            details.volume24h = token.volume24h;
            details.tvl = token.tvl;
            details.holders = token.holders;
          } else if (signal === "walletOverlap" && token.walletOverlap) {
            details.overlapPercentage = token.walletOverlap.overlapPercentage;
            details.solanaWallets = token.walletOverlap.solanaWallets;
            details.isEstimated = token.walletOverlap.isEstimated;
          }

          return details;
        },
      }),
      getTopCandidates: tool({
        description:
          "Fetch the top migration candidates ranked by MDS score. Use this when the user asks about prioritization, top tokens, or pipeline-level questions like 'which tokens should Sunrise migrate?'",
        inputSchema: z.object({
          limit: z
            .number()
            .min(1)
            .max(10)
            .default(5)
            .describe("Number of top candidates to return (default 5, max 10)"),
        }),
        execute: async ({ limit }) => {
          const candidates = await getTokenCandidates();
          const top = candidates.slice(0, limit);
          return {
            count: candidates.length,
            candidates: top.map((t) => ({
              id: t.id,
              symbol: t.symbol,
              name: t.name,
              originChain: t.originChain,
              mdsScore: t.mds.totalScore.toFixed(1),
              trend: t.mds.trend,
              confidence: `${(t.mds.confidence * 100).toFixed(0)}%`,
              marketCap: t.marketCap,
              volume24h: t.volume24h,
              bridgeVolume7d: t.bridgeVolume7d,
            })),
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
