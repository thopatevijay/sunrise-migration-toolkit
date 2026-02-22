const STORAGE_KEY = "tideshift-onboarding-analytics";

export interface StepEvent {
  token: string;
  step: number;
  stepName: string;
  timestamp: string;
  sessionId: string;
}

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

function getEvents(): StepEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: StepEvent[]): void {
  if (typeof window === "undefined") return;
  // Keep last 500 events max
  const trimmed = events.slice(-500);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function trackStepCompletion(
  token: string,
  step: number,
  stepName: string
): void {
  const events = getEvents();
  const sessionId = getSessionId();

  // Don't double-track same step in same session
  const exists = events.some(
    (e) => e.token === token && e.step === step && e.sessionId === sessionId
  );
  if (exists) return;

  events.push({
    token,
    step,
    stepName,
    timestamp: new Date().toISOString(),
    sessionId,
  });

  saveEvents(events);
}

export function getOnboardingFunnel(token?: string): FunnelStep[] {
  const events = getEvents();
  const filtered = token ? events.filter((e) => e.token === token) : events;

  const stepNames = ["Welcome", "Wallet", "Bridge", "Trade", "DeFi"];

  // Count unique sessions per step
  const sessionsPerStep = stepNames.map((name, i) => {
    const unique = new Set(
      filtered.filter((e) => e.step === i).map((e) => e.sessionId)
    );
    return unique.size;
  });

  // If no real data yet, return demo funnel
  const hasData = sessionsPerStep.some((s) => s > 0);
  if (!hasData) {
    const demoVisitors = [120, 78, 48, 36, 18];
    return stepNames.map((name, i) => ({
      step: i,
      name,
      visitors: demoVisitors[i],
      conversionRate: Math.round((demoVisitors[i] / demoVisitors[0]) * 100),
    }));
  }

  const baseVisitors = Math.max(1, sessionsPerStep[0]);
  return stepNames.map((name, i) => ({
    step: i,
    name,
    visitors: sessionsPerStep[i],
    conversionRate: Math.round((sessionsPerStep[i] / baseVisitors) * 100),
  }));
}
