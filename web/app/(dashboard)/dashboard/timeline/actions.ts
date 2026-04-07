'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function setTimelineStatus(itemId: string, status: string) {
  await authedFetch(`/schedule/${itemId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  revalidatePath('/dashboard/timeline');
  revalidatePath('/dashboard');
}
