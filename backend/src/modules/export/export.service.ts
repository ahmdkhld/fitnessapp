import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Generates a coach/doctor-ready report over a date range.
 * Returns structured JSON; a later iteration can pipe this through
 * puppeteer/pdfkit to produce a styled PDF.
 */
@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async report(userId: string, from: Date, to: Date) {
    const [user, scheduleItems, waterLogs, bodyLogs, notes] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, fullName: true, goal: true },
      }),
      this.prisma.dailyScheduleItem.findMany({
        where: { userId, date: { gte: from, lte: to } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.waterLog.findMany({
        where: { userId, date: { gte: from, lte: to } },
      }),
      this.prisma.bodyLog.findMany({
        where: { userId, date: { gte: from, lte: to } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.dailyNote.findMany({
        where: { userId, date: { gte: from, lte: to } },
        orderBy: { date: 'asc' },
      }),
    ]);

    const completed = scheduleItems.filter((i) => i.status === 'completed').length;
    const total = scheduleItems.length;

    const adherenceByDay = new Map<string, { total: number; done: number }>();
    for (const it of scheduleItems) {
      const key = it.date.toISOString().slice(0, 10);
      const row = adherenceByDay.get(key) ?? { total: 0, done: 0 };
      row.total += 1;
      if (it.status === 'completed') row.done += 1;
      adherenceByDay.set(key, row);
    }

    const waterByDay = new Map<string, number>();
    for (const w of waterLogs) {
      const key = w.date.toISOString().slice(0, 10);
      waterByDay.set(key, (waterByDay.get(key) ?? 0) + w.amountMl);
    }

    return {
      user,
      period: { from, to },
      summary: {
        totalItems: total,
        completed,
        adherencePct: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
      dailyAdherence: Array.from(adherenceByDay.entries()).map(([date, row]) => ({
        date,
        total: row.total,
        completed: row.done,
        percentage: Math.round((row.done / row.total) * 100),
      })),
      dailyWaterMl: Array.from(waterByDay.entries()).map(([date, amount]) => ({
        date,
        amountMl: amount,
      })),
      bodyLogs: bodyLogs.map((b) => ({
        date: b.date,
        weightKg: b.weightKg,
        waistCm: b.waistCm,
        bodyFatPct: b.bodyFatPct,
        energyLevel: b.energyLevel,
        hungerLevel: b.hungerLevel,
        sleepQuality: b.sleepQuality,
      })),
      notes: notes.map((n) => ({
        date: n.date,
        mood: n.mood,
        symptoms: n.symptoms,
        notes: n.notes,
      })),
    };
  }
}
