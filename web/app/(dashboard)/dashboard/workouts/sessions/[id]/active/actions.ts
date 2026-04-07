'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authedFetch } from '@/lib/server-fetch';

export async function logSetAction(sessionId: string, formData: FormData) {
  const exerciseId = String(formData.get('exerciseId') ?? '');
  const setNumber = Number(formData.get('setNumber') ?? 1);
  if (!exerciseId) return;

  const payload: Record<string, unknown> = {
    exerciseId,
    setNumber,
  };
  for (const key of ['reps', 'weightKg', 'rpe', 'durationSec', 'distanceKm'] as const) {
    const v = formData.get(key);
    if (v) payload[key] = Number(v);
  }

  await authedFetch(`/workout-sessions/${sessionId}/sets`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  revalidatePath(`/dashboard/workouts/sessions/${sessionId}/active`);
}

export async function deleteSetAction(sessionId: string, setId: string) {
  await authedFetch(`/workout-sessions/sets/${setId}`, { method: 'DELETE' });
  revalidatePath(`/dashboard/workouts/sessions/${sessionId}/active`);
}

export async function completeSessionAction(sessionId: string) {
  await authedFetch(`/workout-sessions/${sessionId}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
  redirect(`/dashboard/workouts/sessions/${sessionId}`);
}

export async function startSessionForDay(workoutDayId: string) {
  const res = await authedFetch('/workout-sessions/start', {
    method: 'POST',
    body: JSON.stringify({ workoutDayId }),
  });
  const session = (await res.json()) as { id: string };
  redirect(`/dashboard/workouts/sessions/${session.id}/active`);
}
