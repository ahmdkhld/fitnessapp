import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async adherence(userId: string, days = 7) {
    const from = new Date();
    from.setUTCHours(0, 0, 0, 0);
    from.setUTCDate(from.getUTCDate() - (days - 1));

    const items = await this.prisma.dailyScheduleItem.findMany({
      where: { userId, date: { gte: from } },
      select: { date: true, status: true, itemType: true },
    });

    const total = items.length;
    const completed = items.filter((i) => i.status === 'completed').length;
    const skipped = items.filter((i) => i.status === 'skipped').length;
    const pending = items.filter((i) => i.status === 'pending').length;

    const perType = ['meal', 'supplement', 'water'].map((type) => {
      const t = items.filter((i) => i.itemType === type);
      const c = t.filter((i) => i.status === 'completed').length;
      return {
        type,
        total: t.length,
        completed: c,
        percentage: t.length > 0 ? Math.round((c / t.length) * 100) : 0,
      };
    });

    return {
      periodDays: days,
      total,
      completed,
      skipped,
      pending,
      overallPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      perType,
    };
  }

  async streak(userId: string) {
    const items = await this.prisma.dailyScheduleItem.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { date: true, status: true },
    });

    const byDay = new Map<string, { total: number; done: number }>();
    for (const i of items) {
      const key = i.date.toISOString().slice(0, 10);
      const row = byDay.get(key) ?? { total: 0, done: 0 };
      row.total += 1;
      if (i.status === 'completed') row.done += 1;
      byDay.set(key, row);
    }

    let streak = 0;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      const row = byDay.get(key);
      if (!row) break;
      if (row.done / row.total >= 0.8) streak += 1;
      else break;
    }
    return { currentStreak: streak };
  }
}
