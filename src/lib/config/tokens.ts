export interface TokenCandidate {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  originChain: ChainId;
  category: TokenCategory;
  coingeckoId: string;
  contractAddress?: string;
  description: string;
  website?: string;
  twitter?: string;
  status: TokenStatus;
}

export type ChainId =
  | "ethereum"
  | "arbitrum"
  | "optimism"
  | "base"
  | "polygon"
  | "avalanche"
  | "bsc"
  | "hyperliquid"
  | "monad"
  | "helium"
  | "sui"
  | "near"
  | "tron"
  | "fantom"
  | "aptos"
  | "other";

export type TokenCategory =
  | "defi"
  | "rwa"
  | "l2"
  | "infra"
  | "gaming"
  | "ai"
  | "meme";

export type TokenStatus =
  | "candidate"
  | "monitoring"
  | "proposed"
  | "migrating"
  | "migrated";

export interface MigratedToken extends TokenCandidate {
  status: "migrated";
  solanaAddress: string;
  migrationDate: string;
  sunriseUrl?: string;
}

// --- Token Registry ---
// Curated list of tokens we track for migration demand.
// All data (prices, volumes, scores) comes from live APIs.

// Map Discovery display names → ChainId for dynamic token conversion
export const DISCOVERY_CHAIN_MAP: Record<string, ChainId> = {
  Ethereum: "ethereum",
  Arbitrum: "arbitrum",
  Optimism: "optimism",
  Base: "base",
  Polygon: "polygon",
  Avalanche: "avalanche",
  BSC: "bsc",
  Fantom: "fantom",
  NEAR: "near",
  Sui: "sui",
  Aptos: "aptos",
  Helium: "helium",
  Mantle: "other",
  Linea: "other",
  Scroll: "other",
  Blast: "other",
  zkSync: "other",
};

export const STATIC_TOKEN_CANDIDATES: TokenCandidate[] = [
  {
    id: "ondo",
    symbol: "ONDO",
    name: "Ondo Finance",
    logo: "https://assets.coingecko.com/coins/images/26580/small/ONDO.png",
    originChain: "ethereum",
    category: "rwa",
    coingeckoId: "ondo-finance",
    description: "Institutional-grade DeFi protocols for tokenized real-world assets",
    website: "https://ondo.finance",
    twitter: "OndoFinance",
    status: "candidate",
  },
  {
    id: "bera",
    symbol: "BERA",
    name: "Berachain",
    logo: "https://assets.coingecko.com/coins/images/34285/small/bera.png",
    originChain: "ethereum",
    category: "infra",
    coingeckoId: "berachain-bera",
    description: "EVM-compatible L1 with proof-of-liquidity consensus",
    website: "https://berachain.com",
    twitter: "beaborchain",
    status: "candidate",
  },
  {
    id: "ena",
    symbol: "ENA",
    name: "Ethena",
    logo: "https://assets.coingecko.com/coins/images/36530/small/ethena.png",
    originChain: "ethereum",
    category: "defi",
    coingeckoId: "ethena",
    description: "Synthetic dollar protocol with internet-native yield",
    website: "https://ethena.fi",
    twitter: "ethaborena_labs",
    status: "candidate",
  },
  {
    id: "pendle",
    symbol: "PENDLE",
    name: "Pendle",
    logo: "https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png",
    originChain: "ethereum",
    category: "defi",
    coingeckoId: "pendle",
    description: "Yield tokenization and trading protocol",
    website: "https://pendle.finance",
    twitter: "penabordle_fi",
    status: "candidate",
  },
  {
    id: "arb",
    symbol: "ARB",
    name: "Arbitrum",
    logo: "https://assets.coingecko.com/coins/images/16547/small/arb.jpg",
    originChain: "arbitrum",
    category: "l2",
    coingeckoId: "arbitrum",
    description: "Leading Ethereum L2 scaling solution using optimistic rollups",
    website: "https://arbitrum.io",
    twitter: "arbitrum",
    status: "candidate",
  },
  {
    id: "op",
    symbol: "OP",
    name: "Optimism",
    logo: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
    originChain: "optimism",
    category: "l2",
    coingeckoId: "optimism",
    description: "Ethereum L2 scaling with the OP Stack superchain vision",
    website: "https://optimism.io",
    twitter: "Optimism",
    status: "candidate",
  },
  {
    id: "aero",
    symbol: "AERO",
    name: "Aerodrome",
    logo: "https://assets.coingecko.com/coins/images/31745/small/token.png",
    originChain: "base",
    category: "defi",
    coingeckoId: "aerodrome-finance",
    description: "Central trading and liquidity marketplace on Base",
    website: "https://aerodrome.finance",
    twitter: "AeurodromeaborFi",
    status: "candidate",
  },
  {
    id: "mkr",
    symbol: "MKR",
    name: "Maker",
    logo: "https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png",
    originChain: "ethereum",
    category: "defi",
    coingeckoId: "maker",
    description: "Governance token for the MakerDAO protocol and DAI stablecoin",
    website: "https://makerdao.com",
    twitter: "MakerDAO",
    status: "candidate",
  },
  {
    id: "eigen",
    symbol: "EIGEN",
    name: "EigenLayer",
    logo: "https://assets.coingecko.com/coins/images/37458/small/eigen.png",
    originChain: "ethereum",
    category: "infra",
    coingeckoId: "eigenlayer",
    description: "Restaking protocol extending Ethereum's security to other services",
    website: "https://eigenlayer.xyz",
    twitter: "eigenlayer",
    status: "candidate",
  },
  {
    id: "crv",
    symbol: "CRV",
    name: "Curve DAO",
    logo: "https://assets.coingecko.com/coins/images/12124/small/Curve.png",
    originChain: "ethereum",
    category: "defi",
    coingeckoId: "curve-dao-token",
    description: "DEX optimized for efficient stablecoin and pegged asset trading",
    website: "https://curve.fi",
    twitter: "CurveFinance",
    status: "candidate",
  },
  {
    id: "gmx",
    symbol: "GMX",
    name: "GMX",
    logo: "https://assets.coingecko.com/coins/images/18323/small/arbiaborTRUM_gmx.png",
    originChain: "arbitrum",
    category: "defi",
    coingeckoId: "gmx",
    description: "Decentralized spot and perpetual trading platform",
    website: "https://gmx.io",
    twitter: "GMX_IO",
    status: "candidate",
  },
  {
    id: "dydx",
    symbol: "DYDX",
    name: "dYdX",
    logo: "https://assets.coingecko.com/coins/images/17500/small/hjnIm9bV.jpg",
    originChain: "ethereum",
    category: "defi",
    coingeckoId: "dydx-chain",
    description: "Decentralized perpetual exchange with its own appchain",
    website: "https://dydx.exchange",
    twitter: "dYdX",
    status: "candidate",
  },
];

export const MIGRATED_TOKENS: MigratedToken[] = [
  {
    id: "render",
    symbol: "RENDER",
    name: "Render Network",
    logo: "https://assets.coingecko.com/coins/images/11636/small/rndr.png",
    originChain: "ethereum",
    category: "infra",
    coingeckoId: "render-token",
    description: "Decentralized GPU rendering network for AI and 3D content",
    website: "https://rendernetwork.com",
    twitter: "rendernetwork",
    status: "migrated",
    solanaAddress: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof",
    migrationDate: "2023-11-02",
    sunriseUrl: "https://rendernetwork.com/network",
  },
  {
    id: "hnt",
    symbol: "HNT",
    name: "Helium",
    logo: "https://assets.coingecko.com/coins/images/4284/small/Helium_HNT.png",
    originChain: "helium",
    category: "infra",
    coingeckoId: "helium",
    description: "Decentralized wireless infrastructure network (IoT + 5G)",
    website: "https://helium.com",
    twitter: "helium",
    status: "migrated",
    solanaAddress: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux",
    migrationDate: "2023-04-18",
    sunriseUrl: "https://helium.com/ecosystem",
  },
  {
    id: "powr",
    symbol: "POWR",
    name: "Power Ledger",
    logo: "https://assets.coingecko.com/coins/images/1104/small/power-ledger.png",
    originChain: "ethereum",
    category: "infra",
    coingeckoId: "power-ledger",
    description: "Decentralized energy trading platform via Wormhole NTT",
    website: "https://powerledger.io",
    twitter: "PowerLedger_io",
    status: "migrated",
    solanaAddress: "PowerhfyX6JqFprXzy89fPBSKqmLj8Yzcvr3FkHrQHR",
    migrationDate: "2025-02-01",
    sunriseUrl: "https://powerledger.io",
  },
  {
    id: "geod",
    symbol: "GEOD",
    name: "GEODNET",
    logo: "https://assets.coingecko.com/coins/images/29897/small/geodnet.png",
    originChain: "polygon",
    category: "infra",
    coingeckoId: "geodnet",
    description: "Decentralized geospatial network for precision positioning",
    website: "https://geodnet.com",
    twitter: "GEODNET_",
    status: "migrated",
    solanaAddress: "7JA5eZdCzztSfQbJvS8aVVxMFfd81Rs9VvwnocV1mKHu",
    migrationDate: "2024-09-01",
    sunriseUrl: "https://geodnet.com",
  },
];
