import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

/**
 * Server-side reminders for overdue items and stock warnings.
 * Local notifications on-device handle on-time reminders.
 */
@Injectable()
export class NotificationCron {
  private readonly logger = new Logger(NotificationCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifs: NotificationsService,
  ) {}

  /** Every 30 minutes — alert users whose items have been overdue by > 1h. */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkOverdue() {
    const now = new Date();
    const today = new Date(now);
    today.setUTCHours(0, 0, 0, 0);

    const overdue = await this.prisma.dailyScheduleItem.findMany({
      where: { date: today, status: 'pending' },
      take: 500,
    });

    const cutoffMs = 60 * 60 * 1000;
    const overdueByUser = new Map<string, number>();
    for (const item of overdue) {
      const scheduled = new Date(today);
      const time = new Date(item.scheduledTime);
      scheduled.setUTCHours(
        time.getUTCHours(),
        time.getUTCMinutes(),
        0,
        0,
      );
      if (now.getTime() - scheduled.getTime() > cutoffMs) {
        overdueByUser.set(item.userId, (overdueByUser.get(item.userId) ?? 0) + 1);
      }
    }

    const dateStr = today.toISOString().slice(0, 10);
    for (const [userId, count] of overdueByUser) {
      const settings = await this.prisma.notificationSettings.findUnique({
        where: { userId },
      });
      if (!settings?.overdueReminder || !settings.pushEnabled) continue;
      await this.notifs.send(
        userId,
        'Missed items',
        `You have ${count} overdue item${count > 1 ? 's' : ''} today.`,
        `${userId}:overdue::${dateStr}`,
      );
    }
    this.logger.log(`Overdue check: notified ${overdueByUser.size} users`);
  }

  /** Daily at 8pm — evening summary push. */
  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  async eveningSummary() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const users = await this.prisma.user.findMany({
      select: { id: true },
    });

    const dateStr = today.toISOString().slice(0, 10);
    for (const { id } of users) {
      const items = await this.prisma.dailyScheduleItem.findMany({
        where: { userId: id, date: today },
      });
      if (items.length === 0) continue;
      const done = items.filter((i) => i.status === 'completed').length;
      const pct = Math.round((done / items.length) * 100);
      await this.notifs.send(
        id,
        'Daily recap',
        `${done}/${items.length} completed (${pct}%). Great work!`,
        `${id}:recap::${dateStr}`,
      );
    }
  }

  /** Daily at 9am — stock running low alerts. */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async stockAlerts() {
    const low = await this.prisma.supplement.findMany({
      where: {
        stockQuantity: { not: null },
        plan: { isActive: true },
      },
      include: { plan: { select: { userId: true } } },
    });

    const dateStr = new Date().toISOString().slice(0, 10);
    for (const s of low) {
      if (s.stockQuantity != null && s.stockQuantity <= s.stockAlertAt) {
        await this.notifs.send(
          s.plan.userId,
          `${s.name} running low`,
          `${s.stockQuantity} servings remaining. Consider refilling.`,
          `${s.plan.userId}:stock:${s.id}:${dateStr}`,
        );
      }
    }
  }
}
