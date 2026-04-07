import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface Insight {
  type: 'pattern' | 'missed' | 'stock' | 'hydration' | 'positive';
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

    return insights;
  }
}
