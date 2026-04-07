import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function load() {
  const token = getToken();
  if (!token) return { report: null, error: 'Not signed in' };
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 13 * 864e5).toISOString().slice(0, 10);
  try {
    return { report: await api.exportReport(token, from, to), error: null };
  } catch (e) {
    return { report: null, error: (e as Error).message };
  }
}

export default async function ExportPage() {
  const { report, error } = await load();
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Coach report (last 14 days)</h1>
      <p style={{ color: 'var(--muted)' }}>
        Download or print this JSON for sharing with a coach or doctor.
        Wire this up to a PDF generator in a later iteration.
      </p>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}
      {report && (
        <pre
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            padding: '1rem',
            borderRadius: 8,
            overflow: 'auto',
            maxHeight: '70vh',
          }}
        >
          {JSON.stringify(report, null, 2)}
        </pre>
      )}
    </div>
  );
}
