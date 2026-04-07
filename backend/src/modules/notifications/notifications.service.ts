import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Stub for FCM/APNs delivery. Replace `send()` with firebase-admin
 * messaging.send() when credentials are configured.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerDevice(userId: string, fcmToken?: string, apnsToken?: string) {
    const existing = await this.prisma.notificationSettings.findUnique({
      where: { userId },
    });
    if (existing) {
      return this.prisma.notificationSettings.update({
        where: { userId },
        data: { fcmToken, apnsToken },
      });
    }
    return this.prisma.notificationSettings.create({
      data: { userId, fcmToken, apnsToken },
    });
  }

  async updateSettings(userId: string, data: Partial<{
    pushEnabled: boolean;
    mealReminder: boolean;
    supplementReminder: boolean;
    waterReminder: boolean;
    overdueReminder: boolean;
    advanceMinutes: number;
  }>) {
    return this.prisma.notificationSettings.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async send(userId: string, title: string, body: string) {
    // TODO: integrate firebase-admin
    this.logger.log(`[push:${userId}] ${title} — ${body}`);
  }
}
