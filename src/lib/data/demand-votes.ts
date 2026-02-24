const STORAGE_KEY = "tideshift-demand-votes";
const USER_VOTES_KEY = "tideshift-user-votes";

// Seed data — plausible vote counts so the page doesn't look empty
const SEED_VOTES: Record<string, number> = {
  "binancecoin": 134,
  "hyperliquid": 89,
  "uniswap": 72,
  "polkadot": 67,
  "aave": 58,
  "sui": 54,
  "tether-gold": 48,
  "pax-gold": 45,
  "pepe": 41,
  "mantra-dao": 38,
  "curve-dao-token": 35,
  "maker": 31,
  "arbitrum": 28,
  "optimism": 25,
  "eigenlayer": 22,
  "aerodrome-finance": 19,
  "gmx": 17,
  "dydx-chain": 15,
  "pendle": 12,
  "ethena": 10,
};

function getVoteCounts(): Record<string, number> {
  if (typeof window === "undefined") return { ...SEED_VOTES };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...SEED_VOTES };
    return JSON.parse(raw);
  } catch {
    return { ...SEED_VOTES };
  }
}

function getUserVotes(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(USER_VOTES_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function getVoteCount(coingeckoId: string): number {
  const counts = getVoteCounts();
  return counts[coingeckoId] ?? 0;
}

export function getAllVoteCounts(): Record<string, number> {
  return getVoteCounts();
}

export function hasUserVoted(coingeckoId: string): boolean {
  return getUserVotes().has(coingeckoId);
}

export function toggleVote(coingeckoId: string): { count: number; voted: boolean } {
  const counts = getVoteCounts();
  const userVotes = getUserVotes();

  if (userVotes.has(coingeckoId)) {
    // Remove vote
    counts[coingeckoId] = Math.max(0, (counts[coingeckoId] ?? 0) - 1);
    userVotes.delete(coingeckoId);
  } else {
    // Add vote
    counts[coingeckoId] = (counts[coingeckoId] ?? 0) + 1;
    userVotes.add(coingeckoId);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  localStorage.setItem(USER_VOTES_KEY, JSON.stringify(Array.from(userVotes)));

  return { count: counts[coingeckoId] ?? 0, voted: userVotes.has(coingeckoId) };
}
