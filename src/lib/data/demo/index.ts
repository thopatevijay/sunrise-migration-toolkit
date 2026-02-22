export const DEMO_MODE = !process.env.NEXT_PUBLIC_LIVE_API_ENABLED;

export { DEMO_CANDIDATES, DEMO_MIGRATED } from "./tokens";
export { DEMO_BRIDGE_VOLUMES, getBridgeData } from "./bridge-volumes";
export { DEMO_SEARCH_INTENT, getSearchData } from "./search-intent";
export { DEMO_SOCIAL_SIGNALS, getSocialData } from "./social-signals";
export { DEMO_MARKET_DATA, getMarketData } from "./market-data";
export { DEMO_WALLET_OVERLAP, getWalletOverlap } from "./wallet-overlap";

export type { TokenBridgeData, BridgeVolumePoint } from "./bridge-volumes";
export type { TokenSearchData, SearchIntentPoint } from "./search-intent";
export type { TokenSocialData } from "./social-signals";
export type { TokenMarketData } from "./market-data";
export type { TokenWalletOverlap } from "./wallet-overlap";
