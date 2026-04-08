import Link from 'next/link';
import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { acceptInvite, inviteClient } from './actions';

export const dynamic = 'force-dynamic';

interface ClientLink {
  id: string;
  acceptedAt: string | null;
  client: { id: string; email: string; fullName: string | null; goal: string | null };
}

interface CoachLink {
  id: string;
  acceptedAt: string | null;
  coach: { id: string; email: string; fullName: string | null };
}

async function load() {
  try {
    const [clientsRes, coachesRes] = await Promise.all([
      authedFetch('/coach/clients').catch(() => null),
      authedFetch('/coach/coaches'),
    ]);
    const clients: ClientLink[] = clientsRes ? await clientsRes.json() : [];
    const coaches: CoachLink[] = await coachesRes.json();
    return { clients, coaches, error: null as string | null };
  } catch (e) {
    return { clients: [], coaches: [], error: (e as Error).message };
  }
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  padding: '1.25rem',
  borderRadius: 12,
};

const button: React.CSSProperties = {
  padding: '0.5rem 0.9rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

export default async function CoachPortalPage() {
  const { clients, coaches, error } = await load();
  const t = await getTranslations('coach');
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
      <p style={{ color: 'var(--muted)' }}>
        {t('description')}
      </p>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}

      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>{t('myClients')}</h2>
      <div style={{ ...card, marginBottom: '1rem' }}>
        <form action={inviteClient} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            name="email"
            type="email"
            placeholder={t('clientEmail')}
            required
            style={{
              flex: 1,
              padding: '0.6rem 0.75rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--fg)',
            }}
          />
          <button type="submit" style={button}>
            {t('invite')}
          </button>
        </form>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>
          {t('inviteNote')}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {clients.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>{t('noClients')}</p>
        )}
        {clients.map((link) => (
          <Link
            key={link.id}
            href={`/dashboard/coach/${link.client.id}`}
            style={{
              ...card,
              padding: '0.9rem 1.1rem',
              color: 'inherit',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>
                {link.client.fullName ?? link.client.email}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {link.client.goal ?? '—'}
              </div>
            </div>
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>
              {link.acceptedAt?.slice(0, 10) ?? t('pendingInvite')}
            </span>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>
        {t('coachingMe')}
      </h2>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {coaches.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>
            {t('noCoachInvites')}
          </p>
        )}
        {coaches.map((link) => (
          <div key={link.id} style={{ ...card, padding: '0.9rem 1.1rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  {link.coach.fullName ?? link.coach.email}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                  {link.acceptedAt ? t('activeStatus') : t('pendingInvite')}
                </div>
              </div>
              {!link.acceptedAt && (
                <form action={acceptInvite.bind(null, link.id)}>
                  <button type="submit" style={button}>
                    {t('accept')}
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
