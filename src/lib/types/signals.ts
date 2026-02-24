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

export interface SearchIntentPoint {
  date: string;
  searches: number;
}

export interface TokenSearchData {
  tokenId: string;
  total14d: number;
  avgDaily: number;
  peakDay: number;
  trend: number;
  timeseries: SearchIntentPoint[];
}

export interface TokenSocialData {
  tokenId: string;
  tweets7d: number;
  tweets30d: number;
  sentiment: number; // -1 to 1
  topHashtags: string[];
  demandMentions: number; // tweets specifically requesting Solana listing
  influencerMentions: number;
  trend: number;
}

export interface TokenMarketData {
  tokenId: string;
  price: number;
  marketCap: number;
  volume24h: number;
  tvl: number;
  holders: number;
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
