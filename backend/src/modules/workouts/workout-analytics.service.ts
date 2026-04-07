import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { estimate1rm, setVolume } from './calculators';

@Injectable()
export class WorkoutAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Total volume per week (or per day), grouped by primary muscle.
   * Returns a flat array of { date, muscle, volumeKg } rows the client
   * can pivot into whatever chart shape it needs.
   */
  async volume(
    userId: string,
    from: Date,
    to: Date,
    groupBy: 'day' | 'week' = 'week',
  ) {
    const sets = await this.prisma.workoutSet.findMany({
      where: {
        session: { userId, date: { gte: from, lte: to } },
        isWarmup: false,
      },
      include: {
        exercise: { select: { primaryMuscle: true } },
        session: { select: { date: true } },
      },
    });

    const buckets = new Map<string, number>();
    for (const set of sets) {
      if (set.weightKg == null || set.reps == null) continue;
      const muscle = set.exercise.primaryMuscle ?? 'other';
      const bucketKey = this.bucketKey(set.session.date, groupBy);
      const key = `${bucketKey}|${muscle}`;
      const add = setVolume(Number(set.weightKg), set.reps);
      buckets.set(key, (buckets.get(key) ?? 0) + add);
    }

    return Array.from(buckets.entries()).map(([key, volumeKg]) => {
      const [bucket, muscle] = key.split('|');
      return { bucket, muscle, volumeKg: Math.round(volumeKg) };
    });
  }

  /** All PRs for a user, newest-first, joined with exercise name. */
  prs(userId: string, limit = 50) {
    return this.prisma.personalRecord.findMany({
      where: { userId },
      orderBy: { achievedAt: 'desc' },
      take: limit,
      include: { exercise: true },
    });
  }

  /** Per-exercise history: one point per session, best set's estimated 1RM. */
  async exerciseHistory(userId: string, exerciseId: string, limit = 50) {
    const sets = await this.prisma.workoutSet.findMany({
      where: {
        session: { userId },
        exerciseId,
        isWarmup: false,
      },
      include: { session: { select: { date: true, id: true } } },
      orderBy: { loggedAt: 'asc' },
    });

    const perSession = new Map<
      string,
      { date: Date; topSet: { weightKg: number; reps: number; estimated1rm: number } }
    >();

    for (const s of sets) {
      if (s.weightKg == null || s.reps == null) continue;
      const weight = Number(s.weightKg);
      const est = estimate1rm(weight, s.reps);
      const existing = perSession.get(s.session.id);
      if (!existing || est > existing.topSet.estimated1rm) {
        perSession.set(s.session.id, {
          date: s.session.date,
          topSet: { weightKg: weight, reps: s.reps, estimated1rm: est },
        });
      }
    }

    return Array.from(perSession.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-limit);
  }

  /** Most recent estimated 1RM per exercise the user has trained. */
  async estimated1rmAll(userId: string) {
    const rows = await this.prisma.personalRecord.findMany({
      where: { userId, recordType: 'estimated_1rm' },
      orderBy: { achievedAt: 'desc' },
      include: { exercise: { select: { name: true, primaryMuscle: true } } },
    });
    const seen = new Set<string>();
    const unique: typeof rows = [];
    for (const r of rows) {
      if (seen.has(r.exerciseId)) continue;
      seen.add(r.exerciseId);
      unique.push(r);
    }
    return unique;
  }

  private bucketKey(date: Date, groupBy: 'day' | 'week'): string {
    if (groupBy === 'day') return date.toISOString().slice(0, 10);
    // ISO week start (Monday)
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    const day = d.getUTCDay() || 7; // Mon=1..Sun=7
    d.setUTCDate(d.getUTCDate() - (day - 1));
    return d.toISOString().slice(0, 10);
  }
}
