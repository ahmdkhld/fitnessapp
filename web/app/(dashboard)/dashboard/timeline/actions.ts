'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authedFetch } from '@/lib/server-fetch';

export async function setTimelineStatus(itemId: string, status: string) {
  await authedFetch(`/schedule/${itemId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  revalidatePath('/dashboard/timeline');
  revalidatePath('/dashboard');
}

/**
 * Mirrors the mobile one-tap "start workout from the timeline" flow:
 * the workout item carries the workout day id in `referenceId`, we
 * post a new session and redirect into the live logger.
 */
export async function startWorkoutFromTimeline(workoutDayId: string) {
  const res = await authedFetch('/workout-sessions/start', {
    method: 'POST',
    body: JSON.stringify({ workoutDayId }),
  });
  const session = (await res.json()) as { id: string };
  redirect(`/dashboard/workouts/sessions/${session.id}/active`);
}
