interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

export const TTL = {
  BRIDGE_DATA: 5 * 60 * 1000,
  MARKET_DATA: 2 * 60 * 1000,
  PRICE_HISTORY: 10 * 60 * 1000,
  SEARCH_DATA: 10 * 60 * 1000,
  SOCIAL_DATA: 15 * 60 * 1000,
  WALLET_DATA: 30 * 60 * 1000,
  PROTOCOLS: 60 * 60 * 1000,
  TOKEN_DISCOVERY: 60 * 60 * 1000,
  SCORECARDS: 5 * 60 * 1000,
} as const;

const MAX_ENTRIES = 500;

class ApiCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    if (this.store.size >= MAX_ENTRIES) {
      const entries = Array.from(this.store.entries());
      const oldest = entries.sort(
        (a, b) => a[1].createdAt - b[1].createdAt
      )[0];
      if (oldest) this.store.delete(oldest[0]);
    }

    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
      createdAt: Date.now(),
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

export const cache = new ApiCache();
