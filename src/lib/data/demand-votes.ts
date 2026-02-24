const USER_ID_KEY = "tideshift-user-id";

/** Get or create a persistent anonymous user ID */
export function getUserId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

/** Fetch all vote counts from the server */
export async function fetchVoteCounts(): Promise<Record<string, number>> {
  try {
    const res = await fetch("/api/votes");
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

/** Fetch the set of coingeckoIds this user has voted for */
export async function fetchUserVotes(userId: string): Promise<Set<string>> {
  try {
    const res = await fetch(`/api/votes/user?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return new Set();
    const data = await res.json();
    return new Set(data.votes ?? []);
  } catch {
    return new Set();
  }
}

/** Toggle a vote via the API — returns new count and voted state */
export async function toggleVoteApi(
  coingeckoId: string,
  userId: string
): Promise<{ count: number; voted: boolean }> {
  const res = await fetch("/api/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coingeckoId, userId }),
  });

  if (!res.ok) {
    throw new Error("Failed to toggle vote");
  }

  return res.json();
}
