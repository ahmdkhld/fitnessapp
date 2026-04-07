'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authedFetch } from '@/lib/server-fetch';

export async function startSession(workoutDayId: string) {
  const res = await authedFetch('/workout-sessions/start', {
    method: 'POST',
    body: JSON.stringify({ workoutDayId }),
  });
  const session = (await res.json()) as { id: string };
  redirect(`/dashboard/workouts/sessions/${session.id}/active`);
}

export async function addDay(planId: string, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const dayOfWeekRaw = String(formData.get('dayOfWeek') ?? '');
  if (!name) return;
  await authedFetch(`/workout-plans/${planId}/days`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      ...(dayOfWeekRaw ? { dayOfWeek: Number(dayOfWeekRaw) } : {}),
    }),
  });
  revalidatePath(`/dashboard/workouts/plans/${planId}`);
}

export async function removeDay(planId: string, dayId: string) {
  await authedFetch(`/workout-plans/days/${dayId}`, { method: 'DELETE' });
  revalidatePath(`/dashboard/workouts/plans/${planId}`);
}

export async function addExerciseToDay(
  planId: string,
  dayId: string,
  formData: FormData,
) {
  const exerciseId = String(formData.get('exerciseId') ?? '');
  if (!exerciseId) return;
  await authedFetch(`/workout-plans/days/${dayId}/exercises`, {
    method: 'POST',
    body: JSON.stringify({
      exerciseId,
      targetSets: Number(formData.get('targetSets') ?? 3),
      targetReps: String(formData.get('targetReps') ?? '') || undefined,
      targetWeightKg: formData.get('targetWeightKg')
        ? Number(formData.get('targetWeightKg'))
        : undefined,
      restSeconds: formData.get('restSeconds')
        ? Number(formData.get('restSeconds'))
        : undefined,
      progressionKg: formData.get('progressionKg')
        ? Number(formData.get('progressionKg'))
        : 0,
      supersetGroup: String(formData.get('supersetGroup') ?? '') || undefined,
    }),
  });
  revalidatePath(`/dashboard/workouts/plans/${planId}`);
}

export async function removeDayExercise(planId: string, rowId: string) {
  await authedFetch(`/workout-plans/day-exercises/${rowId}`, {
    method: 'DELETE',
  });
  revalidatePath(`/dashboard/workouts/plans/${planId}`);
}
