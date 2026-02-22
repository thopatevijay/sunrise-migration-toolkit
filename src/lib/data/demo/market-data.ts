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

function generatePriceHistory(
  basePrice: number,
  volatility: number,
  trend: number
): { date: string; price: number }[] {
  const points: { date: string; price: number }[] = [];
  const now = new Date();
  let price = basePrice * (1 - trend * 0.3);

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayProgress = (30 - i) / 30;
    const trendAdjust = trend * dayProgress * 0.3;
    const noise = (Math.sin(i * 1.5) * 0.03 + Math.cos(i * 2.8) * 0.02) * volatility;

    price = basePrice * (1 - trend * 0.3 + trendAdjust) * (1 + noise);

    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 10000) / 10000,
    });
  }

  return points;
}

export const DEMO_MARKET_DATA: TokenMarketData[] = [
  {
    tokenId: "ondo",
    price: 1.42,
    marketCap: 4_280_000_000,
    volume24h: 185_000_000,
    tvl: 820_000_000,
    holders: 142_000,
    change7d: 12.4,
    change30d: 28.6,
    ath: 2.14,
    athDate: "2025-12-15",
    circulatingSupply: 3_014_000_000,
    totalSupply: 10_000_000_000,
    priceHistory30d: generatePriceHistory(1.42, 0.8, 0.28),
  },
  {
    tokenId: "bera",
    price: 8.75,
    marketCap: 3_500_000_000,
    volume24h: 220_000_000,
    tvl: 1_200_000_000,
    holders: 98_000,
    change7d: 8.2,
    change30d: 22.1,
    ath: 14.50,
    athDate: "2026-01-08",
    circulatingSupply: 400_000_000,
    totalSupply: 1_000_000_000,
    priceHistory30d: generatePriceHistory(8.75, 0.9, 0.22),
  },
  {
    tokenId: "ena",
    price: 0.89,
    marketCap: 2_580_000_000,
    volume24h: 145_000_000,
    tvl: 3_400_000_000,
    holders: 85_000,
    change7d: 5.8,
    change30d: 15.3,
    ath: 1.52,
    athDate: "2025-04-11",
    circulatingSupply: 2_900_000_000,
    totalSupply: 15_000_000_000,
    priceHistory30d: generatePriceHistory(0.89, 0.7, 0.15),
  },
  {
    tokenId: "pendle",
    price: 5.20,
    marketCap: 1_680_000_000,
    volume24h: 92_000_000,
    tvl: 2_800_000_000,
    holders: 72_000,
    change7d: 6.1,
    change30d: 18.4,
    ath: 7.50,
    athDate: "2025-06-24",
    circulatingSupply: 323_000_000,
    totalSupply: 500_000_000,
    priceHistory30d: generatePriceHistory(5.2, 0.6, 0.18),
  },
  {
    tokenId: "arb",
    price: 1.15,
    marketCap: 4_600_000_000,
    volume24h: 310_000_000,
    tvl: 2_100_000_000,
    holders: 680_000,
    change7d: 3.2,
    change30d: 8.5,
    ath: 2.40,
    athDate: "2025-01-16",
    circulatingSupply: 4_000_000_000,
    totalSupply: 10_000_000_000,
    priceHistory30d: generatePriceHistory(1.15, 0.5, 0.085),
  },
  {
    tokenId: "op",
    price: 2.10,
    marketCap: 3_200_000_000,
    volume24h: 180_000_000,
    tvl: 780_000_000,
    holders: 420_000,
    change7d: 2.8,
    change30d: 6.2,
    ath: 4.85,
    athDate: "2025-03-06",
    circulatingSupply: 1_524_000_000,
    totalSupply: 4_294_000_000,
    priceHistory30d: generatePriceHistory(2.1, 0.5, 0.062),
  },
  {
    tokenId: "aero",
    price: 1.85,
    marketCap: 1_250_000_000,
    volume24h: 78_000_000,
    tvl: 1_600_000_000,
    holders: 55_000,
    change7d: 7.5,
    change30d: 14.8,
    ath: 2.38,
    athDate: "2025-12-04",
    circulatingSupply: 675_000_000,
    totalSupply: 1_500_000_000,
    priceHistory30d: generatePriceHistory(1.85, 0.7, 0.148),
  },
  {
    tokenId: "mkr",
    price: 1850,
    marketCap: 1_720_000_000,
    volume24h: 65_000_000,
    tvl: 8_200_000_000,
    holders: 110_000,
    change7d: 1.5,
    change30d: 4.2,
    ath: 6340,
    athDate: "2021-05-03",
    circulatingSupply: 930_000,
    totalSupply: 1_005_000,
    priceHistory30d: generatePriceHistory(1850, 0.4, 0.042),
  },
  {
    tokenId: "eigen",
    price: 3.45,
    marketCap: 1_380_000_000,
    volume24h: 52_000_000,
    tvl: 12_000_000_000,
    holders: 290_000,
    change7d: 4.2,
    change30d: 9.1,
    ath: 5.65,
    athDate: "2025-10-22",
    circulatingSupply: 400_000_000,
    totalSupply: 1_670_000_000,
    priceHistory30d: generatePriceHistory(3.45, 0.8, 0.091),
  },
  {
    tokenId: "crv",
    price: 0.72,
    marketCap: 920_000_000,
    volume24h: 42_000_000,
    tvl: 1_900_000_000,
    holders: 350_000,
    change7d: -1.8,
    change30d: -5.4,
    ath: 6.85,
    athDate: "2022-01-04",
    circulatingSupply: 1_278_000_000,
    totalSupply: 3_303_000_000,
    priceHistory30d: generatePriceHistory(0.72, 0.5, -0.054),
  },
  {
    tokenId: "gmx",
    price: 28.50,
    marketCap: 272_000_000,
    volume24h: 18_000_000,
    tvl: 520_000_000,
    holders: 48_000,
    change7d: -3.5,
    change30d: -8.2,
    ath: 91.00,
    athDate: "2023-04-18",
    circulatingSupply: 9_540_000,
    totalSupply: 13_250_000,
    priceHistory30d: generatePriceHistory(28.5, 0.6, -0.082),
  },
  {
    tokenId: "dydx",
    price: 1.35,
    marketCap: 810_000_000,
    volume24h: 32_000_000,
    tvl: 340_000_000,
    holders: 62_000,
    change7d: -5.1,
    change30d: -12.3,
    ath: 27.86,
    athDate: "2021-09-30",
    circulatingSupply: 600_000_000,
    totalSupply: 1_000_000_000,
    priceHistory30d: generatePriceHistory(1.35, 0.5, -0.123),
  },
];

export function getMarketData(tokenId: string): TokenMarketData | undefined {
  return DEMO_MARKET_DATA.find((d) => d.tokenId === tokenId);
}
