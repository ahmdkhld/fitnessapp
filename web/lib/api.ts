const BASE =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:3000/api';

export interface AdherenceSummary {
  periodDays: number;
  total: number;
  completed: number;
  skipped: number;
  pending: number;
  overallPercentage: number;
  perType: Array<{
    type: string;
    total: number;
    completed: number;
    percentage: number;
  }>;
}

export interface ScheduleItem {
  id: string;
  itemType: 'meal' | 'supplement' | 'workout';
  /** FK back to the underlying meal / supplement / workout day. */
  referenceId: string | null;
  title: string;
  subtitle: string | null;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'skipped' | 'snoozed' | 'partial';
}

export interface Insight {
  type: string;
  severity: 'info' | 'warn' | 'critical';
  title: string;
  detail: string;
}

export interface DietPlan {
  id: string;
  name: string;
  goal: string | null;
  description: string | null;
  isActive: boolean;
}

export interface SupplementPlan {
  id: string;
  name: string;
  isActive: boolean;
  supplements: Array<{
    id: string;
    name: string;
    dosage: string | null;
    scheduledTime: string;
    stockQuantity: number | null;
  }>;
}

export interface Exercise {
  id: string;
  userId: string | null;
  name: string;
  category: string | null;
  primaryMuscle: string | null;
  equipment: string | null;
  isCardio: boolean;
  isUnilateral: boolean;
}

export interface WorkoutDayExercise {
  id: string;
  exerciseId: string;
  targetSets: number;
  targetReps: string | null;
  targetWeightKg: number | null;
  restSeconds: number | null;
  supersetGroup: string | null;
  progressionKg: number;
  exercise: Exercise;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayOfWeek: number | null;
  estimatedDurationMin: number | null;
  exercises: WorkoutDayExercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: string | null;
  splitType: string | null;
  daysPerWeek: number | null;
  description: string | null;
  isActive: boolean;
  isTemplate: boolean;
  days: WorkoutDay[];
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  durationSec: number | null;
  distanceKm: number | null;
  exercise?: Exercise;
}

export interface WorkoutSession {
  id: string;
  date: string;
  status: string;
  durationMin: number | null;
  day: { name: string; plan: { name: string } } | null;
  sets: WorkoutSet[];
}

export interface PersonalRecord {
  id: string;
  exercise: Exercise;
  recordType: string;
  value: number;
  unit: string;
  achievedAt: string;
}

async function request<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...rest } = init;
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers ?? {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  adherence: (token: string, period: 'week' | 'month' = 'week') =>
    request<AdherenceSummary>(`/analytics/adherence?period=${period}`, { token }),
  streak: (token: string) =>
    request<{ currentStreak: number }>(`/analytics/streaks`, { token }),
  insights: (token: string) =>
    request<Insight[]>(`/analytics/insights`, { token }),
  schedule: (token: string, date: string) =>
    request<ScheduleItem[]>(`/schedule?date=${date}`, { token }),
  updateScheduleStatus: (token: string, id: string, status: string) =>
    request<ScheduleItem>(`/schedule/${id}/status`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status }),
    }),
  dietPlans: (token: string) =>
    request<DietPlan[]>(`/diet-plans`, { token }),
  supplementPlans: (token: string) =>
    request<SupplementPlan[]>(`/supplement-plans`, { token }),
  exportReport: (token: string, from: string, to: string) =>
    request<{
      dailyAdherence: Array<{ date: string; percentage: number; total: number; completed: number }>;
      dailyWaterMl: Array<{ date: string; amountMl: number }>;
      bodyLogs: Array<Record<string, unknown>>;
      summary: { totalItems: number; completed: number; adherencePct: number };
    }>(`/export/report?from=${from}&to=${to}`, { token }),
  parseText: (token: string, text: string) =>
    request<{ id: string; parsedData: unknown }>(`/plan-parser/upload`, {
      method: 'POST',
      token,
      body: JSON.stringify({ text }),
    }),
  confirmParsed: (token: string, id: string, name: string) =>
    request<Record<string, unknown>>(`/plan-parser/${id}/confirm`, {
      method: 'POST',
      token,
      body: JSON.stringify({ name }),
    }),
  login: (email: string, password: string) =>
    request<{ accessToken: string; refreshToken: string }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  changePassword: (token: string, currentPassword: string, newPassword: string) =>
    request<{ success: boolean }>(`/auth/change-password`, {
      method: 'POST',
      token,
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};
