export type SolanaStatus = "none" | "wrapped_only";

export interface DiscoveryToken {
  rank: number;
  coingeckoId: string;
  symbol: string;
  name: string;
  logo: string;
  marketCap: number;
  volume24h: number;
  change7d: number;
  originChains: string[];
  solanaStatus: SolanaStatus;
}

export interface DiscoveryResponse {
  tokens: DiscoveryToken[];
  totalFound: number;
  cachedAt: string;
}
