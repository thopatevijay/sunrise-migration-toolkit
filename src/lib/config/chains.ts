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
    bridgeSupport: { wormhole: true },
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    shortName: "ARB",
    color: "#28A0F0",
    explorerUrl: "https://arbiscan.io",
    nativeCurrency: "ETH",
    bridgeSupport: { wormhole: true },
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    shortName: "OP",
    color: "#FF0420",
    explorerUrl: "https://optimistic.etherscan.io",
    nativeCurrency: "ETH",
    bridgeSupport: { wormhole: true },
  },
  base: {
    id: "base",
    name: "Base",
    shortName: "BASE",
    color: "#0052FF",
    explorerUrl: "https://basescan.org",
    nativeCurrency: "ETH",
    bridgeSupport: { wormhole: true },
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    shortName: "POL",
    color: "#8247E5",
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: "MATIC",
    bridgeSupport: { wormhole: true },
  },
  avalanche: {
    id: "avalanche",
    name: "Avalanche",
    shortName: "AVAX",
    color: "#E84142",
    explorerUrl: "https://snowtrace.io",
    nativeCurrency: "AVAX",
    bridgeSupport: { wormhole: true },
  },
  bsc: {
    id: "bsc",
    name: "BNB Chain",
    shortName: "BSC",
    color: "#F0B90B",
    explorerUrl: "https://bscscan.com",
    nativeCurrency: "BNB",
    bridgeSupport: { wormhole: true },
  },
  hyperliquid: {
    id: "hyperliquid",
    name: "Hyperliquid",
    shortName: "HL",
    color: "#50E3C2",
    explorerUrl: "https://explorer.hyperliquid.xyz",
    nativeCurrency: "HYPE",
    bridgeSupport: { wormhole: false },
  },
  monad: {
    id: "monad",
    name: "Monad",
    shortName: "MON",
    color: "#836EF9",
    explorerUrl: "https://explorer.monad.xyz",
    nativeCurrency: "MON",
    bridgeSupport: { wormhole: false },
  },
  helium: {
    id: "helium",
    name: "Helium",
    shortName: "HNT",
    color: "#474DFF",
    explorerUrl: "https://explorer.helium.com",
    nativeCurrency: "HNT",
    bridgeSupport: { wormhole: false },
  },
  sui: {
    id: "sui",
    name: "Sui",
    shortName: "SUI",
    color: "#4DA2FF",
    explorerUrl: "https://suiscan.xyz",
    nativeCurrency: "SUI",
    bridgeSupport: { wormhole: true },
  },
  near: {
    id: "near",
    name: "NEAR",
    shortName: "NEAR",
    color: "#00C08B",
    explorerUrl: "https://nearblocks.io",
    nativeCurrency: "NEAR",
    bridgeSupport: { wormhole: true },
  },
  tron: {
    id: "tron",
    name: "TRON",
    shortName: "TRX",
    color: "#FF0013",
    explorerUrl: "https://tronscan.org",
    nativeCurrency: "TRX",
    bridgeSupport: { wormhole: false },
  },
  fantom: {
    id: "fantom",
    name: "Fantom",
    shortName: "FTM",
    color: "#1969FF",
    explorerUrl: "https://ftmscan.com",
    nativeCurrency: "FTM",
    bridgeSupport: { wormhole: true },
  },
  aptos: {
    id: "aptos",
    name: "Aptos",
    shortName: "APT",
    color: "#4FD1C5",
    explorerUrl: "https://aptoscan.com",
    nativeCurrency: "APT",
    bridgeSupport: { wormhole: true },
  },
  other: {
    id: "other",
    name: "Other",
    shortName: "OTHER",
    color: "#9CA3AF",
    explorerUrl: "",
    nativeCurrency: "",
    bridgeSupport: { wormhole: false },
  },
};
