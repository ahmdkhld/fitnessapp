import { api, Insight } from '@/lib/api';
import { getToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function load(): Promise<{ insights: Insight[]; error: string | null }> {
  const token = getToken();
  if (!token) return { insights: [], error: 'Not signed in' };
  try {
    return { insights: await api.insights(token), error: null };
  } catch (e) {
    return { insights: [], error: (e as Error).message };
  }
}

const severityColor: Record<string, string> = {
  info: '#4a9d7e',
  warn: '#d8a24a',
  critical: '#e07b5f',
};

export default async function AnalyticsPage() {
  const { insights, error } = await load();
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Analytics & insights</h1>
      {error && <p style={{ color: 'var(--muted)' }}>{error}</p>}
      {insights.length === 0 && !error && (
        <p style={{ color: 'var(--muted)' }}>
          No insights yet — keep logging for at least a week.
        </p>
      )}
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.5rem' }}>
        {insights.map((i, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--card)',
              border: `1px solid ${severityColor[i.severity] ?? 'var(--border)'}`,
              borderLeftWidth: 4,
              padding: '1rem 1.25rem',
              borderRadius: 8,
            }}
          >
            <div style={{ fontWeight: 600 }}>{i.title}</div>
            <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
              {i.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
