'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Input, Button, Card } from '@/components/ui';
import { changePasswordAction, type ChangePasswordState } from './actions';

const initial: ChangePasswordState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} fullWidth>
      {pending ? 'Changing...' : 'Change password'}
    </Button>
  );
}

export default function ChangePasswordPage() {
  const [state, formAction] = useFormState(changePasswordAction, initial);

  return (
    <div style={{ maxWidth: 460 }}>
      <Link
        href="/dashboard/settings"
        style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
         Back to settings
      </Link>
      <div className="page-header" style={{ marginTop: '0.75rem' }}>
        <h1>Change password</h1>
        <p>After changing your password you will be signed out and need to log in again.</p>
      </div>

      <Card padding="1.5rem" style={{ borderRadius: 12 }}>
        <form action={formAction} style={{ display: 'grid', gap: '1rem' }}>
          <Input label="Current password" name="currentPassword" type="password" required autoComplete="current-password" />
          <Input label="New password" name="newPassword" type="password" required minLength={8} autoComplete="new-password" helperText="Must be at least 8 characters" />
          <Input label="Confirm new password" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />

          {state.error && <div className="error-banner" style={{ margin: 0 }}>{state.error}</div>}
          {state.success && (
            <p style={{ color: 'var(--green)', margin: 0, fontSize: 14 }}>
              Password changed successfully.
            </p>
          )}

          <SubmitButton />
        </form>
      </Card>
    </div>
  );
}
