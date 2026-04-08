'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ImportPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('import');

  const parse = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/proxy/plan-parser/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Breakfast — 8:00\n40g oats, 1 scoop whey\n\nVitamin D3 5000 IU — 8:30 with food`}
        rows={14}
        className="input-field"
        style={{ fontFamily: 'monospace', fontSize: 13, resize: 'vertical', marginTop: '1rem' }}
      />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={parse}
          disabled={!text || loading}
          className="btn-primary"
          style={{ opacity: loading || !text ? 0.5 : 1 }}
        >
          
          {loading ? t('parsing') : t('parse')}
        </button>
      </div>
      {error && <div className="error-banner" style={{ marginTop: '1rem' }}>{error}</div>}
      {result && (
        <pre
          className="glass-card"
          style={{ marginTop: '1rem', overflow: 'auto', fontSize: 13, fontFamily: 'monospace' }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
