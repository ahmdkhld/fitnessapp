import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
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

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminStats {
  users: number;
  coaches: number;
  workoutPlans: number;
  completedSessions: number;
}

async function load(search: string, page: number) {
  try {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', String(page));
    params.set('limit', '20');
    const [usersRes, statsRes] = await Promise.all([
      authedFetch(`/admin/users?${params.toString()}`),
      authedFetch('/admin/stats'),
    ]);
    const usersBody = await usersRes.json();
    return {
      users: usersBody.data as AdminUser[],
      meta: usersBody.meta as PaginationMeta,
      stats: (await statsRes.json()) as AdminStats,
      forbidden: false,
      error: null as string | null,
    };
  } catch (e) {
    const message = (e as Error).message;
    const forbidden = /^API 403/.test(message);
    return { users: [], meta: null, stats: null, forbidden, error: message };
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
  searchParams: { search?: string; page?: string };
}) {
  const t = await getTranslations('admin');
  const tc = await getTranslations('common');
  const currentPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);
  const { users, meta, stats, forbidden, error } = await load(
    searchParams.search ?? '',
    currentPage,
  );
  if (forbidden) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
        <div style={{ ...card, marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>
            {t('adminRoleRequired')}
          </div>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>
            {t('noAccessDesc')}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
      <p style={{ color: 'var(--muted)' }}>
        {t('description')}
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
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t('users')}</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.users}</div>
          </div>
          <div style={card}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t('coaches')}</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.coaches}</div>
          </div>
          <div style={card}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t('workoutPlans')}</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.workoutPlans}</div>
          </div>
          <div style={card}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              {t('completedSessions')}
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
          placeholder={t('searchPlaceholder')}
          style={{
            flex: 1,
            padding: '0.6rem 0.75rem',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--fg)',
          }}
        />
        <button type="submit" style={ghost}>{tc('filter')}</button>
      </form>

      <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
        {users.length === 0 && <p style={{ color: 'var(--muted)' }}>{t('noUsers')}</p>}
        {users.map((u) => (
          <div
            key={u.id}
            style={{ ...card, padding: '0.9rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{u.fullName ?? u.email}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                {u.email} · {u.role} · {t('joined')} {u.createdAt.slice(0, 10)}
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

      {meta && meta.totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          {currentPage > 1 ? (
            <a
              href={`?${new URLSearchParams({
                ...(searchParams.search ? { search: searchParams.search } : {}),
                page: String(currentPage - 1),
              }).toString()}`}
              style={{
                ...ghost,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              {tc('back')}
            </a>
          ) : (
            <span
              style={{ ...ghost, opacity: 0.4, cursor: 'default' }}
            >
              {tc('back')}
            </span>
          )}

          <span style={{ color: 'var(--muted)', fontSize: 13 }}>
            {meta.page} / {meta.totalPages} ({meta.total} {t('users').toLowerCase()})
          </span>

          {currentPage < meta.totalPages ? (
            <a
              href={`?${new URLSearchParams({
                ...(searchParams.search ? { search: searchParams.search } : {}),
                page: String(currentPage + 1),
              }).toString()}`}
              style={{
                ...ghost,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              {tc('next')}
            </a>
          ) : (
            <span
              style={{ ...ghost, opacity: 0.4, cursor: 'default' }}
            >
              {tc('next')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
