'use server';

import { revalidatePath } from 'next/cache';
import { authedFetch } from '@/lib/server-fetch';

export async function createSupplementPlan(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;
  await authedFetch('/supplement-plans', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  revalidatePath('/dashboard/supplements');
}

export async function activateSupplementPlan(id: string) {
  await authedFetch(`/supplement-plans/${id}/activate`, { method: 'POST' });
  revalidatePath('/dashboard/supplements');
}

export async function addSupplement(planId: string, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const time = String(formData.get('scheduledTime') ?? '08:00');
  const dosage = String(formData.get('dosage') ?? '').trim();
  const stock = formData.get('stockQuantity');
  if (!name) return;
  await authedFetch(`/supplement-plans/${planId}/supplements`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      scheduledTime: `${time}:00`,
      ...(dosage ? { dosage } : {}),
      ...(stock ? { stockQuantity: Number(stock) } : {}),
      frequency: 'daily',
    }),
  });
  revalidatePath('/dashboard/supplements');
}

export async function deleteSupplement(planId: string, suppId: string) {
  await authedFetch(`/supplement-plans/${planId}/supplements/${suppId}`, {
    method: 'DELETE',
  });
  revalidatePath('/dashboard/supplements');
}
