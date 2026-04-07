'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function logWater(formData: FormData) {
  const amountMl = Number(formData.get('amountMl') ?? 0);
  if (!amountMl) return;
  await authedFetch('/water', {
    method: 'POST',
    body: JSON.stringify({ amountMl }),
  });
  revalidatePath('/dashboard/tracking/water');
}
