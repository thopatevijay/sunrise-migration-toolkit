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

export const DEMO_SOCIAL_SIGNALS: TokenSocialData[] = [
  {
    tokenId: "ondo",
    tweets7d: 340,
    tweets30d: 1280,
    sentiment: 0.82,
    topHashtags: ["#ONDO", "#RWA", "#SolanaNeedONDO", "#Sunrise"],
    demandMentions: 145,
    influencerMentions: 23,
    trend: 42.5,
  },
  {
    tokenId: "bera",
    tweets7d: 290,
    tweets30d: 1050,
    sentiment: 0.78,
    topHashtags: ["#BERA", "#Berachain", "#BringBERA", "#SolanaGraveyard"],
    demandMentions: 118,
    influencerMentions: 19,
    trend: 35.2,
  },
  {
    tokenId: "ena",
    tweets7d: 220,
    tweets30d: 850,
    sentiment: 0.71,
    topHashtags: ["#ENA", "#Ethena", "#USDe", "#SolanaDefi"],
    demandMentions: 92,
    influencerMentions: 15,
    trend: 28.1,
  },
  {
    tokenId: "pendle",
    tweets7d: 185,
    tweets30d: 720,
    sentiment: 0.75,
    topHashtags: ["#PENDLE", "#YieldTrading", "#PendleOnSolana"],
    demandMentions: 78,
    influencerMentions: 12,
    trend: 22.8,
  },
  {
    tokenId: "arb",
    tweets7d: 160,
    tweets30d: 640,
    sentiment: 0.65,
    topHashtags: ["#ARB", "#Arbitrum", "#L2onSolana"],
    demandMentions: 64,
    influencerMentions: 10,
    trend: 15.3,
  },
  {
    tokenId: "op",
    tweets7d: 130,
    tweets30d: 520,
    sentiment: 0.62,
    topHashtags: ["#OP", "#Optimism", "#Superchain"],
    demandMentions: 48,
    influencerMentions: 8,
    trend: 10.5,
  },
  {
    tokenId: "aero",
    tweets7d: 110,
    tweets30d: 430,
    sentiment: 0.68,
    topHashtags: ["#AERO", "#Aerodrome", "#Base"],
    demandMentions: 42,
    influencerMentions: 7,
    trend: 18.2,
  },
  {
    tokenId: "mkr",
    tweets7d: 85,
    tweets30d: 380,
    sentiment: 0.58,
    topHashtags: ["#MKR", "#MakerDAO", "#DAI"],
    demandMentions: 30,
    influencerMentions: 6,
    trend: 5.1,
  },
  {
    tokenId: "eigen",
    tweets7d: 70,
    tweets30d: 310,
    sentiment: 0.55,
    topHashtags: ["#EIGEN", "#EigenLayer", "#Restaking"],
    demandMentions: 25,
    influencerMentions: 5,
    trend: 8.4,
  },
  {
    tokenId: "crv",
    tweets7d: 55,
    tweets30d: 260,
    sentiment: 0.48,
    topHashtags: ["#CRV", "#CurveFinance", "#StableSwap"],
    demandMentions: 18,
    influencerMentions: 4,
    trend: -3.2,
  },
  {
    tokenId: "gmx",
    tweets7d: 40,
    tweets30d: 190,
    sentiment: 0.52,
    topHashtags: ["#GMX", "#PerpDEX", "#Arbitrum"],
    demandMentions: 14,
    influencerMentions: 3,
    trend: -8.5,
  },
  {
    tokenId: "dydx",
    tweets7d: 30,
    tweets30d: 150,
    sentiment: 0.45,
    topHashtags: ["#DYDX", "#PerpTrading"],
    demandMentions: 10,
    influencerMentions: 2,
    trend: -12.1,
  },
];

export function getSocialData(tokenId: string): TokenSocialData | undefined {
  return DEMO_SOCIAL_SIGNALS.find((d) => d.tokenId === tokenId);
}
