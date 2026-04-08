'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function updateUser(formData: FormData) {
  const payload: Record<string, unknown> = {};
  const fullName = String(formData.get('fullName') ?? '').trim();
  if (fullName) payload.fullName = fullName;
  const goal = String(formData.get('goal') ?? '').trim();
  if (goal) payload.goal = goal;
  const timezone = String(formData.get('timezone') ?? '').trim();
  if (timezone) payload.timezone = timezone;
  const unitSystem = String(formData.get('unitSystem') ?? '').trim();
  if (unitSystem) payload.unitSystem = unitSystem;
  if (Object.keys(payload).length === 0) return;
  await authedFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  revalidatePath('/dashboard/profile');
}

export async function upsertProfile(formData: FormData) {
  const payload: Record<string, unknown> = {};
  for (const key of ['heightCm', 'weightKg', 'bodyFatPct', 'waistCm', 'dailyWaterGoalMl'] as const) {
    const v = formData.get(key);
    if (v && String(v).trim()) payload[key] = Number(v);
  }
  const dob = String(formData.get('dateOfBirth') ?? '').trim();
  if (dob) payload.dateOfBirth = dob;
  const gender = String(formData.get('gender') ?? '').trim();
  if (gender) payload.gender = gender;
  const activityLevel = String(formData.get('activityLevel') ?? '').trim();
  if (activityLevel) payload.activityLevel = activityLevel;
  if (Object.keys(payload).length === 0) return;
  await authedFetch('/users/me/profile', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  revalidatePath('/dashboard/profile');
}
