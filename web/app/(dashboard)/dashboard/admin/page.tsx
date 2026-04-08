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
        <div className="page-header">
          <h1><i className="fa-solid fa-shield-halved" style={{ marginRight: 10, color: '#e07b5f' }} />{t('title')}</h1>
        </div>
        <div className="glass-card" style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('adminRoleRequired')}</div>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>{t('noAccessDesc')}</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="page-header">
        <h1><i className="fa-solid fa-shield-halved" style={{ marginRight: 10, color: 'var(--accent)' }} />{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      {error && <div className="error-banner">{error}</div>}

      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div className="stat-card">
            <div className="stat-accent" style={{ background: 'var(--accent)' }} />
            <div className="stat-label"><i className="fa-solid fa-users" style={{ marginRight: 6 }} />{t('users')}</div>
            <div className="stat-value">{stats.users}</div>
          </div>
          <div className="stat-card">
            <div className="stat-accent" style={{ background: 'var(--purple)' }} />
            <div className="stat-label"><i className="fa-solid fa-user-tie" style={{ marginRight: 6 }} />{t('coaches')}</div>
            <div className="stat-value">{stats.coaches}</div>
          </div>
          <div className="stat-card">
            <div className="stat-accent" style={{ background: 'var(--green)' }} />
            <div className="stat-label"><i className="fa-solid fa-dumbbell" style={{ marginRight: 6 }} />{t('workoutPlans')}</div>
            <div className="stat-value">{stats.workoutPlans}</div>
          </div>
          <div className="stat-card">
            <div className="stat-accent" style={{ background: '#d8a24a' }} />
            <div className="stat-label"><i className="fa-solid fa-check-double" style={{ marginRight: 6 }} />{t('completedSessions')}</div>
            <div className="stat-value">{stats.completedSessions}</div>
          </div>
        </div>
      )}

      <form method="get" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
        <input
          name="search"
          defaultValue={searchParams.search ?? ''}
          placeholder={t('searchPlaceholder')}
          className="input-field"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-outline">{tc('filter')}</button>
      </form>

      <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
        {users.length === 0 && <p style={{ color: 'var(--muted)' }}>{t('noUsers')}</p>}
        {users.map((u) => (
          <div key={u.id} className="list-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>
                <i className="fa-solid fa-user" style={{ marginRight: 8, color: 'var(--muted)', fontSize: 12 }} />
                {u.fullName ?? u.email}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 22 }}>
                {u.email} · {u.role} · {t('joined')} {u.createdAt.slice(0, 10)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['user', 'coach', 'admin'] as const).map((r) => (
                <form key={r} action={setUserRole.bind(null, u.id, r)}>
                  <button
                    type="submit"
                    className={u.role === r ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}
                    disabled={u.role === r}
                    style={u.role === r ? { opacity: 0.7, cursor: 'default' } : {}}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          {currentPage > 1 ? (
            <a
              href={`?${new URLSearchParams({
                ...(searchParams.search ? { search: searchParams.search } : {}),
                page: String(currentPage - 1),
              }).toString()}`}
              className="btn-outline"
              style={{ textDecoration: 'none' }}
            >
              {tc('back')}
            </a>
          ) : (
            <span className="btn-outline" style={{ opacity: 0.4, cursor: 'default' }}>{tc('back')}</span>
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
              className="btn-outline"
              style={{ textDecoration: 'none' }}
            >
              {tc('next')}
            </a>
          ) : (
            <span className="btn-outline" style={{ opacity: 0.4, cursor: 'default' }}>{tc('next')}</span>
          )}
        </div>
      )}
    </div>
  );
}
