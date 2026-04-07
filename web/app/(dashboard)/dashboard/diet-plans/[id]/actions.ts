'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function createMeal(planId: string, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const time = String(formData.get('scheduledTime') ?? '08:00');
  const calories = formData.get('calories');
  const protein = formData.get('proteinG');
  const carbs = formData.get('carbsG');
  const fat = formData.get('fatG');
  if (!name) return;

  await authedFetch(`/diet-plans/${planId}/meals`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      scheduledTime: `${time}:00`,
      ...(calories ? { calories: Number(calories) } : {}),
      ...(protein ? { proteinG: Number(protein) } : {}),
      ...(carbs ? { carbsG: Number(carbs) } : {}),
      ...(fat ? { fatG: Number(fat) } : {}),
    }),
  });
  revalidatePath(`/dashboard/diet-plans/${planId}`);
}

export async function deleteMeal(planId: string, mealId: string) {
  await authedFetch(`/diet-plans/${planId}/meals/${mealId}`, {
    method: 'DELETE',
  });
  revalidatePath(`/dashboard/diet-plans/${planId}`);
}
