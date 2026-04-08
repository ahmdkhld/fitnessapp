'use server';

import { api } from '@/lib/api';
import { getToken, clearTokenCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export interface ChangePasswordState {
  success?: boolean;
  error?: string;
}

export async function changePasswordAction(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All fields are required.' };
  }

  if (newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match.' };
  }

  if (currentPassword === newPassword) {
    return { error: 'New password must be different from your current password.' };
  }

  const token = getToken();
  if (!token) {
    redirect('/login');
  }

  try {
    await api.changePassword(token, currentPassword, newPassword);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.';
    if (message.includes('400') || message.includes('incorrect')) {
      return { error: 'Current password is incorrect.' };
    }
    return { error: message };
  }

  // Password changed successfully — all sessions are revoked, so sign the user out
  clearTokenCookies();
  redirect('/login');
}
