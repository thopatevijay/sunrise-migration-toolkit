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
  | "monad";

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
