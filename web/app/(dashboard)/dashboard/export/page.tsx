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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="page-header">
          <h1><i className="fa-solid fa-file-export" style={{ marginRight: 10, color: 'var(--green)' }} />{t('title')}</h1>
          <p>{t('description')}</p>
        </div>
        <a href={pdfHref} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <i className="fa-solid fa-file-pdf" />{t('downloadPdf')}
        </a>
      </div>
      {error && <div className="error-banner" style={{ marginTop: '1rem' }}>{error}</div>}
      {report && (
        <pre
          className="glass-card"
          style={{ marginTop: '1.5rem', overflow: 'auto', maxHeight: '70vh', fontSize: 13, fontFamily: 'monospace' }}
        >
          {JSON.stringify(report, null, 2)}
        </pre>
      )}
    </div>
  );
}
