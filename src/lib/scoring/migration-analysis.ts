import { CHAINS } from "@/lib/config/chains";
import type { TokenDetail } from "@/lib/data";
import type { ChainId } from "@/lib/config/tokens";
import { formatUSD } from "@/lib/utils";

export interface BridgeAlternative {
  framework: string;
  pros: string;
  cons: string;
}

export interface BridgeRecommendation {
  primary: string;
  reasoning: string;
  alternatives: BridgeAlternative[];
}

export interface LiquidityPool {
  venue: string;
  pair: string;
  allocation: string;
}

export interface LiquidityEstimate {
  minimum: number;
  recommended: number;
  pools: LiquidityPool[];
}

export interface RiskFactor {
  name: string;
  severity: "low" | "medium" | "high";
  detail: string;
}

export interface RiskAssessment {
  level: "low" | "medium" | "high";
  factors: RiskFactor[];
}

export interface MigrationAnalysis {
  bridgeRecommendation: BridgeRecommendation;
  liquidityEstimate: LiquidityEstimate;
  riskAssessment: RiskAssessment;
  competitiveLandscape: {
    similarOnSolana: string[];
    marketGap: string;
  };
  timeline: string;
}

function getBridgeRecommendation(chainId: ChainId): BridgeRecommendation {
  const chain = CHAINS[chainId];
  const hasWormhole = chain?.bridgeSupport?.wormhole ?? false;

  if (hasWormhole) {
    return {
      primary: "NTT (Wormhole Native Token Transfers)",
      reasoning: `${chain.name} has full Wormhole support. NTT is Sunrise's preferred framework — provides canonical asset representation on Solana with burn-and-mint mechanics.`,
      alternatives: [
        {
          framework: "CCIP (Chainlink)",
          pros: "Battle-tested oracle network, broad chain support",
          cons: "Higher fees, slower finality than NTT",
        },
      ],
    };
  }

  return {
    primary: "Custom Bridge via CCIP or LayerZero OFT",
    reasoning: `${chain?.name ?? chainId} lacks native Wormhole support. Recommend CCIP for security or LayerZero OFT for broader chain coverage.`,
    alternatives: [
      {
        framework: "LayerZero OFT",
        pros: "Wide chain coverage, established omnichain standard",
        cons: "Requires token team integration, not burn-and-mint",
      },
      {
        framework: "Axelar GMP",
        pros: "General message passing, growing adoption",
        cons: "Less Solana-specific tooling",
      },
    ],
  };
}

function getLiquidityEstimate(token: TokenDetail): LiquidityEstimate {
  const minimum = Math.round(token.volume24h * 0.1);
  const recommended = Math.round(token.volume24h * 0.3);

  return {
    minimum,
    recommended,
    pools: [
      {
        venue: "Jupiter",
        pair: `${token.symbol}/USDC`,
        allocation: "40%",
      },
      {
        venue: "Raydium",
        pair: `${token.symbol}/SOL`,
        allocation: "30%",
      },
      {
        venue: "Orca",
        pair: `${token.symbol}/USDC`,
        allocation: "20%",
      },
      {
        venue: "Kamino",
        pair: `${token.symbol} Lending`,
        allocation: "10%",
      },
    ],
  };
}

function getRiskAssessment(token: TokenDetail): RiskAssessment {
  const factors: RiskFactor[] = [];

  // Supply concentration
  const supplyRatio =
    token.mds.breakdown.chainHealth.raw > 0
      ? (token.marketCap / (token.price || 1)) / ((token.marketCap / (token.price || 1)) * 0.6)
      : 1;
  if (supplyRatio > 3) {
    factors.push({
      name: "Supply Concentration",
      severity: "high",
      detail: "High ratio of total to circulating supply — risk of dilution events",
    });
  }

  // Low wallet overlap
  if (token.walletOverlap.overlapPercentage < 15) {
    factors.push({
      name: "Low Solana Wallet Overlap",
      severity: "medium",
      detail: `Only ${token.walletOverlap.overlapPercentage}% of holders have active Solana wallets — migration adoption may be slow`,
    });
  }

  // Declining bridge trend
  if (token.mds.breakdown.bridgeOutflow.trend === "falling") {
    factors.push({
      name: "Declining Bridge Activity",
      severity: "medium",
      detail: "Bridge outflow volume is trending downward — demand may be cooling",
    });
  }

  // Low sentiment
  if (token.socialData.sentiment < 0) {
    factors.push({
      name: "Negative Community Sentiment",
      severity: "medium",
      detail: `Sentiment score is ${(token.socialData.sentiment * 100).toFixed(0)}% — community may be skeptical`,
    });
  }

  // Low TVL
  if (token.tvl < 10_000_000 && token.marketCap > 100_000_000) {
    factors.push({
      name: "Low TVL Relative to Market Cap",
      severity: "low",
      detail: `TVL of ${formatUSD(token.tvl)} vs ${formatUSD(token.marketCap)} market cap — limited DeFi integration`,
    });
  }

  // Positive factors
  if (factors.length === 0) {
    factors.push({
      name: "Strong Fundamentals",
      severity: "low",
      detail: "No significant risk factors identified — strong migration candidate",
    });
  }

  const highCount = factors.filter((f) => f.severity === "high").length;
  const mediumCount = factors.filter((f) => f.severity === "medium").length;
  const level: "low" | "medium" | "high" =
    highCount > 0 ? "high" : mediumCount >= 2 ? "medium" : "low";

  return { level, factors };
}

function getCompetitiveLandscape(token: TokenDetail): {
  similarOnSolana: string[];
  marketGap: string;
} {
  const categoryMap: Record<string, { existing: string[]; gap: string }> = {
    defi: {
      existing: ["JUP", "RAY", "ORCA", "MNDE", "BONK"],
      gap: `${token.symbol} would bring ${token.name}'s unique protocol mechanics to Solana's DeFi ecosystem`,
    },
    rwa: {
      existing: ["ONDO (planned)", "MAPLE"],
      gap: `RWA sector on Solana is underdeveloped — ${token.symbol} would be a category leader`,
    },
    l2: {
      existing: ["None directly comparable"],
      gap: `L2 tokens on Solana are rare — ${token.symbol} would bridge Ethereum L2 communities to Solana`,
    },
    infra: {
      existing: ["PYTH", "HNT", "MOBILE"],
      gap: `${token.symbol} fills an infrastructure gap with its unique ${token.name} approach`,
    },
    gaming: {
      existing: ["ATLAS", "STEP", "GMT"],
      gap: `Gaming sector on Solana needs fresh content — ${token.symbol} brings an established community`,
    },
    ai: {
      existing: ["RENDER", "TAO (planned)"],
      gap: `AI tokens on Solana are high-demand — ${token.symbol} would capture this growing narrative`,
    },
    meme: {
      existing: ["BONK", "WIF", "POPCAT"],
      gap: `Meme sector is saturated but ${token.symbol}'s community could bring new users to Solana`,
    },
  };

  const landscape = categoryMap[token.category] ?? categoryMap.defi;
  return {
    similarOnSolana: landscape.existing,
    marketGap: landscape.gap,
  };
}

export function generateMigrationAnalysis(token: TokenDetail): MigrationAnalysis {
  const bridge = getBridgeRecommendation(token.originChain);
  const liquidity = getLiquidityEstimate(token);
  const risk = getRiskAssessment(token);
  const competitive = getCompetitiveLandscape(token);

  const timeline =
    risk.level === "low"
      ? "2-3 weeks (fast track — low risk, strong demand)"
      : risk.level === "medium"
        ? "4-6 weeks (standard — moderate risk factors to address)"
        : "6-8 weeks (careful evaluation needed — high risk factors)";

  return {
    bridgeRecommendation: bridge,
    liquidityEstimate: liquidity,
    riskAssessment: risk,
    competitiveLandscape: competitive,
    timeline,
  };
}
