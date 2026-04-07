'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function inviteClient(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return;
  await authedFetch('/coach/invite', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  revalidatePath('/dashboard/coach');
}

export async function acceptInvite(linkId: string) {
  await authedFetch(`/coach/accept/${linkId}`, { method: 'POST' });
  revalidatePath('/dashboard/coach');
}
