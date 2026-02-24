export interface WalletOption {
  name: string;
  icon: string;
  url: string;
  description: string;
}

export interface BridgeOption {
  name: string;
  url: string;
  estimatedTime: string;
  fee: string;
  recommended?: boolean;
}

export interface TradingVenue {
  name: string;
  url: string;
  type: "dex" | "aggregator";
  description: string;
}

export interface DeFiOpportunity {
  protocol: string;
  type: "lending" | "lp" | "staking" | "vault";
  apy: string;
  url: string;
  description: string;
  risk: "low" | "medium" | "high";
}

export interface OnboardingConfig {
  slug: string;
  symbol: string;
  name: string;
  tagline: string;
  originChain: string;
  originChainName: string;
  migrationDate: string;
  colors: {
    primary: string;
    gradient: string;
    accentBg: string;
  };
  whySolana: string[];
  wallets: WalletOption[];
  bridges: BridgeOption[];
  tradingVenues: TradingVenue[];
  defiOpportunities: DeFiOpportunity[];
  communityLinks: { label: string; url: string }[];
}

const COMMON_WALLETS: WalletOption[] = [
  {
    name: "Phantom",
    icon: "👻",
    url: "https://phantom.app",
    description: "Most popular Solana wallet — mobile + browser extension",
  },
  {
    name: "Backpack",
    icon: "🎒",
    url: "https://backpack.app",
    description: "Built for xNFTs and multi-chain — clean, modern UI",
  },
  {
    name: "Solflare",
    icon: "☀️",
    url: "https://solflare.com",
    description: "Solana-native wallet with staking and DeFi integrations",
  },
];

export const ONBOARDING_CONFIGS: Record<string, OnboardingConfig> = {
  hype: {
    slug: "hype",
    symbol: "HYPE",
    name: "Hyperliquid",
    tagline: "HYPE is now live on Solana via Sunrise",
    originChain: "hyperliquid",
    originChainName: "Hyperliquid L1",
    migrationDate: "January 15, 2026",
    colors: {
      primary: "from-emerald-500 to-cyan-500",
      gradient: "from-emerald-950/30 via-background to-cyan-950/20",
      accentBg: "bg-emerald-500/10",
    },
    whySolana: [
      "Access deep Solana DeFi liquidity across Jupiter, Kamino, and MarginFi",
      "Sub-second finality and ~$0.001 transaction fees",
      "Tap into Solana's 15M+ active wallets and growing ecosystem",
      "Seamless bridging via Sunrise NTT with day-one liquidity",
    ],
    wallets: COMMON_WALLETS,
    bridges: [
      {
        name: "Sunrise NTT",
        url: "https://sunrisedefi.com/bridge/hype",
        estimatedTime: "~2 minutes",
        fee: "0.1%",
        recommended: true,
      },
      {
        name: "deBridge",
        url: "https://app.debridge.finance",
        estimatedTime: "~5 minutes",
        fee: "0.04%",
      },
      {
        name: "Wormhole",
        url: "https://wormhole.com/bridge",
        estimatedTime: "~15 minutes",
        fee: "Free (gas only)",
      },
    ],
    tradingVenues: [
      {
        name: "Jupiter",
        url: "https://jup.ag/swap/SOL-HYPE",
        type: "aggregator",
        description: "Best price across all Solana DEXs",
      },
      {
        name: "Raydium",
        url: "https://raydium.io/swap/?inputMint=sol&outputMint=HYPE",
        type: "dex",
        description: "Concentrated liquidity AMM",
      },
    ],
    defiOpportunities: [
      {
        protocol: "Kamino Finance",
        type: "lending",
        apy: "8.2%",
        url: "https://app.kamino.finance",
        description: "Supply HYPE to earn lending yield",
        risk: "low",
      },
      {
        protocol: "Raydium",
        type: "lp",
        apy: "24.5%",
        url: "https://raydium.io/liquidity",
        description: "HYPE-SOL concentrated liquidity pool",
        risk: "medium",
      },
      {
        protocol: "MarginFi",
        type: "lending",
        apy: "6.8%",
        url: "https://app.marginfi.com",
        description: "Lend HYPE on MarginFi for passive yield",
        risk: "low",
      },
      {
        protocol: "Sanctum",
        type: "staking",
        apy: "12.1%",
        url: "https://sanctum.so",
        description: "Stake HYPE in the Sanctum validator pool",
        risk: "low",
      },
    ],
    communityLinks: [
      { label: "Twitter", url: "https://twitter.com/HyperliquidX" },
      { label: "Discord", url: "https://discord.gg/hyperliquid" },
      { label: "Docs", url: "https://docs.hyperliquid.xyz" },
    ],
  },
  mon: {
    slug: "mon",
    symbol: "MON",
    name: "Monad",
    tagline: "MON is now live on Solana via Sunrise",
    originChain: "monad",
    originChainName: "Monad L1",
    migrationDate: "February 1, 2026",
    colors: {
      primary: "from-violet-500 to-fuchsia-500",
      gradient: "from-violet-950/30 via-background to-fuchsia-950/20",
      accentBg: "bg-violet-500/10",
    },
    whySolana: [
      "Bring MON liquidity to Solana's $8B+ DeFi ecosystem",
      "Ultra-fast swaps on Jupiter — best price aggregation on any chain",
      "Earn yield on day one via Kamino, MarginFi, and other protocols",
      "Sunrise NTT ensures seamless cross-chain token standard",
    ],
    wallets: COMMON_WALLETS,
    bridges: [
      {
        name: "Sunrise NTT",
        url: "https://sunrisedefi.com/bridge/mon",
        estimatedTime: "~2 minutes",
        fee: "0.1%",
        recommended: true,
      },
      {
        name: "Wormhole",
        url: "https://wormhole.com/bridge",
        estimatedTime: "~15 minutes",
        fee: "Free (gas only)",
      },
    ],
    tradingVenues: [
      {
        name: "Jupiter",
        url: "https://jup.ag/swap/SOL-MON",
        type: "aggregator",
        description: "Best price across all Solana DEXs",
      },
      {
        name: "Orca",
        url: "https://orca.so",
        type: "dex",
        description: "User-friendly DEX with concentrated liquidity",
      },
    ],
    defiOpportunities: [
      {
        protocol: "Kamino Finance",
        type: "lending",
        apy: "7.4%",
        url: "https://app.kamino.finance",
        description: "Supply MON to earn lending yield",
        risk: "low",
      },
      {
        protocol: "Orca",
        type: "lp",
        apy: "18.9%",
        url: "https://orca.so/pools",
        description: "MON-USDC concentrated liquidity pool",
        risk: "medium",
      },
      {
        protocol: "MarginFi",
        type: "lending",
        apy: "5.9%",
        url: "https://app.marginfi.com",
        description: "Lend MON for passive yield on MarginFi",
        risk: "low",
      },
    ],
    communityLinks: [
      { label: "Twitter", url: "https://twitter.com/monad_xyz" },
      { label: "Discord", url: "https://discord.gg/monad" },
      { label: "Docs", url: "https://docs.monad.xyz" },
    ],
  },
  lit: {
    slug: "lit",
    symbol: "LIT",
    name: "Lighter",
    tagline: "LIT is now live on Solana via Sunrise",
    originChain: "ethereum",
    originChainName: "Ethereum",
    migrationDate: "January 28, 2026",
    colors: {
      primary: "from-orange-500 to-amber-500",
      gradient: "from-orange-950/30 via-background to-amber-950/20",
      accentBg: "bg-orange-500/10",
    },
    whySolana: [
      "Bring Lighter's on-chain order book to Solana's high-throughput infrastructure",
      "Access sub-second finality for limit orders and real-time trading",
      "Tap into Solana's growing DeFi ecosystem with Jupiter, Raydium, and Orca",
      "Sunrise NTT ensures canonical token representation across chains",
    ],
    wallets: COMMON_WALLETS,
    bridges: [
      {
        name: "Sunrise NTT",
        url: "https://sunrisedefi.com/bridge/lit",
        estimatedTime: "~2 minutes",
        fee: "0.1%",
        recommended: true,
      },
      {
        name: "Wormhole",
        url: "https://wormhole.com/bridge",
        estimatedTime: "~15 minutes",
        fee: "Free (gas only)",
      },
      {
        name: "deBridge",
        url: "https://app.debridge.finance",
        estimatedTime: "~5 minutes",
        fee: "0.04%",
      },
    ],
    tradingVenues: [
      {
        name: "Jupiter",
        url: "https://jup.ag/swap/SOL-LIT",
        type: "aggregator",
        description: "Best price across all Solana DEXs",
      },
      {
        name: "Raydium",
        url: "https://raydium.io/swap/?inputMint=sol&outputMint=LIT",
        type: "dex",
        description: "Concentrated liquidity AMM with deep SOL pairs",
      },
    ],
    defiOpportunities: [
      {
        protocol: "Kamino Finance",
        type: "lending",
        apy: "6.5%",
        url: "https://app.kamino.finance",
        description: "Supply LIT to earn lending yield",
        risk: "low",
      },
      {
        protocol: "Raydium",
        type: "lp",
        apy: "21.3%",
        url: "https://raydium.io/liquidity",
        description: "LIT-USDC concentrated liquidity pool",
        risk: "medium",
      },
      {
        protocol: "MarginFi",
        type: "lending",
        apy: "5.2%",
        url: "https://app.marginfi.com",
        description: "Lend LIT on MarginFi for passive yield",
        risk: "low",
      },
    ],
    communityLinks: [
      { label: "Twitter", url: "https://twitter.com/lighter_xyz" },
      { label: "Discord", url: "https://discord.gg/lighter" },
      { label: "Docs", url: "https://docs.lighter.xyz" },
    ],
  },
  inx: {
    slug: "inx",
    symbol: "INX",
    name: "Infinex",
    tagline: "INX is now live on Solana via Sunrise",
    originChain: "ethereum",
    originChainName: "Ethereum",
    migrationDate: "February 10, 2026",
    colors: {
      primary: "from-blue-500 to-indigo-500",
      gradient: "from-blue-950/30 via-background to-indigo-950/20",
      accentBg: "bg-blue-500/10",
    },
    whySolana: [
      "Unify DeFi access through Infinex on Solana's fastest execution layer",
      "Aggregate protocols across chains with Solana as the settlement hub",
      "Near-zero gas fees make frequent DeFi interactions economically viable",
      "Sunrise NTT provides seamless cross-chain token bridging",
    ],
    wallets: COMMON_WALLETS,
    bridges: [
      {
        name: "Sunrise NTT",
        url: "https://sunrisedefi.com/bridge/inx",
        estimatedTime: "~2 minutes",
        fee: "0.1%",
        recommended: true,
      },
      {
        name: "Wormhole",
        url: "https://wormhole.com/bridge",
        estimatedTime: "~15 minutes",
        fee: "Free (gas only)",
      },
    ],
    tradingVenues: [
      {
        name: "Jupiter",
        url: "https://jup.ag/swap/SOL-INX",
        type: "aggregator",
        description: "Best price across all Solana DEXs",
      },
      {
        name: "Orca",
        url: "https://orca.so",
        type: "dex",
        description: "User-friendly DEX with concentrated liquidity",
      },
    ],
    defiOpportunities: [
      {
        protocol: "Kamino Finance",
        type: "lending",
        apy: "5.8%",
        url: "https://app.kamino.finance",
        description: "Supply INX to earn lending yield",
        risk: "low",
      },
      {
        protocol: "Orca",
        type: "lp",
        apy: "16.7%",
        url: "https://orca.so/pools",
        description: "INX-USDC concentrated liquidity pool",
        risk: "medium",
      },
      {
        protocol: "Drift Protocol",
        type: "vault",
        apy: "11.2%",
        url: "https://app.drift.trade",
        description: "INX vault with automated market making",
        risk: "medium",
      },
    ],
    communityLinks: [
      { label: "Twitter", url: "https://twitter.com/infinex_app" },
      { label: "Discord", url: "https://discord.gg/infinex" },
      { label: "Docs", url: "https://docs.infinex.xyz" },
    ],
  },
};

export function getOnboardingConfig(
  slug: string
): OnboardingConfig | undefined {
  return ONBOARDING_CONFIGS[slug.toLowerCase()];
}

export const SUPPORTED_ONBOARDING_TOKENS = Object.keys(ONBOARDING_CONFIGS);
