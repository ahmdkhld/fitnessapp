'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function saveDailyNote(formData: FormData) {
  const notes = String(formData.get('notes') ?? '').trim();
  const mood = formData.get('mood');
  const symptomsRaw = String(formData.get('symptoms') ?? '').trim();

  const payload: Record<string, unknown> = {};
  if (notes) payload.notes = notes;
  if (mood) payload.mood = Number(mood);
  if (symptomsRaw) {
    try {
      payload.symptoms = JSON.parse(symptomsRaw);
    } catch {
      payload.symptoms = { freeform: symptomsRaw };
    }
  }
  if (Object.keys(payload).length === 0) return;
  await authedFetch('/daily-notes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  revalidatePath('/dashboard/tracking/notes');
}
