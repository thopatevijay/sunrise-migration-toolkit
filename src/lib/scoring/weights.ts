export const MDS_WEIGHTS = {
  bridgeOutflow: 0.30,
  searchIntent: 0.25,
  socialDemand: 0.20,
  chainHealth: 0.15,
  walletOverlap: 0.10,
} as const;

export type SignalKey = keyof typeof MDS_WEIGHTS;

export const SIGNAL_LABELS: Record<SignalKey, string> = {
  bridgeOutflow: "Bridge Outflow",
  searchIntent: "Search Intent",
  socialDemand: "Social Demand",
  chainHealth: "Chain Health",
  walletOverlap: "Wallet Overlap",
};

export const SIGNAL_DESCRIPTIONS: Record<SignalKey, string> = {
  bridgeOutflow: "SOL-denominated value leaving Solana to buy this token on other chains",
  searchIntent: "Frequency of searches for this token on Solana DEXs",
  socialDemand: "Social media mentions requesting this token on Solana",
  chainHealth: "Origin chain token health: volume, TVL, holders, market cap",
  walletOverlap: "Percentage of token holders who also have Solana wallets",
};
