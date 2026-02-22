import { cache, TTL } from "./cache";
import type { TokenWalletOverlap } from "@/lib/data/demo/wallet-overlap";
import type { TokenMarketData } from "@/lib/data/demo/market-data";
import type { TokenBridgeData } from "@/lib/data/demo/bridge-volumes";
import type { ChainId, TokenCategory } from "@/lib/config/tokens";

// Chain proximity scores: how much overlap between chain's users and Solana
const CHAIN_PROXIMITY: Record<string, number> = {
  ethereum: 15,
  arbitrum: 18,
  base: 14,
  optimism: 16,
  polygon: 10,
  avalanche: 8,
  bsc: 6,
  hyperliquid: 12,
  monad: 10,
};

// Category affinity: how likely this token category's users are to be on Solana
const CATEGORY_AFFINITY: Record<string, number> = {
  defi: 8,
  infra: 7,
  l2: 6,
  rwa: 5,
  meme: 9,
  gaming: 4,
  ai: 6,
};

export function estimateWalletOverlap(
  tokenId: string,
  originChain: ChainId,
  category: TokenCategory,
  marketData: TokenMarketData | null,
  bridgeData: TokenBridgeData | null
): TokenWalletOverlap | null {
  const cacheKey = `wallet:${tokenId}`;
  const cached = cache.get<TokenWalletOverlap>(cacheKey);
  if (cached) return cached;

  if (!marketData) return null;

  // Bridge ratio: how much of the volume is being bridged
  const bridgeRatio = bridgeData && marketData.volume24h > 0
    ? Math.min(0.25, bridgeData.total30d / (marketData.volume24h * 30))
    : 0.05;

  // Chain proximity: some chains' users overlap more with Solana
  const chainScore = CHAIN_PROXIMITY[originChain] ?? 8;

  // Category affinity
  const categoryScore = CATEGORY_AFFINITY[category] ?? 5;

  // Market cap tier bonus
  const mcap = marketData.marketCap;
  const tierBonus = mcap > 5_000_000_000 ? 5
    : mcap > 1_000_000_000 ? 4
    : mcap > 500_000_000 ? 3
    : mcap > 100_000_000 ? 2
    : 1;

  // Compute overlap percentage (capped at 50%)
  const overlapPercentage = Math.min(
    50,
    Math.round((bridgeRatio * 100 + chainScore + categoryScore + tierBonus) * 10) / 10
  );

  const totalHolders = marketData.holders;
  const solanaWallets = Math.round(totalHolders * (overlapPercentage / 100));

  // Active overlap: higher bridge trend = more active
  const bridgeTrend = bridgeData?.trend ?? 0;
  const activeOverlap = Math.round(
    Math.min(80, Math.max(30, 45 + (bridgeTrend / 100) * 35)) * 10
  ) / 10;

  // Category distribution based on token type
  const topWalletCategories = getCategoryDistribution(category);

  const result: TokenWalletOverlap = {
    tokenId,
    overlapPercentage,
    solanaWallets,
    totalHolders,
    activeOverlap,
    topWalletCategories,
  };

  cache.set(cacheKey, result, TTL.WALLET_DATA);
  return result;
}

function getCategoryDistribution(
  category: TokenCategory
): { category: string; percentage: number }[] {
  switch (category) {
    case "defi":
      return [
        { category: "DeFi Power Users", percentage: 48 },
        { category: "Traders", percentage: 25 },
        { category: "Holders", percentage: 18 },
        { category: "NFT Collectors", percentage: 9 },
      ];
    case "l2":
      return [
        { category: "Traders", percentage: 35 },
        { category: "DeFi Power Users", percentage: 30 },
        { category: "NFT Collectors", percentage: 20 },
        { category: "Holders", percentage: 15 },
      ];
    case "rwa":
      return [
        { category: "DeFi Power Users", percentage: 42 },
        { category: "Holders", percentage: 28 },
        { category: "Traders", percentage: 22 },
        { category: "NFT Collectors", percentage: 8 },
      ];
    case "infra":
      return [
        { category: "DeFi Power Users", percentage: 45 },
        { category: "Holders", percentage: 25 },
        { category: "Traders", percentage: 20 },
        { category: "NFT Collectors", percentage: 10 },
      ];
    default:
      return [
        { category: "Traders", percentage: 35 },
        { category: "DeFi Power Users", percentage: 30 },
        { category: "Holders", percentage: 20 },
        { category: "NFT Collectors", percentage: 15 },
      ];
  }
}
