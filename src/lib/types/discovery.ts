export type SolanaStatus = "none" | "wrapped" | "wrapped_only";

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
  solanaMint?: string;
  solanaLiquidity?: number;
}

export interface DiscoveryResponse {
  tokens: DiscoveryToken[];
  totalFound: number;
  cachedAt: string;
}
