import { epley1rm, brzycki1rm, estimate1rm, setVolume, kgToLbs, lbsToKg } from './calculators';

describe('workout calculators', () => {
  it('Epley matches hand-computed values', () => {
    expect(epley1rm(100, 1)).toBe(100);
    expect(epley1rm(100, 5)).toBeCloseTo(116.7, 1);
    expect(epley1rm(100, 10)).toBeCloseTo(133.3, 1);
  });

  it('Brzycki matches hand-computed values', () => {
    expect(brzycki1rm(100, 5)).toBeCloseTo(112.5, 1);
    expect(brzycki1rm(80, 12)).toBeCloseTo(115.2, 1);
  });

  it('estimate1rm switches formulas across rep ranges', () => {
    expect(estimate1rm(100, 5)).toBe(epley1rm(100, 5));
    expect(estimate1rm(100, 12)).toBe(brzycki1rm(100, 12));
  });

  it('setVolume multiplies weight by reps', () => {
    expect(setVolume(100, 5)).toBe(500);
    expect(setVolume(null, 5)).toBe(0);
    expect(setVolume(100, null)).toBe(0);
  });

  it('converts kg ↔ lbs', () => {
    expect(kgToLbs(100)).toBeCloseTo(220.5, 1);
    expect(lbsToKg(220.5)).toBeCloseTo(100, 1);
  });
});
