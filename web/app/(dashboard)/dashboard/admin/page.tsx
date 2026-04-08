import { authedFetch } from '@/lib/server-fetch';
import { setUserRole } from './actions';

export const dynamic = 'force-dynamic';

interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  goal: string | null;
  createdAt: string;
}

interface AdminStats {
  users: number;
  coaches: number;
  workoutPlans: number;
  completedSessions: number;
}

async function load(search: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    const [usersRes, statsRes] = await Promise.all([
      authedFetch(`/admin/users?${params.toString()}`),
      authedFetch('/admin/stats'),
    ]);
    return {
      users: (await usersRes.json()) as AdminUser[],
      stats: (await statsRes.json()) as AdminStats,
      forbidden: false,
      error: null as string | null,
    };
  } catch (e) {
    const message = (e as Error).message;
    // server-fetch throws "API <status>: <body>" — sniff a 403 so we
    // can render a friendly "you don't have access" view instead of a
    // raw exception string.
    const forbidden = /^API 403/.test(message);
    return { users: [], stats: null, forbidden, error: message };
  }
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  padding: '1.25rem',
  borderRadius: 12,
};

const button: React.CSSProperties = {
  padding: '0.4rem 0.75rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 12,
};

const ghost: React.CSSProperties = {
  ...button,
  background: 'transparent',
  color: 'var(--fg)',
  border: '1px solid var(--border)',
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const { users, stats, forbidden, error } = await load(searchParams.search ?? '');
  if (forbidden) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>Admin</h1>
        <div style={{ ...card, marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>
            Admin role required
          </div>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>
            Your account doesn't have access to this page. Ask an existing
            admin to promote you (or use the API if you're the first user).
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Admin</h1>
      <p style={{ color: 'var(--muted)' }}>
        Promote users to coach or admin, browse the user table, and view
        platform totals. Requires the <code>admin</code> role.
      </p>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}

      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div style={card}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Users</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.users}</div>
          </div>
          <div style={card}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Coaches</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.coaches}</div>
          </div>
          <div style={card}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Workout plans</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.workoutPlans}</div>
          </div>
          <div style={card}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              Completed sessions
            </div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>
              {stats.completedSessions}
            </div>
          </div>
        </div>
      )}

      <form
        method="get"
        style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}
      >
        <input
          name="search"
          defaultValue={searchParams.search ?? ''}
          placeholder="Search by email or name"
          style={{
            flex: 1,
            padding: '0.6rem 0.75rem',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--fg)',
          }}
        />
        <button type="submit" style={ghost}>Filter</button>
      </form>

      <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
        {users.length === 0 && <p style={{ color: 'var(--muted)' }}>No users.</p>}
        {users.map((u) => (
          <div
            key={u.id}
            style={{ ...card, padding: '0.9rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{u.fullName ?? u.email}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                {u.email} · {u.role} · joined {u.createdAt.slice(0, 10)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['user', 'coach', 'admin'] as const).map((r) => (
                <form key={r} action={setUserRole.bind(null, u.id, r)}>
                  <button
                    type="submit"
                    style={u.role === r ? button : ghost}
                    disabled={u.role === r}
                  >
                    {r}
                  </button>
                </form>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
