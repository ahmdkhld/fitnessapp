/**
 * Strength calculators — kept as pure functions so they're trivial to
 * unit test and reuse on the mobile client too.
 */

/** Epley 1RM estimate, accurate for ≤10 reps. */
export function epley1rm(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

/** Brzycki 1RM — slightly more accurate in the 10-15 rep range. */
export function brzycki1rm(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps >= 37) return 0; // formula is undefined near 37+ reps
  return Math.round(((weightKg * 36) / (37 - reps)) * 10) / 10;
}

/** Pick the most accurate formula for the rep range. */
export function estimate1rm(weightKg: number, reps: number): number {
  if (reps <= 10) return epley1rm(weightKg, reps);
  return brzycki1rm(weightKg, reps);
}

/** Per-set volume in kg (weight × reps). */
export function setVolume(weightKg: number | null, reps: number | null): number {
  if (!weightKg || !reps) return 0;
  return weightKg * reps;
}

/** kg ↔ lbs */
export const kgToLbs = (kg: number): number => Math.round(kg * 2.20462 * 10) / 10;
export const lbsToKg = (lbs: number): number => Math.round((lbs / 2.20462) * 10) / 10;
