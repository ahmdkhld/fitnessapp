'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authedFetch } from '@/lib/server-fetch';

export async function createWorkoutPlan(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;
  await authedFetch('/workout-plans', {
    method: 'POST',
    body: JSON.stringify({
      name,
      splitType: String(formData.get('splitType') ?? '') || undefined,
      daysPerWeek: formData.get('daysPerWeek')
        ? Number(formData.get('daysPerWeek'))
        : undefined,
      goal: String(formData.get('goal') ?? '') || undefined,
    }),
  });
  revalidatePath('/dashboard/workouts/plans');
}

export async function activateWorkoutPlan(id: string) {
  await authedFetch(`/workout-plans/${id}/activate`, { method: 'POST' });
  revalidatePath('/dashboard/workouts/plans');
  revalidatePath('/dashboard/workouts');
}

export async function deleteWorkoutPlan(id: string) {
  await authedFetch(`/workout-plans/${id}`, { method: 'DELETE' });
  revalidatePath('/dashboard/workouts/plans');
}

export async function cloneTemplateAction(templateId: string) {
  const res = await authedFetch(
    `/workout-plans/templates/${templateId}/clone`,
    { method: 'POST' },
  );
  const plan = await res.json();
  revalidatePath('/dashboard/workouts/plans');
  redirect(`/dashboard/workouts/plans/${plan.id}`);
}
