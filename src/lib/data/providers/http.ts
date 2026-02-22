export interface FetchResult<T> {
  data: T | null;
  status: number;
  error?: string;
}

export async function fetchJson<T>(
  url: string,
  options?: {
    headers?: Record<string, string>;
    method?: string;
    body?: string;
    timeoutMs?: number;
    retries?: number;
  }
): Promise<FetchResult<T>> {
  const { headers, method = "GET", body, timeoutMs = 10_000, retries = 1 } = options ?? {};

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          ...headers,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body,
        signal: controller.signal,
        next: { revalidate: 0 },
      } as RequestInit);

      clearTimeout(timeout);

      if (!res.ok) {
        if (res.status >= 500 && attempt < retries) {
          await delay(1000 * (attempt + 1));
          continue;
        }
        return { data: null, status: res.status, error: `HTTP ${res.status}` };
      }

      const data = (await res.json()) as T;
      return { data, status: res.status };
    } catch (err) {
      clearTimeout(timeout);
      if (attempt < retries) {
        await delay(1000 * (attempt + 1));
        continue;
      }
      const message = err instanceof Error ? err.message : "Unknown error";
      return { data: null, status: 0, error: message };
    }
  }

  return { data: null, status: 0, error: "Max retries exceeded" };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
