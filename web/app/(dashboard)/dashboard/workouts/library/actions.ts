'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function createExercise(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;
  await authedFetch('/exercises', {
    method: 'POST',
    body: JSON.stringify({
      name,
      category: String(formData.get('category') ?? '') || undefined,
      primaryMuscle: String(formData.get('primaryMuscle') ?? '') || undefined,
      equipment: String(formData.get('equipment') ?? '') || undefined,
      isCardio: formData.get('isCardio') === 'on',
      isUnilateral: formData.get('isUnilateral') === 'on',
    }),
  });
  revalidatePath('/dashboard/workouts/library');
}
