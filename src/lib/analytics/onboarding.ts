export interface FunnelStep {
  step: number;
  name: string;
  visitors: number;
  conversionRate: number;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("tideshift-session");
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("tideshift-session", id);
  }
  return id;
}

export function trackStepCompletion(
  token: string,
  step: number,
  _stepName: string
): void {
  const sessionId = getSessionId();
  if (!sessionId) return;

  // Fire-and-forget POST to Redis-backed API
  fetch("/api/analytics/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, step, sessionId }),
  }).catch(() => {}); // Silent fail — analytics should never block UX
}
