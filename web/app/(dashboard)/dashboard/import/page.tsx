'use client';

import { useState } from 'react';

export default function ImportPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <h1 style={{ marginTop: 0 }}>Import plan</h1>
      <p style={{ color: 'var(--muted)' }}>
        Paste your diet/supplement plan below. NutriTrack will parse meal
        headings, times, ingredients and supplement dosages for you to review.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Breakfast — 8:00\n40g oats, 1 scoop whey\n\nVitamin D3 5000 IU — 8:30 with food`}
        rows={14}
        style={{
          width: '100%',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          color: 'var(--fg)',
          padding: '1rem',
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: 13,
        }}
      />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={parse}
          disabled={!text || loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            opacity: loading || !text ? 0.5 : 1,
          }}
        >
          {loading ? 'Parsing…' : 'Parse'}
        </button>
      </div>
      {error && (
        <div style={{ marginTop: '1rem', color: '#e07b5f' }}>{error}</div>
      )}
      {result && (
        <pre
          style={{
            marginTop: '1rem',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            padding: '1rem',
            borderRadius: 8,
            overflow: 'auto',
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
