import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Delivers push notifications via Firebase Cloud Messaging when
 * credentials are configured, and logs a debug message otherwise so
 * local development works without any Firebase setup.
 *
 * Expects `FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL` and `FCM_PRIVATE_KEY` in
 * the environment — the private key may contain literal `\n` which we
 * replace with real newlines before passing it to firebase-admin.
 */
@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private fcmEnabled = false;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    const projectId = process.env.FCM_PROJECT_ID;
    const clientEmail = process.env.FCM_CLIENT_EMAIL;
    const privateKey = process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      try {
        if (admin.apps.length === 0) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          });
        }
        this.fcmEnabled = true;
        this.logger.log('FCM messaging enabled');
      } catch (err) {
        this.logger.warn(
          `FCM init failed: ${(err as Error).message} — falling back to logger`,
        );
      }
    } else {
      this.logger.log('FCM credentials missing — push delivery will log only');
    }
  }

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

  async updateSettings(
    userId: string,
    data: Partial<{
      pushEnabled: boolean;
      mealReminder: boolean;
      supplementReminder: boolean;
      waterReminder: boolean;
      overdueReminder: boolean;
      advanceMinutes: number;
    }>,
  ) {
    return this.prisma.notificationSettings.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async send(userId: string, title: string, body: string) {
    const settings = await this.prisma.notificationSettings.findUnique({
      where: { userId },
    });
    if (!settings?.pushEnabled) return;

    if (!this.fcmEnabled || !settings.fcmToken) {
      this.logger.log(`[push:${userId}] ${title} — ${body}`);
      return;
    }

    try {
      await admin.messaging().send({
        token: settings.fcmToken,
        notification: { title, body },
        data: { userId, kind: 'reminder' },
      });
    } catch (err) {
      const code = (err as { code?: string }).code;
      this.logger.warn(`FCM send failed: ${(err as Error).message}`);
      if (
        code === 'messaging/registration-token-not-registered' ||
        code === 'messaging/invalid-registration-token'
      ) {
        await this.prisma.notificationSettings.update({
          where: { userId },
          data: { fcmToken: null },
        });
      }
    }
  }
}
