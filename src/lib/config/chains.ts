import type { ChainId } from "./tokens";

export interface ChainConfig {
  id: ChainId;
  name: string;
  shortName: string;
  color: string;
  explorerUrl: string;
  nativeCurrency: string;
  bridgeSupport: {
    wormhole: boolean;
    debridge: boolean;
  };
}

export const CHAINS: Record<ChainId, ChainConfig> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    shortName: "ETH",
    color: "#627EEA",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: "ETH",
    bridgeSupport: { wormhole: true, debridge: true },
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    shortName: "ARB",
    color: "#28A0F0",
    explorerUrl: "https://arbiscan.io",
    nativeCurrency: "ETH",
    bridgeSupport: { wormhole: true, debridge: true },
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    shortName: "OP",
    color: "#FF0420",
    explorerUrl: "https://optimistic.etherscan.io",
    nativeCurrency: "ETH",
    bridgeSupport: { wormhole: true, debridge: true },
  },
  base: {
    id: "base",
    name: "Base",
    shortName: "BASE",
    color: "#0052FF",
    explorerUrl: "https://basescan.org",
    nativeCurrency: "ETH",
    bridgeSupport: { wormhole: true, debridge: true },
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    shortName: "POL",
    color: "#8247E5",
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: "MATIC",
    bridgeSupport: { wormhole: true, debridge: true },
  },
  avalanche: {
    id: "avalanche",
    name: "Avalanche",
    shortName: "AVAX",
    color: "#E84142",
    explorerUrl: "https://snowtrace.io",
    nativeCurrency: "AVAX",
    bridgeSupport: { wormhole: true, debridge: true },
  },
  bsc: {
    id: "bsc",
    name: "BNB Chain",
    shortName: "BSC",
    color: "#F0B90B",
    explorerUrl: "https://bscscan.com",
    nativeCurrency: "BNB",
    bridgeSupport: { wormhole: true, debridge: true },
  },
  hyperliquid: {
    id: "hyperliquid",
    name: "Hyperliquid",
    shortName: "HL",
    color: "#50E3C2",
    explorerUrl: "https://explorer.hyperliquid.xyz",
    nativeCurrency: "HYPE",
    bridgeSupport: { wormhole: false, debridge: false },
  },
  monad: {
    id: "monad",
    name: "Monad",
    shortName: "MON",
    color: "#836EF9",
    explorerUrl: "https://explorer.monad.xyz",
    nativeCurrency: "MON",
    bridgeSupport: { wormhole: false, debridge: false },
  },
  sui: {
    id: "sui",
    name: "Sui",
    shortName: "SUI",
    color: "#4DA2FF",
    explorerUrl: "https://suiscan.xyz",
    nativeCurrency: "SUI",
    bridgeSupport: { wormhole: true, debridge: false },
  },
  near: {
    id: "near",
    name: "NEAR",
    shortName: "NEAR",
    color: "#00C08B",
    explorerUrl: "https://nearblocks.io",
    nativeCurrency: "NEAR",
    bridgeSupport: { wormhole: true, debridge: false },
  },
  tron: {
    id: "tron",
    name: "TRON",
    shortName: "TRX",
    color: "#FF0013",
    explorerUrl: "https://tronscan.org",
    nativeCurrency: "TRX",
    bridgeSupport: { wormhole: false, debridge: false },
  },
  fantom: {
    id: "fantom",
    name: "Fantom",
    shortName: "FTM",
    color: "#1969FF",
    explorerUrl: "https://ftmscan.com",
    nativeCurrency: "FTM",
    bridgeSupport: { wormhole: true, debridge: false },
  },
  aptos: {
    id: "aptos",
    name: "Aptos",
    shortName: "APT",
    color: "#4FD1C5",
    explorerUrl: "https://aptoscan.com",
    nativeCurrency: "APT",
    bridgeSupport: { wormhole: true, debridge: false },
  },
  other: {
    id: "other",
    name: "Other",
    shortName: "OTHER",
    color: "#9CA3AF",
    explorerUrl: "",
    nativeCurrency: "",
    bridgeSupport: { wormhole: false, debridge: false },
  },
};
