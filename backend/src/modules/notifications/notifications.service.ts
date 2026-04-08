import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from '../../prisma/prisma.service';
import { WsGateway } from '../ws/ws.gateway';

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

  /**
   * In-memory deduplication cache.
   * Key format: `${userId}:${type}:${referenceId}:${dateString}`
   * Value: timestamp when the entry was added.
   */
  private readonly dedupeCache = new Map<string, number>();
  private static readonly DEDUPE_TTL_MS = 60 * 60 * 1000; // 1 hour

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly wsGateway?: WsGateway,
  ) {}

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

  /**
   * Send a push notification to a user.
   *
   * @param userId   Target user ID
   * @param title    Notification title
   * @param body     Notification body
   * @param dedupeKey  Optional deduplication key. When provided, duplicate
   *                   notifications with the same key within the TTL window
   *                   (1 hour) will be suppressed.
   * @param type     Notification category (overdue, recap, stock, custom).
   *                 Defaults to 'custom'.
   */
  async send(
    userId: string,
    title: string,
    body: string,
    dedupeKey?: string,
    type: string = 'custom',
  ) {
    // --- Deduplication check ---
    if (dedupeKey) {
      this.pruneDedupeCache();
      if (this.dedupeCache.has(dedupeKey)) {
        this.logger.debug(`[dedup] Suppressed duplicate notification: ${dedupeKey}`);
        return;
      }
    }

    const settings = await this.prisma.notificationSettings.findUnique({
      where: { userId },
      include: { user: { select: { timezone: true } } },
    });
    if (!settings?.pushEnabled) return;

    // --- Quiet hours check ---
    if (this.isWithinQuietHours(settings.quietStart, settings.quietEnd, (settings as any).user?.timezone)) {
      this.logger.debug(
        `[quiet-hours] Suppressed notification for user ${userId}: ${title}`,
      );
      return;
    }

    // Mark as sent for deduplication purposes
    if (dedupeKey) {
      this.dedupeCache.set(dedupeKey, Date.now());
    }

    // Track which channels actually delivered
    const deliveredChannels: string[] = [];

    // --- Real-time WebSocket delivery (always attempted, independent of FCM) ---
    if (this.wsGateway) {
      this.wsGateway.emitNotification(userId, { title, body });
      deliveredChannels.push('ws');
    }

    if (!this.fcmEnabled || !settings.fcmToken) {
      this.logger.log(`[push:${userId}] ${title} — ${body}`);
    } else {
      try {
        await admin.messaging().send({
          token: settings.fcmToken,
          notification: { title, body },
          data: { userId, kind: 'reminder' },
        });
        deliveredChannels.push('push');
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

    // --- Persist notification log (best-effort) ---
    try {
      const channel = deliveredChannels[0] || 'push';
      await this.prisma.notificationLog.create({
        data: { userId, title, body, type, channel },
      });
    } catch (logErr) {
      this.logger.warn(`Failed to persist notification log: ${(logErr as Error).message}`);
    }
  }

  // ----------------------------------------------------------------
  // Notification history
  // ----------------------------------------------------------------

  async getHistory(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.notificationLog.findMany({
        where: { userId },
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notificationLog.count({ where: { userId } }),
    ]);
    return { data: items, total, page, limit };
  }

  async markRead(userId: string, notificationId: string) {
    return this.prisma.notificationLog.updateMany({
      where: { id: notificationId, userId },
      data: { readAt: new Date() },
    });
  }

  // ----------------------------------------------------------------
  // Quiet-hours helper
  // ----------------------------------------------------------------

  /**
   * Returns true if the current time (in the user's timezone) falls
   * within the quiet window defined by `quietStart` and `quietEnd`.
   *
   * Handles the midnight-crossing case (e.g. 22:00 - 07:00).
   * The DB stores these as `@db.Time()` values — Prisma returns them as
   * Date objects whose *time* portion is what we care about.
   */
  isWithinQuietHours(
    quietStart: Date | null | undefined,
    quietEnd: Date | null | undefined,
    timezone?: string | null,
  ): boolean {
    if (!quietStart || !quietEnd) return false;

    const tz = timezone || 'UTC';
    const now = new Date();

    // Get current hours/minutes in the user's timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const nowHour = parseInt(parts.find((p) => p.type === 'hour')!.value, 10);
    const nowMin = parseInt(parts.find((p) => p.type === 'minute')!.value, 10);
    const nowMinutes = nowHour * 60 + nowMin;

    // Extract hours/minutes from the Date objects (UTC portion represents the time)
    const startMinutes = quietStart.getUTCHours() * 60 + quietStart.getUTCMinutes();
    const endMinutes = quietEnd.getUTCHours() * 60 + quietEnd.getUTCMinutes();

    if (startMinutes <= endMinutes) {
      // Same-day range, e.g. 01:00 - 07:00
      return nowMinutes >= startMinutes && nowMinutes < endMinutes;
    }
    // Midnight-crossing range, e.g. 22:00 - 07:00
    return nowMinutes >= startMinutes || nowMinutes < endMinutes;
  }

  // ----------------------------------------------------------------
  // Deduplication helpers
  // ----------------------------------------------------------------

  /**
   * Remove entries older than the TTL from the deduplication cache.
   * Called lazily before each dedup check to keep memory bounded.
   */
  private pruneDedupeCache(): void {
    const cutoff = Date.now() - NotificationsService.DEDUPE_TTL_MS;
    for (const [key, ts] of this.dedupeCache) {
      if (ts < cutoff) {
        this.dedupeCache.delete(key);
      }
    }
  }
}
