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
  render: {
    slug: "render",
    symbol: "RENDER",
    name: "Render Network",
    tagline: "RENDER migrated to Solana — access GPU rendering with DeFi yield",
    originChain: "ethereum",
    originChainName: "Ethereum",
    migrationDate: "November 2, 2023",
    colors: {
      primary: "from-rose-500 to-orange-500",
      gradient: "from-rose-950/30 via-background to-orange-950/20",
      accentBg: "bg-rose-500/10",
    },
    whySolana: [
      "RENDER migrated from Ethereum to Solana for faster, cheaper GPU job settlements",
      "Sub-second finality enables real-time rendering job coordination",
      "Deep DeFi liquidity on Jupiter, Raydium, and Orca for RENDER trading",
      "Growing AI/GPU narrative on Solana alongside Render, Nosana, and io.net",
    ],
    wallets: COMMON_WALLETS,
    bridges: [
      {
        name: "Wormhole Portal",
        url: "https://portalbridge.com/advanced-tools/#/transfer",
        estimatedTime: "~15 minutes",
        fee: "Free (gas only)",
        recommended: true,
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
        url: "https://jup.ag/swap/SOL-RENDER",
        type: "aggregator",
        description: "Best price across all Solana DEXs",
      },
      {
        name: "Raydium",
        url: "https://raydium.io/swap/?inputMint=sol&outputMint=rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof",
        type: "dex",
        description: "Concentrated liquidity AMM with deep RENDER pairs",
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
        apy: "—",
        url: "https://app.kamino.finance",
        description: "Supply RENDER to earn lending yield",
        risk: "low",
      },
      {
        protocol: "Raydium",
        type: "lp",
        apy: "—",
        url: "https://raydium.io/liquidity",
        description: "RENDER-SOL concentrated liquidity pool",
        risk: "medium",
      },
      {
        protocol: "MarginFi",
        type: "lending",
        apy: "—",
        url: "https://app.marginfi.com",
        description: "Lend RENDER on MarginFi for passive yield",
        risk: "low",
      },
    ],
    communityLinks: [
      { label: "Twitter", url: "https://twitter.com/rendernetwork" },
      { label: "Discord", url: "https://discord.gg/rendernetwork" },
      { label: "Docs", url: "https://docs.rendernetwork.com" },
    ],
  },
  hnt: {
    slug: "hnt",
    symbol: "HNT",
    name: "Helium",
    tagline: "HNT migrated to Solana — the people's wireless network",
    originChain: "helium",
    originChainName: "Helium L1",
    migrationDate: "April 18, 2023",
    colors: {
      primary: "from-indigo-500 to-blue-500",
      gradient: "from-indigo-950/30 via-background to-blue-950/20",
      accentBg: "bg-indigo-500/10",
    },
    whySolana: [
      "Helium migrated from its own L1 to Solana for scalability and composability",
      "Solana's throughput handles Helium's massive IoT + 5G data credit burns",
      "HNT holders access deep DeFi liquidity via Jupiter and other DEXs",
      "Sub-second finality enables real-time data credit settlements",
    ],
    wallets: COMMON_WALLETS,
    bridges: [
      {
        name: "Helium Wallet App",
        url: "https://helium.com/ecosystem",
        estimatedTime: "Native on Solana",
        fee: "N/A",
        recommended: true,
      },
    ],
    tradingVenues: [
      {
        name: "Jupiter",
        url: "https://jup.ag/swap/SOL-HNT",
        type: "aggregator",
        description: "Best price across all Solana DEXs",
      },
      {
        name: "Orca",
        url: "https://orca.so",
        type: "dex",
        description: "HNT-SOL and HNT-USDC concentrated liquidity pools",
      },
    ],
    defiOpportunities: [
      {
        protocol: "Kamino Finance",
        type: "lending",
        apy: "—",
        url: "https://app.kamino.finance",
        description: "Supply HNT to earn lending yield",
        risk: "low",
      },
      {
        protocol: "Orca",
        type: "lp",
        apy: "—",
        url: "https://orca.so/pools",
        description: "HNT-SOL concentrated liquidity pool",
        risk: "medium",
      },
      {
        protocol: "MarginFi",
        type: "lending",
        apy: "—",
        url: "https://app.marginfi.com",
        description: "Lend HNT on MarginFi for passive yield",
        risk: "low",
      },
    ],
    communityLinks: [
      { label: "Twitter", url: "https://twitter.com/helium" },
      { label: "Discord", url: "https://discord.gg/helium" },
      { label: "Docs", url: "https://docs.helium.com" },
    ],
  },
  powr: {
    slug: "powr",
    symbol: "POWR",
    name: "Power Ledger",
    tagline: "POWR migrated to Solana via Wormhole NTT — decentralized energy trading",
    originChain: "ethereum",
    originChainName: "Ethereum",
    migrationDate: "February 1, 2025",
    colors: {
      primary: "from-emerald-500 to-teal-500",
      gradient: "from-emerald-950/30 via-background to-teal-950/20",
      accentBg: "bg-emerald-500/10",
    },
    whySolana: [
      "POWR migrated via Wormhole NTT for fast, low-cost energy trading settlements",
      "Solana's throughput handles high-frequency micro-transactions for energy markets",
      "Access Solana DeFi ecosystem for POWR yield and liquidity",
      "Wormhole NTT ensures canonical token representation across chains",
    ],
    wallets: COMMON_WALLETS,
    bridges: [
      {
        name: "Wormhole NTT",
        url: "https://portalbridge.com/advanced-tools/#/transfer",
        estimatedTime: "~15 minutes",
        fee: "Free (gas only)",
        recommended: true,
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
        url: "https://jup.ag/swap/SOL-POWR",
        type: "aggregator",
        description: "Best price across all Solana DEXs",
      },
      {
        name: "Raydium",
        url: "https://raydium.io/swap/?inputMint=sol&outputMint=PowerhfyX6JqFprXzy89fPBSKqmLj8Yzcvr3FkHrQHR",
        type: "dex",
        description: "Concentrated liquidity AMM",
      },
    ],
    defiOpportunities: [
      {
        protocol: "Kamino Finance",
        type: "lending",
        apy: "—",
        url: "https://app.kamino.finance",
        description: "Supply POWR to earn lending yield",
        risk: "low",
      },
      {
        protocol: "Raydium",
        type: "lp",
        apy: "—",
        url: "https://raydium.io/liquidity",
        description: "POWR-USDC concentrated liquidity pool",
        risk: "medium",
      },
    ],
    communityLinks: [
      { label: "Twitter", url: "https://twitter.com/PowerLedger_io" },
      { label: "Website", url: "https://powerledger.io" },
      { label: "Docs", url: "https://docs.powerledger.io" },
    ],
  },
  geod: {
    slug: "geod",
    symbol: "GEOD",
    name: "GEODNET",
    tagline: "GEOD migrated to Solana via Wormhole NTT — precision geospatial data",
    originChain: "polygon",
    originChainName: "Polygon",
    migrationDate: "September 1, 2024",
    colors: {
      primary: "from-sky-500 to-cyan-500",
      gradient: "from-sky-950/30 via-background to-cyan-950/20",
      accentBg: "bg-sky-500/10",
    },
    whySolana: [
      "GEODNET migrated via Wormhole NTT for scalable geospatial data settlements",
      "Solana's speed enables real-time RTK correction data delivery to miners",
      "Access Solana DeFi for GEOD yield alongside other DePIN tokens",
      "Composability with Helium, Render, and other Solana-native DePIN networks",
    ],
    wallets: COMMON_WALLETS,
    bridges: [
      {
        name: "Wormhole NTT",
        url: "https://portalbridge.com/advanced-tools/#/transfer",
        estimatedTime: "~15 minutes",
        fee: "Free (gas only)",
        recommended: true,
      },
    ],
    tradingVenues: [
      {
        name: "Jupiter",
        url: "https://jup.ag/swap/SOL-GEOD",
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
        apy: "—",
        url: "https://app.kamino.finance",
        description: "Supply GEOD to earn lending yield",
        risk: "low",
      },
      {
        protocol: "Orca",
        type: "lp",
        apy: "—",
        url: "https://orca.so/pools",
        description: "GEOD-SOL concentrated liquidity pool",
        risk: "medium",
      },
    ],
    communityLinks: [
      { label: "Twitter", url: "https://twitter.com/GEODNET_" },
      { label: "Website", url: "https://geodnet.com" },
      { label: "Docs", url: "https://docs.geodnet.com" },
    ],
  },
};

export function getOnboardingConfig(
  slug: string
): OnboardingConfig | undefined {
  return ONBOARDING_CONFIGS[slug.toLowerCase()];
}

export const SUPPORTED_ONBOARDING_TOKENS = Object.keys(ONBOARDING_CONFIGS);
