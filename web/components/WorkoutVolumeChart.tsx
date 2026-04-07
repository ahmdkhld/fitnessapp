'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

export interface VolumePoint {
  bucket: string;
  muscle: string;
  volumeKg: number;
}

/**
 * Pivots the flat volume rows into one bar per week, stacked by muscle
 * group. Uses a deterministic colour map so revisits look consistent.
 */
const MUSCLE_COLORS: Record<string, string> = {
  chest: '#2e7d5c',
  upper_chest: '#3aa473',
  lower_chest: '#1f5f44',
  lats: '#4a9d7e',
  mid_back: '#6db894',
  lower_back: '#8fc8ad',
  traps: '#9fd5bc',
  front_delts: '#e07b5f',
  side_delts: '#ea9b83',
  rear_delts: '#f5bba4',
  biceps: '#d8a24a',
  triceps: '#e4b968',
  forearms: '#efd089',
  quads: '#5f7dde',
  hamstrings: '#7b95e4',
  glutes: '#97adea',
  calves: '#b3c5f0',
  core: '#a467c2',
  obliques: '#b684d0',
  cardio: '#6ad1e0',
  full_body: '#888',
  other: '#aaa',
};

/**
 * Pure helper exposed for unit testing — same logic the chart runs at
 * render time. Sums volumes per (bucket, muscle), returns sorted bucket
 * rows + the unique muscle list.
 */
export function pivotVolume(data: VolumePoint[]) {
  const byBucket = new Map<string, Record<string, number | string>>();
  const musclesSeen = new Set<string>();
  for (const row of data) {
    const existing = byBucket.get(row.bucket) ?? { bucket: row.bucket };
    existing[row.muscle] = ((existing[row.muscle] as number) ?? 0) + row.volumeKg;
    byBucket.set(row.bucket, existing);
    musclesSeen.add(row.muscle);
  }
  const rows = Array.from(byBucket.values()).sort((a, b) =>
    (a.bucket as string).localeCompare(b.bucket as string),
  );
  return { rows, muscles: Array.from(musclesSeen).sort() };
}

export function WorkoutVolumeChart({ data }: { data: VolumePoint[] }) {
  const { rows, muscles } = pivotVolume(data);

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '1rem',
      }}
    >
      <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
        Weekly volume by muscle (kg)
      </div>
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a23" vertical={false} />
            <XAxis
              dataKey="bucket"
              stroke="#8a9e94"
              tickFormatter={(v: string) => v.slice(5)}
              fontSize={11}
            />
            <YAxis stroke="#8a9e94" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: '#111915',
                border: '1px solid #1e2a23',
                borderRadius: 6,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {muscles.map((m) => (
              <Bar
                key={m}
                dataKey={m}
                stackId="vol"
                fill={MUSCLE_COLORS[m] ?? '#888'}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
