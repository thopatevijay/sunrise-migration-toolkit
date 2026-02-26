import type { TokenDetail } from "@/lib/data";
import { formatUSD, formatNumber } from "@/lib/utils";

/**
 * Serialize a TokenDetail into structured text for the AI model.
 * Covers all 5 MDS signals + market data + bridge + social + wallet overlap.
 * Handles missing/zero data gracefully — flags estimated data explicitly.
 */
export function serializeTokenForAI(token: TokenDetail): string {
  const sections: string[] = [];

  // --- Identity ---
  sections.push(
    `TOKEN: ${token.name} (${token.symbol})`,
    `Origin Chain: ${token.originChain}`,
    `CoinGecko ID: ${token.id}`,
  );

  // --- MDS Score ---
  const mds = token.mds;
  sections.push(
    `\nMIGRATION DEMAND SCORE (MDS): ${mds.totalScore.toFixed(1)} / 100`,
    `Confidence: ${(mds.confidence * 100).toFixed(0)}% (${Math.round(mds.confidence * 5)}/5 signals available)`,
    `Trend: ${mds.trend}`,
  );

  // --- MDS Signal Breakdown ---
  const b = mds.breakdown;
  sections.push(
    `\nSIGNAL BREAKDOWN:`,
    `  1. Bridge Outflow (weight ${(b.bridgeOutflow.weight * 100).toFixed(0)}%): raw=${b.bridgeOutflow.raw.toFixed(1)}, normalized=${b.bridgeOutflow.normalized.toFixed(0)}/100, weighted=${b.bridgeOutflow.weighted.toFixed(1)}, trend=${b.bridgeOutflow.trend}`,
    `  2. Search Intent (weight ${(b.searchIntent.weight * 100).toFixed(0)}%): raw=${b.searchIntent.raw.toFixed(1)}, normalized=${b.searchIntent.normalized.toFixed(0)}/100, weighted=${b.searchIntent.weighted.toFixed(1)}, trend=${b.searchIntent.trend}`,
    `  3. Social Demand (weight ${(b.socialDemand.weight * 100).toFixed(0)}%): raw=${b.socialDemand.raw.toFixed(1)}, normalized=${b.socialDemand.normalized.toFixed(0)}/100, weighted=${b.socialDemand.weighted.toFixed(1)}, trend=${b.socialDemand.trend}`,
    `  4. Chain Health (weight ${(b.chainHealth.weight * 100).toFixed(0)}%): raw=${b.chainHealth.raw.toFixed(1)}, normalized=${b.chainHealth.normalized.toFixed(0)}/100, weighted=${b.chainHealth.weighted.toFixed(1)}, trend=${b.chainHealth.trend}`,
    `  5. Wallet Overlap (weight ${(b.walletOverlap.weight * 100).toFixed(0)}%): raw=${b.walletOverlap.raw.toFixed(1)}, normalized=${b.walletOverlap.normalized.toFixed(0)}/100, weighted=${b.walletOverlap.weighted.toFixed(1)}, trend=${b.walletOverlap.trend}`,
  );

  // --- Market Data ---
  if (token.hasMarketData) {
    sections.push(
      `\nMARKET DATA:`,
      `  Price: $${token.price.toFixed(token.price < 1 ? 6 : 2)}`,
      `  Market Cap: ${formatUSD(token.marketCap)}`,
      `  24h Volume: ${formatUSD(token.volume24h)}`,
      `  TVL: ${token.tvl > 0 ? formatUSD(token.tvl) : "N/A"}`,
      `  Holders: ${token.holders > 0 ? formatNumber(token.holders) : "N/A"}${token.holdersExact ? " (on-chain verified)" : " (estimated)"}`,
      `  7d Change: ${token.change7d >= 0 ? "+" : ""}${token.change7d.toFixed(2)}%`,
      `  30d Change: ${token.change30d >= 0 ? "+" : ""}${token.change30d.toFixed(2)}%`,
      `  ATH: $${token.ath.toFixed(2)} (${token.athDate})`,
    );
  } else {
    sections.push(`\nMARKET DATA: Unavailable (API rate-limited or token not found)`);
  }

  // --- Bridge Data ---
  sections.push(
    `\nBRIDGE DATA:`,
    `  7d Bridge Volume: ${token.bridgeVolume7d > 0 ? formatUSD(token.bridgeVolume7d) : "$0"}`,
    `  Data Source: ${token.bridgeDataSource ?? "unknown"}`,
  );
  if (token.bridgeTimeseries && token.bridgeTimeseries.length > 0) {
    const recentDays = token.bridgeTimeseries.slice(-7);
    const totalTx = recentDays.reduce((sum, d) => sum + d.txCount, 0);
    sections.push(`  7d Transaction Count: ${totalTx}`);
  }

  // --- Social Data ---
  if (token.hasSocialData && token.socialData) {
    const s = token.socialData;
    sections.push(
      `\nSOCIAL DATA:`,
      `  Twitter Followers: ${s.twitterFollowers > 0 ? formatNumber(s.twitterFollowers) : "N/A"}`,
      `  Reddit Subscribers: ${s.redditSubscribers > 0 ? formatNumber(s.redditSubscribers) : "N/A"}`,
      `  Reddit Active (48h): ${s.redditActive48h > 0 ? formatNumber(s.redditActive48h) : "N/A"}`,
      `  Sentiment: ${s.sentimentUpPct.toFixed(0)}% positive`,
      `  Community Score: ${s.communityScore.toFixed(0)} / 100`,
    );
  } else {
    sections.push(`\nSOCIAL DATA: Unavailable`);
  }

  // --- Wallet Overlap ---
  if (token.walletOverlap) {
    const w = token.walletOverlap;
    sections.push(
      `\nWALLET OVERLAP:`,
      `  Overlap: ${w.overlapPercentage.toFixed(1)}% of holders have Solana wallets${w.isEstimated ? " (estimated)" : ""}`,
      `  Estimated Solana Wallets: ${formatNumber(w.solanaWallets)}`,
      `  Total Holders: ${formatNumber(w.totalHolders)}`,
      `  Active Overlap (30d): ${w.activeOverlap.toFixed(1)}%`,
    );
  }

  // --- Search Activity ---
  if (token.searchActivity) {
    const sa = token.searchActivity;
    sections.push(
      `\nDEX / SEARCH ACTIVITY:`,
      `  24h DEX Volume: ${sa.totalVolume24h > 0 ? formatUSD(sa.totalVolume24h) : "N/A"}`,
      `  DEX Liquidity: ${sa.totalLiquidity > 0 ? formatUSD(sa.totalLiquidity) : "N/A"}`,
      `  Pair Count: ${sa.pairCount}`,
      `  Solana Pairs: ${sa.solanaPairCount}`,
      `  Exists on Jupiter: ${sa.existsOnJupiter ? "Yes" : "No"}`,
      `  Boost Score: ${sa.boostScore}`,
    );
  }

  return sections.join("\n");
}
