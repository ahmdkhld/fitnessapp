'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

function requireToken(): string {
  const token = getToken();
  if (!token) throw new Error('Not signed in');
  return token;
}

export async function createDietPlan(formData: FormData) {
  const token = requireToken();
  const name = String(formData.get('name') ?? '').trim();
  const goal = String(formData.get('goal') ?? '').trim();
  if (!name) return;
  const res = await fetch(
    `${process.env.API_BASE_URL ?? 'http://localhost:3000/api'}/diet-plans`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, goal: goal || undefined }),
      cache: 'no-store',
    },
  );
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  revalidatePath('/dashboard/diet-plans');
}

export async function activateDietPlan(id: string) {
  const token = requireToken();
  await fetch(
    `${process.env.API_BASE_URL ?? 'http://localhost:3000/api'}/diet-plans/${id}/activate`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );
  revalidatePath('/dashboard/diet-plans');
}

export async function deleteDietPlan(id: string) {
  const token = requireToken();
  await fetch(
    `${process.env.API_BASE_URL ?? 'http://localhost:3000/api'}/diet-plans/${id}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );
  revalidatePath('/dashboard/diet-plans');
}
