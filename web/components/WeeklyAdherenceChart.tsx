'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export interface AdherenceDatum {
  date: string;
  percentage: number;
}

export function WeeklyAdherenceChart({ data }: { data: AdherenceDatum[] }) {
  return (
    <div style={{ height: 260, background: 'var(--card)', borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
        Daily adherence %
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid stroke="#1e2a23" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" stroke="#8a9e94" fontSize={11} />
          <YAxis
            stroke="#8a9e94"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            fontSize={11}
          />
          <Tooltip
            contentStyle={{
              background: '#111915',
              border: '1px solid #1e2a23',
              borderRadius: 6,
            }}
            formatter={(v) => [`${v}%`, 'Adherence']}
          />
          <Bar dataKey="percentage" fill="#2e7d5c" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
