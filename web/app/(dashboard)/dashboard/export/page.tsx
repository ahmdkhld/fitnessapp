import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';

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
  const t = await getTranslations('export');
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 13 * 864e5).toISOString().slice(0, 10);
  const pdfHref = `/api/proxy/export/report.pdf?from=${from}&to=${to}`;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={pdfHref}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            {t('downloadPdf')}
          </a>
        </div>
      </div>
      <p style={{ color: 'var(--muted)' }}>
        {t('description')}
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
