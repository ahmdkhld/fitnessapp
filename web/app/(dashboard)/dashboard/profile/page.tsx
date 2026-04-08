import { authedFetch } from '@/lib/server-fetch';
import { updateUser, upsertProfile } from './actions';

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
      profile = (await profileRes.json()) as ProfileData | null;
    }
    return { user, profile, error: null };
  } catch (e) {
    return { user: null, profile: null, error: (e as Error).message };
  }
}

const input: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--fg)',
  width: '100%',
};

const label: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  color: 'var(--muted)',
  marginBottom: 4,
};

const btn: React.CSSProperties = {
  padding: '0.6rem 1.5rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 14,
};

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '1.25rem',
  marginBottom: '1.5rem',
};

export default async function ProfilePage() {
  const { user, profile, error } = await loadData();

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ marginTop: 0 }}>Profile</h1>
      <p style={{ color: 'var(--muted)' }}>
        View and update your account information.
      </p>
      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: '#3a1f1f',
            border: '1px solid #6a2a2a',
            borderRadius: 8,
            marginBottom: '1.5rem',
          }}
        >
          {error}
        </div>
      )}

      {user && (
        <>
          {/* Account info section */}
          <div style={card}>
            <h2 style={{ fontSize: '1.1rem', marginTop: 0 }}>Account</h2>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: '1rem' }}>
              {user.email} &middot; Member since{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <form
              action={updateUser}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}
            >
              <div>
                <span style={label}>Full name</span>
                <input
                  name="fullName"
                  defaultValue={user.fullName ?? ''}
                  placeholder="Full name"
                  style={input}
                />
              </div>
              <div>
                <span style={label}>Goal</span>
                <select name="goal" defaultValue={user.goal ?? ''} style={input}>
                  <option value="">-- select --</option>
                  <option value="fat_loss">Fat loss</option>
                  <option value="muscle_gain">Muscle gain</option>
                  <option value="general_health">General health</option>
                  <option value="performance">Athletic performance</option>
                </select>
              </div>
              <div>
                <span style={label}>Timezone</span>
                <input
                  name="timezone"
                  defaultValue={user.timezone}
                  placeholder="UTC"
                  style={input}
                />
              </div>
              <div>
                <span style={label}>Unit system</span>
                <select name="unitSystem" defaultValue={user.unitSystem} style={input}>
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                <button type="submit" style={btn}>
                  Save account
                </button>
              </div>
            </form>
          </div>

          {/* Body profile section */}
          <div style={card}>
            <h2 style={{ fontSize: '1.1rem', marginTop: 0 }}>Body profile</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0 }}>
              Each save creates a new snapshot so you can track changes over time.
            </p>
            <form
              action={upsertProfile}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}
            >
              <div>
                <span style={label}>Height (cm)</span>
                <input
                  name="heightCm"
                  type="number"
                  step="0.1"
                  defaultValue={profile?.heightCm ?? ''}
                  placeholder="170"
                  style={input}
                />
              </div>
              <div>
                <span style={label}>Weight (kg)</span>
                <input
                  name="weightKg"
                  type="number"
                  step="0.1"
                  defaultValue={profile?.weightKg ?? ''}
                  placeholder="75"
                  style={input}
                />
              </div>
              <div>
                <span style={label}>Body fat %</span>
                <input
                  name="bodyFatPct"
                  type="number"
                  step="0.1"
                  defaultValue={profile?.bodyFatPct ?? ''}
                  placeholder="15"
                  style={input}
                />
              </div>
              <div>
                <span style={label}>Waist (cm)</span>
                <input
                  name="waistCm"
                  type="number"
                  step="0.1"
                  defaultValue={profile?.waistCm ?? ''}
                  placeholder="80"
                  style={input}
                />
              </div>
              <div>
                <span style={label}>Date of birth</span>
                <input
                  name="dateOfBirth"
                  type="date"
                  defaultValue={profile?.dateOfBirth?.slice(0, 10) ?? ''}
                  style={input}
                />
              </div>
              <div>
                <span style={label}>Gender</span>
                <select name="gender" defaultValue={profile?.gender ?? ''} style={input}>
                  <option value="">-- select --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <span style={label}>Activity level</span>
                <select
                  name="activityLevel"
                  defaultValue={profile?.activityLevel ?? ''}
                  style={input}
                >
                  <option value="">-- select --</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly active</option>
                  <option value="moderately_active">Moderately active</option>
                  <option value="very_active">Very active</option>
                  <option value="extremely_active">Extremely active</option>
                </select>
              </div>
              <div>
                <span style={label}>Daily water goal (ml)</span>
                <input
                  name="dailyWaterGoalMl"
                  type="number"
                  defaultValue={profile?.dailyWaterGoalMl ?? 2500}
                  placeholder="2500"
                  style={input}
                />
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                <button type="submit" style={btn}>
                  Save profile
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
