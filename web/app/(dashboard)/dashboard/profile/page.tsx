import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { updateUser, upsertProfile } from './actions';
import { Card, Button, Input, Select } from '@/components/ui';

export const dynamic = 'force-dynamic';

interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  goal: string | null;
  timezone: string;
  unitSystem: string;
  createdAt: string;
}

interface ProfileData {
  id: string;
  heightCm: number | null;
  weightKg: number | null;
  bodyFatPct: number | null;
  waistCm: number | null;
  dateOfBirth: string | null;
  gender: string | null;
  activityLevel: string | null;
  dailyWaterGoalMl: number;
}

async function loadData(): Promise<{
  user: UserData | null;
  profile: ProfileData | null;
  error: string | null;
}> {
  try {
    const [userRes, profileRes] = await Promise.all([
      authedFetch('/users/me'),
      authedFetch('/users/me/profile').catch(() => null),
    ]);
    const user = (await userRes.json()) as UserData;
    let profile: ProfileData | null = null;
    if (profileRes && profileRes.ok) {
      const text = await profileRes.text();
      if (text) {
        try { profile = JSON.parse(text) as ProfileData; } catch { /* empty body */ }
      }
    }
    return { user, profile, error: null };
  } catch (e) {
    return { user: null, profile: null, error: (e as Error).message };
  }
}

export default async function ProfilePage() {
  const { user, profile, error } = await loadData();
  const t = await getTranslations('profile');

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h1><i className="fa-solid fa-user-circle" style={{ marginRight: 10, color: 'var(--accent)' }} />{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      {error && <div className="error-banner">{error}</div>}

      {user && (
        <>
          <Card title={t('account')} style={{ marginBottom: '1.5rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: '1rem', marginTop: '-0.5rem' }}>
              {user.email} &middot; {t('memberSince')}{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <form
              action={updateUser}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}
            >
              <Input label={t('fullName')} name="fullName" defaultValue={user.fullName ?? ''} placeholder={t('fullName')} />
              <Select label={t('goal')} name="goal" defaultValue={user.goal ?? ''}>
                <option value="">{t('selectGoal')}</option>
                <option value="fat_loss">{t('fatLoss')}</option>
                <option value="muscle_gain">{t('muscleGain')}</option>
                <option value="general_health">{t('generalHealth')}</option>
                <option value="performance">{t('performance')}</option>
              </Select>
              <Input label={t('timezone')} name="timezone" defaultValue={user.timezone} placeholder="UTC" />
              <Select label={t('unitSystem')} name="unitSystem" defaultValue={user.unitSystem}>
                <option value="metric">{t('metric')}</option>
                <option value="imperial">{t('imperial')}</option>
              </Select>
              <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                <Button type="submit">{t('saveAccount')}</Button>
              </div>
            </form>
          </Card>

          <Card title={t('bodyProfile')} subtitle={t('bodyProfileDesc')}>
            <form
              action={upsertProfile}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}
            >
              <Input label={t('heightCm')} name="heightCm" type="number" step="0.1" defaultValue={profile?.heightCm ?? ''} placeholder="170" />
              <Input label={t('weightKg')} name="weightKg" type="number" step="0.1" defaultValue={profile?.weightKg ?? ''} placeholder="75" />
              <Input label={t('bodyFatPct')} name="bodyFatPct" type="number" step="0.1" defaultValue={profile?.bodyFatPct ?? ''} placeholder="15" />
              <Input label={t('waistCm')} name="waistCm" type="number" step="0.1" defaultValue={profile?.waistCm ?? ''} placeholder="80" />
              <Input label={t('dateOfBirth')} name="dateOfBirth" type="date" defaultValue={profile?.dateOfBirth?.slice(0, 10) ?? ''} />
              <Select label={t('gender')} name="gender" defaultValue={profile?.gender ?? ''}>
                <option value="">{t('selectGoal')}</option>
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
                <option value="other">{t('other')}</option>
              </Select>
              <Select label={t('activityLevel')} name="activityLevel" defaultValue={profile?.activityLevel ?? ''}>
                <option value="">{t('selectGoal')}</option>
                <option value="sedentary">{t('sedentary')}</option>
                <option value="lightly_active">{t('lightlyActive')}</option>
                <option value="moderately_active">{t('moderatelyActive')}</option>
                <option value="very_active">{t('veryActive')}</option>
                <option value="extremely_active">{t('extremelyActive')}</option>
              </Select>
              <Input label={t('dailyWaterGoal')} name="dailyWaterGoalMl" type="number" defaultValue={profile?.dailyWaterGoalMl ?? 2500} placeholder="2500" />
              <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                <Button type="submit">{t('saveProfile')}</Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
