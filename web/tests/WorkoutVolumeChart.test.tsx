import { describe, it, expect } from 'vitest';
import { pivotVolume, VolumePoint } from '@/components/WorkoutVolumeChart';

describe('pivotVolume', () => {
  it('groups by bucket and sums per muscle', () => {
    const data: VolumePoint[] = [
      { bucket: '2026-04-01', muscle: 'chest', volumeKg: 1000 },
      { bucket: '2026-04-01', muscle: 'chest', volumeKg: 500 },
      { bucket: '2026-04-01', muscle: 'triceps', volumeKg: 300 },
      { bucket: '2026-04-08', muscle: 'chest', volumeKg: 1200 },
    ];
    const { rows, muscles } = pivotVolume(data);
    expect(rows).toHaveLength(2);
    expect(rows[0].bucket).toBe('2026-04-01');
    expect(rows[0].chest).toBe(1500);
    expect(rows[0].triceps).toBe(300);
    expect(rows[1].chest).toBe(1200);
    expect(muscles.sort()).toEqual(['chest', 'triceps']);
  });

  it('returns empty rows for empty input', () => {
    const { rows, muscles } = pivotVolume([]);
    expect(rows).toEqual([]);
    expect(muscles).toEqual([]);
  });

  it('keeps buckets sorted ascending by date string', () => {
    const data: VolumePoint[] = [
      { bucket: '2026-05-01', muscle: 'quads', volumeKg: 100 },
      { bucket: '2026-04-15', muscle: 'quads', volumeKg: 200 },
      { bucket: '2026-04-22', muscle: 'quads', volumeKg: 150 },
    ];
    const { rows } = pivotVolume(data);
    expect(rows.map((r) => r.bucket)).toEqual([
      '2026-04-15',
      '2026-04-22',
      '2026-05-01',
    ]);
  });
});
