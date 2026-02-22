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
}

export const DEMO_WALLET_OVERLAP: TokenWalletOverlap[] = [
  {
    tokenId: "ondo",
    overlapPercentage: 34.2,
    solanaWallets: 48_564,
    totalHolders: 142_000,
    activeOverlap: 72.5,
    topWalletCategories: [
      { category: "DeFi Power Users", percentage: 42 },
      { category: "NFT Collectors", percentage: 18 },
      { category: "Traders", percentage: 28 },
      { category: "Holders", percentage: 12 },
    ],
  },
  {
    tokenId: "bera",
    overlapPercentage: 28.5,
    solanaWallets: 27_930,
    totalHolders: 98_000,
    activeOverlap: 68.1,
    topWalletCategories: [
      { category: "DeFi Power Users", percentage: 38 },
      { category: "Traders", percentage: 32 },
      { category: "NFT Collectors", percentage: 15 },
      { category: "Holders", percentage: 15 },
    ],
  },
  {
    tokenId: "ena",
    overlapPercentage: 25.8,
    solanaWallets: 21_930,
    totalHolders: 85_000,
    activeOverlap: 65.4,
    topWalletCategories: [
      { category: "DeFi Power Users", percentage: 48 },
      { category: "Traders", percentage: 25 },
      { category: "Holders", percentage: 18 },
      { category: "NFT Collectors", percentage: 9 },
    ],
  },
  {
    tokenId: "pendle",
    overlapPercentage: 22.4,
    solanaWallets: 16_128,
    totalHolders: 72_000,
    activeOverlap: 70.2,
    topWalletCategories: [
      { category: "DeFi Power Users", percentage: 55 },
      { category: "Traders", percentage: 22 },
      { category: "Holders", percentage: 15 },
      { category: "NFT Collectors", percentage: 8 },
    ],
  },
  {
    tokenId: "arb",
    overlapPercentage: 38.5,
    solanaWallets: 261_800,
    totalHolders: 680_000,
    activeOverlap: 58.3,
    topWalletCategories: [
      { category: "Traders", percentage: 35 },
      { category: "DeFi Power Users", percentage: 30 },
      { category: "NFT Collectors", percentage: 20 },
      { category: "Holders", percentage: 15 },
    ],
  },
  {
    tokenId: "op",
    overlapPercentage: 35.2,
    solanaWallets: 147_840,
    totalHolders: 420_000,
    activeOverlap: 55.8,
    topWalletCategories: [
      { category: "Traders", percentage: 33 },
      { category: "DeFi Power Users", percentage: 28 },
      { category: "NFT Collectors", percentage: 22 },
      { category: "Holders", percentage: 17 },
    ],
  },
  {
    tokenId: "aero",
    overlapPercentage: 18.5,
    solanaWallets: 10_175,
    totalHolders: 55_000,
    activeOverlap: 62.1,
    topWalletCategories: [
      { category: "DeFi Power Users", percentage: 52 },
      { category: "Traders", percentage: 28 },
      { category: "Holders", percentage: 12 },
      { category: "NFT Collectors", percentage: 8 },
    ],
  },
  {
    tokenId: "mkr",
    overlapPercentage: 15.8,
    solanaWallets: 17_380,
    totalHolders: 110_000,
    activeOverlap: 48.5,
    topWalletCategories: [
      { category: "DeFi Power Users", percentage: 60 },
      { category: "Holders", percentage: 22 },
      { category: "Traders", percentage: 12 },
      { category: "NFT Collectors", percentage: 6 },
    ],
  },
  {
    tokenId: "eigen",
    overlapPercentage: 20.3,
    solanaWallets: 58_870,
    totalHolders: 290_000,
    activeOverlap: 52.4,
    topWalletCategories: [
      { category: "DeFi Power Users", percentage: 45 },
      { category: "Holders", percentage: 25 },
      { category: "Traders", percentage: 20 },
      { category: "NFT Collectors", percentage: 10 },
    ],
  },
  {
    tokenId: "crv",
    overlapPercentage: 12.5,
    solanaWallets: 43_750,
    totalHolders: 350_000,
    activeOverlap: 42.8,
    topWalletCategories: [
      { category: "DeFi Power Users", percentage: 58 },
      { category: "Holders", percentage: 20 },
      { category: "Traders", percentage: 15 },
      { category: "NFT Collectors", percentage: 7 },
    ],
  },
  {
    tokenId: "gmx",
    overlapPercentage: 14.2,
    solanaWallets: 6_816,
    totalHolders: 48_000,
    activeOverlap: 55.2,
    topWalletCategories: [
      { category: "Traders", percentage: 48 },
      { category: "DeFi Power Users", percentage: 30 },
      { category: "Holders", percentage: 15 },
      { category: "NFT Collectors", percentage: 7 },
    ],
  },
  {
    tokenId: "dydx",
    overlapPercentage: 10.8,
    solanaWallets: 6_696,
    totalHolders: 62_000,
    activeOverlap: 38.5,
    topWalletCategories: [
      { category: "Traders", percentage: 52 },
      { category: "DeFi Power Users", percentage: 25 },
      { category: "Holders", percentage: 18 },
      { category: "NFT Collectors", percentage: 5 },
    ],
  },
];

export function getWalletOverlap(tokenId: string): TokenWalletOverlap | undefined {
  return DEMO_WALLET_OVERLAP.find((d) => d.tokenId === tokenId);
}
