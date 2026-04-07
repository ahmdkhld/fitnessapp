import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface Insight {
  type:
    | 'pattern'
    | 'missed'
    | 'stock'
    | 'hydration'
    | 'positive'
    | 'workout_missed'
    | 'workout_stagnation'
    | 'workout_pr';
  severity: 'info' | 'warn' | 'critical';
  title: string;
  detail: string;
}

/**
 * Rule-based insights — looks at the last 14 days of schedule items, water,
 * body logs and stock counts to surface actionable patterns.
 */
@Injectable()
export class InsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async forUser(userId: string): Promise<Insight[]> {
    const insights: Insight[] = [];
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 13);
    since.setUTCHours(0, 0, 0, 0);

    const items = await this.prisma.dailyScheduleItem.findMany({
      where: { userId, date: { gte: since } },
    });

    // Frequently missed meal
    const missedByTitle = new Map<string, number>();
    for (const it of items) {
      if (it.status === 'skipped' || (it.status === 'pending' && it.date < new Date())) {
        missedByTitle.set(it.title, (missedByTitle.get(it.title) ?? 0) + 1);
      }
    }
    for (const [title, count] of missedByTitle) {
      if (count >= 5) {
        insights.push({
          type: 'missed',
          severity: 'warn',
          title: `"${title}" is often missed`,
          detail: `Missed ${count} times in the last 14 days. Consider rescheduling or reducing frequency.`,
        });
      }
    }

    // Low adherence
    const total = items.length;
    const done = items.filter((i) => i.status === 'completed').length;
    if (total > 20 && done / total < 0.6) {
      insights.push({
        type: 'pattern',
        severity: 'warn',
        title: 'Adherence below 60%',
        detail: `You completed ${done}/${total} items over the last 14 days. Try moving low-priority items to fewer days.`,
      });
    } else if (total > 20 && done / total >= 0.9) {
      insights.push({
        type: 'positive',
        severity: 'info',
        title: 'Excellent adherence',
        detail: `${Math.round((done / total) * 100)}% completion in the last 14 days — keep it up!`,
      });
    }

    // Stock alerts
    const supplements = await this.prisma.supplement.findMany({
      where: { plan: { userId, isActive: true } },
    });
    for (const s of supplements) {
      if (s.stockQuantity != null && s.stockQuantity <= s.stockAlertAt) {
        insights.push({
          type: 'stock',
          severity: s.stockQuantity === 0 ? 'critical' : 'warn',
          title: `${s.name} is running low`,
          detail: `${s.stockQuantity} servings remaining.`,
        });
      }
    }

    // Hydration
    const waterLogs = await this.prisma.waterLog.findMany({
      where: { userId, date: { gte: since } },
    });
    const byDay = new Map<string, number>();
    for (const w of waterLogs) {
      const k = w.date.toISOString().slice(0, 10);
      byDay.set(k, (byDay.get(k) ?? 0) + w.amountMl);
    }
    const profile = await this.prisma.userProfile.findFirst({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
    });
    const target = profile?.dailyWaterGoalMl ?? 2500;
    const daysUnder = Array.from(byDay.values()).filter((v) => v < target * 0.7).length;
    if (daysUnder >= 5) {
      insights.push({
        type: 'hydration',
        severity: 'warn',
        title: 'Hydration below target',
        detail: `${daysUnder} days in the last 14 were under 70% of your ${target}ml goal.`,
      });
    }

    // ===== Workout rules =====

    // 1. Missed workouts: active plan prescribes ≥ N days, user logged < 50%.
    const activePlan = await this.prisma.workoutPlan.findFirst({
      where: { userId, isActive: true },
      select: { daysPerWeek: true, name: true },
    });
    if (activePlan?.daysPerWeek) {
      const sessionsInWindow = await this.prisma.workoutSession.count({
        where: {
          userId,
          status: 'completed',
          date: { gte: since },
        },
      });
      const expected = activePlan.daysPerWeek * 2; // 14-day window
      if (sessionsInWindow < expected * 0.5) {
        insights.push({
          type: 'workout_missed',
          severity: 'warn',
          title: 'Workout frequency is slipping',
          detail:
            `Completed ${sessionsInWindow}/${expected} sessions for "${activePlan.name}" ` +
            `over the last 14 days.`,
        });
      } else if (sessionsInWindow >= expected) {
        insights.push({
          type: 'positive',
          severity: 'info',
          title: 'On track with workouts',
          detail: `${sessionsInWindow} sessions logged — keep it up!`,
        });
      }
    }

    // 2. Stagnation: primary lift hasn't hit a new estimated-1RM PR in 4+ weeks.
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setUTCDate(fourWeeksAgo.getUTCDate() - 28);
    const recentPRs = await this.prisma.personalRecord.groupBy({
      by: ['exerciseId'],
      where: {
        userId,
        recordType: 'estimated_1rm',
        achievedAt: { gte: fourWeeksAgo },
      },
    });
    const recentlyTrainedIds = (
      await this.prisma.workoutSet.findMany({
        where: { session: { userId }, loggedAt: { gte: fourWeeksAgo } },
        select: { exerciseId: true },
        distinct: ['exerciseId'],
        take: 50,
      })
    ).map((s) => s.exerciseId);

    const stagnantIds = recentlyTrainedIds.filter(
      (id) => !recentPRs.some((pr) => pr.exerciseId === id),
    );
    if (stagnantIds.length > 0) {
      const stagnantExercises = await this.prisma.exercise.findMany({
        where: { id: { in: stagnantIds.slice(0, 3) } },
        select: { name: true },
      });
      if (stagnantExercises.length > 0) {
        insights.push({
          type: 'workout_stagnation',
          severity: 'info',
          title: 'Lifts stagnating',
          detail:
            `No new estimated 1RM PR in 4 weeks for ` +
            stagnantExercises.map((e) => e.name).join(', ') +
            '. Consider a deload or switching the rep range.',
        });
      }
    }

    // 3. Celebrate PRs from the last 7 days.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    const freshPRs = await this.prisma.personalRecord.count({
      where: { userId, achievedAt: { gte: sevenDaysAgo } },
    });
    if (freshPRs > 0) {
      insights.push({
        type: 'workout_pr',
        severity: 'info',
        title: `${freshPRs} new PR${freshPRs === 1 ? '' : 's'} this week`,
        detail: 'Progressive overload is working — nice work.',
      });
    }

    return insights;
  }
}
