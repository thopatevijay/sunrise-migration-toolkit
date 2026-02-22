export interface SearchIntentPoint {
  date: string;
  searches: number;
}

export interface TokenSearchData {
  tokenId: string;
  total14d: number;
  avgDaily: number;
  peakDay: number;
  trend: number;
  timeseries: SearchIntentPoint[];
}

function generateSearchTimeseries(
  baseSearches: number,
  trendFactor: number,
  spikeDay?: number
): SearchIntentPoint[] {
  const points: SearchIntentPoint[] = [];
  const now = new Date();

  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayProgress = (14 - i) / 14;
    const trendMultiplier = 1 + trendFactor * dayProgress;
    const noise = 1 + Math.sin(i * 1.8) * 0.25 + Math.cos(i * 3.2) * 0.15;
    const spike = spikeDay !== undefined && i === spikeDay ? 2.5 : 1;

    const searches = Math.round(baseSearches * trendMultiplier * noise * spike);

    points.push({
      date: date.toISOString().split("T")[0],
      searches: Math.max(searches, 0),
    });
  }

  return points;
}

function buildSearchData(
  tokenId: string,
  baseSearches: number,
  trendFactor: number,
  spikeDay?: number
): TokenSearchData {
  const timeseries = generateSearchTimeseries(baseSearches, trendFactor, spikeDay);
  const total14d = timeseries.reduce((sum, p) => sum + p.searches, 0);
  const peakDay = Math.max(...timeseries.map((p) => p.searches));
  const last7 = timeseries.slice(-7);
  const prior7 = timeseries.slice(0, 7);
  const last7Avg = last7.reduce((s, p) => s + p.searches, 0) / 7;
  const prior7Avg = prior7.reduce((s, p) => s + p.searches, 0) / 7;
  const trend = prior7Avg > 0 ? ((last7Avg - prior7Avg) / prior7Avg) * 100 : 0;

  return {
    tokenId,
    total14d,
    avgDaily: Math.round(total14d / 14),
    peakDay,
    trend: Math.round(trend * 10) / 10,
    timeseries,
  };
}

export const DEMO_SEARCH_INTENT: TokenSearchData[] = [
  buildSearchData("ondo", 4200, 0.6, 3),
  buildSearchData("bera", 3800, 0.5, 5),
  buildSearchData("ena", 3100, 0.4),
  buildSearchData("pendle", 2600, 0.3, 8),
  buildSearchData("arb", 2200, 0.2),
  buildSearchData("op", 1800, 0.15),
  buildSearchData("aero", 1500, 0.25),
  buildSearchData("mkr", 1200, 0.05),
  buildSearchData("eigen", 1000, 0.1),
  buildSearchData("crv", 800, -0.05),
  buildSearchData("gmx", 600, -0.1),
  buildSearchData("dydx", 400, -0.15),
];

export function getSearchData(tokenId: string): TokenSearchData | undefined {
  return DEMO_SEARCH_INTENT.find((d) => d.tokenId === tokenId);
}
