import { NotificationsService } from './notifications.service';

// Mock firebase-admin at the module level
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  messaging: jest.fn(() => ({
    send: jest.fn().mockResolvedValue('message-id-123'),
  })),
}));

import * as admin from 'firebase-admin';

describe('NotificationsService', () => {
  const makePrisma = () =>
    ({
      notificationSettings: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
      },
    }) as any;

  let prisma: ReturnType<typeof makePrisma>;
  let svc: NotificationsService;

  beforeEach(() => {
    prisma = makePrisma();
    svc = new NotificationsService(prisma);
    jest.clearAllMocks();
  });

  describe('registerDevice', () => {
    it('creates a new settings row when none exists', async () => {
      prisma.notificationSettings.findUnique.mockResolvedValue(null);
      prisma.notificationSettings.create.mockResolvedValue({
        userId: 'u1',
        fcmToken: 'tok-abc',
      });

      const result = await svc.registerDevice('u1', 'tok-abc');

      expect(prisma.notificationSettings.create).toHaveBeenCalledWith({
        data: { userId: 'u1', fcmToken: 'tok-abc', apnsToken: undefined },
      });
      expect(result.fcmToken).toBe('tok-abc');
    });

    it('updates an existing settings row', async () => {
      prisma.notificationSettings.findUnique.mockResolvedValue({
        userId: 'u1',
        fcmToken: 'old-tok',
      });
      prisma.notificationSettings.update.mockResolvedValue({
        userId: 'u1',
        fcmToken: 'new-tok',
      });

      const result = await svc.registerDevice('u1', 'new-tok');

      expect(prisma.notificationSettings.update).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        data: { fcmToken: 'new-tok', apnsToken: undefined },
      });
      expect(result.fcmToken).toBe('new-tok');
    });
  });

  describe('updateSettings', () => {
    it('upserts notification preferences for a user', async () => {
      const updated = { userId: 'u1', pushEnabled: true, mealReminder: false };
      prisma.notificationSettings.upsert.mockResolvedValue(updated);

      const result = await svc.updateSettings('u1', {
        pushEnabled: true,
        mealReminder: false,
      });

      expect(result).toEqual(updated);
      expect(prisma.notificationSettings.upsert).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        create: { userId: 'u1', pushEnabled: true, mealReminder: false },
        update: { pushEnabled: true, mealReminder: false },
      });
    });
  });

  describe('send', () => {
    it('does nothing when push is disabled for the user', async () => {
      prisma.notificationSettings.findUnique.mockResolvedValue({
        pushEnabled: false,
        fcmToken: 'tok',
        user: { timezone: 'UTC' },
      });

      await svc.send('u1', 'Hello', 'World');

      expect(admin.messaging).not.toHaveBeenCalled();
    });

    it('logs instead of sending when fcm is not enabled (no credentials)', async () => {
      prisma.notificationSettings.findUnique.mockResolvedValue({
        pushEnabled: true,
        fcmToken: 'tok',
        quietStart: null,
        quietEnd: null,
        user: { timezone: 'UTC' },
      });
      // fcmEnabled is false by default (onModuleInit not called)

      // Should not throw
      await svc.send('u1', 'Hello', 'World');

      expect(admin.messaging).not.toHaveBeenCalled();
    });

    it('does nothing when settings do not exist for the user', async () => {
      prisma.notificationSettings.findUnique.mockResolvedValue(null);

      await svc.send('u1', 'Title', 'Body');

      expect(admin.messaging).not.toHaveBeenCalled();
    });

    it('suppresses duplicate notifications with the same dedupeKey', async () => {
      prisma.notificationSettings.findUnique.mockResolvedValue({
        pushEnabled: true,
        fcmToken: 'tok',
        quietStart: null,
        quietEnd: null,
        user: { timezone: 'UTC' },
      });

      await svc.send('u1', 'Hello', 'World', 'u1:overdue::2026-01-01');
      await svc.send('u1', 'Hello', 'World', 'u1:overdue::2026-01-01');

      // findUnique should only be called once — second call is deduped before DB lookup
      expect(prisma.notificationSettings.findUnique).toHaveBeenCalledTimes(1);
    });

    it('allows notifications with different dedupeKeys', async () => {
      prisma.notificationSettings.findUnique.mockResolvedValue({
        pushEnabled: true,
        fcmToken: 'tok',
        quietStart: null,
        quietEnd: null,
        user: { timezone: 'UTC' },
      });

      await svc.send('u1', 'Hello', 'World', 'u1:overdue::2026-01-01');
      await svc.send('u1', 'Hello', 'World', 'u1:recap::2026-01-01');

      expect(prisma.notificationSettings.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe('isWithinQuietHours', () => {
    it('returns false when quiet hours are not set', () => {
      expect(svc.isWithinQuietHours(null, null)).toBe(false);
      expect(svc.isWithinQuietHours(undefined, undefined)).toBe(false);
    });

    it('detects time within a same-day quiet window', () => {
      // Quiet from 02:00 to 06:00 UTC
      const start = new Date('2000-01-01T02:00:00Z');
      const end = new Date('2000-01-01T06:00:00Z');

      const now = new Date();
      const hour = now.getUTCHours();

      // We can only assert based on the current time
      const expected = hour >= 2 && hour < 6;
      expect(svc.isWithinQuietHours(start, end, 'UTC')).toBe(expected);
    });

    it('handles midnight-crossing quiet window', () => {
      // Quiet from 22:00 to 07:00 UTC
      const start = new Date('2000-01-01T22:00:00Z');
      const end = new Date('2000-01-01T07:00:00Z');

      const now = new Date();
      const hour = now.getUTCHours();

      const expected = hour >= 22 || hour < 7;
      expect(svc.isWithinQuietHours(start, end, 'UTC')).toBe(expected);
    });
  });

  describe('onModuleInit', () => {
    it('does not initialize FCM when env vars are missing', () => {
      delete process.env.FCM_PROJECT_ID;
      delete process.env.FCM_CLIENT_EMAIL;
      delete process.env.FCM_PRIVATE_KEY;

      svc.onModuleInit();

      expect(admin.initializeApp).not.toHaveBeenCalled();
    });
  });
});
