export interface BridgeVolumePoint {
  date: string;
  volume: number;
  txCount: number;
}

export interface TokenBridgeData {
  tokenId: string;
  total30d: number;
  total7d: number;
  avgDaily: number;
  trend: number; // percentage change 7d vs prior 7d
  timeseries: BridgeVolumePoint[];
}

function generateTimeseries(
  baseVolume: number,
  volatility: number,
  trendFactor: number,
  days: number = 30
): BridgeVolumePoint[] {
  const points: BridgeVolumePoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayProgress = (days - i) / days;
    const trendMultiplier = 1 + trendFactor * dayProgress;
    const noise = 1 + (Math.sin(i * 2.1) * 0.3 + Math.cos(i * 0.7) * 0.2) * volatility;
    const weekendDip = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;

    const volume = Math.round(baseVolume * trendMultiplier * noise * weekendDip);
    const txCount = Math.round(volume / (8000 + Math.random() * 4000));

    points.push({
      date: date.toISOString().split("T")[0],
      volume: Math.max(volume, 0),
      txCount: Math.max(txCount, 1),
    });
  }

  return points;
}

function buildBridgeData(
  tokenId: string,
  baseVolume: number,
  volatility: number,
  trendFactor: number
): TokenBridgeData {
  const timeseries = generateTimeseries(baseVolume, volatility, trendFactor);
  const total30d = timeseries.reduce((sum, p) => sum + p.volume, 0);
  const last7 = timeseries.slice(-7);
  const prior7 = timeseries.slice(-14, -7);
  const total7d = last7.reduce((sum, p) => sum + p.volume, 0);
  const prior7dTotal = prior7.reduce((sum, p) => sum + p.volume, 0);
  const trend = prior7dTotal > 0 ? ((total7d - prior7dTotal) / prior7dTotal) * 100 : 0;

  return {
    tokenId,
    total30d,
    total7d,
    avgDaily: Math.round(total30d / 30),
    trend: Math.round(trend * 10) / 10,
    timeseries,
  };
}

export const DEMO_BRIDGE_VOLUMES: TokenBridgeData[] = [
  buildBridgeData("ondo", 520000, 0.8, 0.4),
  buildBridgeData("bera", 410000, 0.9, 0.35),
  buildBridgeData("ena", 340000, 0.7, 0.25),
  buildBridgeData("pendle", 290000, 0.6, 0.2),
  buildBridgeData("arb", 250000, 0.5, 0.15),
  buildBridgeData("op", 210000, 0.5, 0.1),
  buildBridgeData("aero", 180000, 0.7, 0.18),
  buildBridgeData("mkr", 150000, 0.4, 0.05),
  buildBridgeData("eigen", 120000, 0.8, 0.12),
  buildBridgeData("crv", 95000, 0.5, -0.05),
  buildBridgeData("gmx", 70000, 0.6, -0.1),
  buildBridgeData("dydx", 50000, 0.5, -0.15),
];

export function getBridgeData(tokenId: string): TokenBridgeData | undefined {
  return DEMO_BRIDGE_VOLUMES.find((d) => d.tokenId === tokenId);
}
