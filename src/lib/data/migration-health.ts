import { fetchMarketData, fetchBridgeData } from "./providers";
import { MIGRATED_TOKENS } from "@/lib/config/tokens";
import type { MigratedToken } from "@/lib/config/tokens";

export interface MigrationHealth {
  token: MigratedToken;
  price: number;
  marketCap: number;
  volume24h: number;
  change7d: number;
  change30d: number;
  bridgeVolume7d: number;
  bridgeVolume30d: number;
  bridgeTrend: number;
  healthScore: number;
  healthStatus: "healthy" | "moderate" | "concerning";
  daysSinceMigration: number;
  priceHistory30d: { date: string; price: number }[];
}

function computeHealthScore(
  volume24h: number,
  marketCap: number,
  change7d: number,
  change30d: number,
  bridgeVolume7d: number,
  _bridgeVolume30d: number
): number {
  // Volume trend (30%): higher volume relative to market cap = healthier
  const volumeRatio = marketCap > 0 ? Math.min(1, (volume24h / marketCap) * 20) : 0;
  const volumeScore = volumeRatio * 100;

  // Market cap stability (30%): less negative change = healthier
  const stabilityScore = Math.max(0, Math.min(100, 50 + change30d * 1.5));

  // Bridge activity (20%): active bridging = community engagement
  const bridgeScore = bridgeVolume7d > 0
    ? Math.min(100, Math.log10(bridgeVolume7d + 1) * 15)
    : 0;

  // Price momentum (20%): positive short-term trend
  const momentumScore = Math.max(0, Math.min(100, 50 + change7d * 3));

  return Math.round(
    volumeScore * 0.3 +
    stabilityScore * 0.3 +
    bridgeScore * 0.2 +
    momentumScore * 0.2
  );
}

function getHealthStatus(score: number): "healthy" | "moderate" | "concerning" {
  if (score >= 70) return "healthy";
  if (score >= 40) return "moderate";
  return "concerning";
}

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.max(0, Math.round((now - then) / (1000 * 60 * 60 * 24)));
}

export async function fetchMigrationHealth(): Promise<MigrationHealth[]> {
  const results: MigrationHealth[] = [];

  for (const token of MIGRATED_TOKENS) {
    try {
      const [market, bridge] = await Promise.all([
        fetchMarketData(token.id, token.coingeckoId).catch(() => null),
        fetchBridgeData(token.id, token.symbol, undefined, undefined).catch(() => null),
      ]);

      const price = market?.price ?? 0;
      const marketCap = market?.marketCap ?? 0;
      const volume24h = market?.volume24h ?? 0;
      const change7d = market?.change7d ?? 0;
      const change30d = market?.change30d ?? 0;
      const bridgeVolume7d = bridge?.total7d ?? 0;
      const bridgeVolume30d = bridge?.total30d ?? 0;
      const bridgeTrend = bridge?.trend ?? 0;
      const priceHistory30d = market?.priceHistory30d ?? [];

      const healthScore = computeHealthScore(
        volume24h, marketCap, change7d, change30d, bridgeVolume7d, bridgeVolume30d
      );

      results.push({
        token,
        price,
        marketCap,
        volume24h,
        change7d,
        change30d,
        bridgeVolume7d,
        bridgeVolume30d,
        bridgeTrend,
        healthScore,
        healthStatus: getHealthStatus(healthScore),
        daysSinceMigration: daysSince(token.migrationDate),
        priceHistory30d,
      });
    } catch (error) {
      console.error(`[migration-health] Failed for ${token.id}:`, error);
    }
  }

  return results;
}
