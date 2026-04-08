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

export default async function CoachPortalPage() {
  const { clients, coaches, error } = await load();
  const t = await getTranslations('coach');
  return (
    <div>
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      {error && <div className="error-banner">{error}</div>}

      <h2 className="section-title">{t('myClients')}</h2>
      <div className="glass-card" style={{ marginBottom: '1rem' }}>
        <form action={inviteClient} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            name="email"
            type="email"
            placeholder={t('clientEmail')}
            required
            className="input-field"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary">
            {t('invite')}
          </button>
        </form>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>{t('inviteNote')}</p>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {clients.length === 0 && <p style={{ color: 'var(--muted)' }}>{t('noClients')}</p>}
        {clients.map((link) => (
          <Link
            key={link.id}
            href={`/dashboard/coach/${link.client.id}`}
            className="list-card"
            style={{ color: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>
                
                {link.client.fullName ?? link.client.email}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginLeft: 22 }}>{link.client.goal ?? '\u2014'}</div>
            </div>
            <span>
              {link.acceptedAt ? (
                <span className="badge-active">{link.acceptedAt.slice(0, 10)}</span>
              ) : (
                <span className="badge-pending">{t('pendingInvite')}</span>
              )}
            </span>
          </Link>
        ))}
      </div>

      <h2 className="section-title">{t('coachingMe')}</h2>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {coaches.length === 0 && <p style={{ color: 'var(--muted)' }}>{t('noCoachInvites')}</p>}
        {coaches.map((link) => (
          <div key={link.id} className="list-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>
                
                {link.coach.fullName ?? link.coach.email}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginLeft: 22 }}>
                {link.acceptedAt ? t('activeStatus') : t('pendingInvite')}
              </div>
            </div>
            {!link.acceptedAt && (
              <form action={acceptInvite.bind(null, link.id)}>
                <button type="submit" className="btn-success">{t('accept')}</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
