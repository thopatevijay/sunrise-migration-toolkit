// Signal data types — used by providers, scoring engine, and data facade

export interface BridgeVolumePoint {
  date: string;
  volume: number;
  txCount: number;
}

export interface TokenBridgeData {
  tokenId: string;
  total30d: number;
  total7d: number;
  avgDaily: number;
  trend: number; // percentage change 7d vs prior 7d
  timeseries: BridgeVolumePoint[];
  dataSource: "live" | "estimated";
}

export interface TokenSearchData {
  tokenId: string;
  total14d: number;
  avgDaily: number;
  peakDay: number;
  trend: number;
  existsOnJupiter: boolean;
  pairCount: number;
  solanaPairCount: number;
  totalVolume24h: number;
  totalLiquidity: number;
  boostScore: number;
}

export interface TokenSocialData {
  tokenId: string;
  twitterFollowers: number;
  redditSubscribers: number;
  redditActive48h: number;
  sentimentUpPct: number; // 0-100 raw from CoinGecko
  sentiment: number; // -1 to 1 normalized
  communityScore: number; // composite 0-100
  trend: number;
}

export interface TokenMarketData {
  tokenId: string;
  price: number;
  marketCap: number;
  volume24h: number;
  tvl: number;
  holders: number;
  holdersExact: boolean; // true = real on-chain count (Helius), false = estimated
  change7d: number;
  change30d: number;
  ath: number;
  athDate: string;
  circulatingSupply: number;
  totalSupply: number;
  priceHistory30d: { date: string; price: number }[];
}

export interface TokenWalletOverlap {
  tokenId: string;
  overlapPercentage: number; // % of token holders who also have Solana wallets
  solanaWallets: number; // estimated count
  totalHolders: number;
  activeOverlap: number; // % of overlapping wallets active in last 30d
  topWalletCategories: {
    category: string;
    percentage: number;
  }[];
  isEstimated?: boolean;
}
