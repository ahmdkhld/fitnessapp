'use server';

import { redirect } from 'next/navigation';
import { authedFetch } from '@/lib/server-fetch';

export interface OnboardingPayload {
  goal: string;
  heightCm: number | null;
  weightKg: number | null;
  dateOfBirth: string;
  gender: string;
  activityLevel: string;
  unitSystem: string;
  timezone: string;
  dailyWaterGoalMl: number;
}

export async function submitOnboarding(payload: OnboardingPayload) {
  // 1. Update user record (goal, unitSystem, timezone)
  await authedFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({
      goal: payload.goal,
      unitSystem: payload.unitSystem,
      timezone: payload.timezone,
    }),
  });

  // 2. Upsert profile (body stats + water goal)
  const profileData: Record<string, unknown> = {
    gender: payload.gender,
    activityLevel: payload.activityLevel,
    dailyWaterGoalMl: payload.dailyWaterGoalMl,
  };
  if (payload.heightCm) profileData.heightCm = payload.heightCm;
  if (payload.weightKg) profileData.weightKg = payload.weightKg;
  if (payload.dateOfBirth) profileData.dateOfBirth = payload.dateOfBirth;

  await authedFetch('/users/me/profile', {
    method: 'POST',
    body: JSON.stringify(profileData),
  });

  redirect('/dashboard');
}

export async function checkProfileExists(): Promise<boolean> {
  try {
    const res = await authedFetch('/users/me/profile');
    const profile = await res.json();
    // If the profile has meaningful data, consider onboarding done
    return !!(profile && (profile.heightCm || profile.weightKg || profile.gender));
  } catch {
    return false;
  }
}
