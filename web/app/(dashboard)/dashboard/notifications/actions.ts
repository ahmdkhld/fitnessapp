'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function updateNotifications(formData: FormData) {
  const body = {
    pushEnabled: formData.get('pushEnabled') === 'on',
    mealReminder: formData.get('mealReminder') === 'on',
    supplementReminder: formData.get('supplementReminder') === 'on',
    waterReminder: formData.get('waterReminder') === 'on',
    overdueReminder: formData.get('overdueReminder') === 'on',
    advanceMinutes: Number(formData.get('advanceMinutes') ?? 5),
  };
  await authedFetch('/notifications/settings', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  revalidatePath('/dashboard/notifications');
}
