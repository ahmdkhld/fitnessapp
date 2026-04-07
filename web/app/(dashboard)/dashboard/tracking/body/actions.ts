'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function createBodyLog(formData: FormData) {
  const payload: Record<string, unknown> = {};
  for (const key of ['weightKg', 'waistCm', 'bodyFatPct', 'energyLevel'] as const) {
    const v = formData.get(key);
    if (v) payload[key] = Number(v);
  }
  const notes = String(formData.get('notes') ?? '').trim();
  if (notes) payload.notes = notes;
  if (Object.keys(payload).length === 0) return;
  await authedFetch('/body-logs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  revalidatePath('/dashboard/tracking/body');
}
