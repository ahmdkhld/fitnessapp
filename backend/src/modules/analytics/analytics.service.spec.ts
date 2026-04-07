import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  const makePrisma = (items: any[]) =>
    ({
      dailyScheduleItem: {
        findMany: jest.fn().mockResolvedValue(items),
      },
    }) as any;

  it('computes overall adherence percentage', async () => {
    const prisma = makePrisma([
      { date: new Date(), status: 'completed', itemType: 'meal' },
      { date: new Date(), status: 'completed', itemType: 'meal' },
      { date: new Date(), status: 'skipped', itemType: 'supplement' },
      { date: new Date(), status: 'pending', itemType: 'supplement' },
    ]);
    const svc = new AnalyticsService(prisma);
    const result = await svc.adherence('u1', 7);
    expect(result.total).toBe(4);
    expect(result.completed).toBe(2);
    expect(result.overallPercentage).toBe(50);
    expect(result.perType.find((t) => t.type === 'meal')?.percentage).toBe(100);
    expect(result.perType.find((t) => t.type === 'supplement')?.percentage).toBe(0);
  });

  it('counts current streak from consecutive ≥80% days', async () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setUTCDate(today.getUTCDate() - 2);

    const prisma = makePrisma([
      { date: today, status: 'completed' },
      { date: today, status: 'completed' },
      { date: today, status: 'pending' },
      { date: yesterday, status: 'completed' },
      { date: yesterday, status: 'completed' },
      { date: dayBefore, status: 'skipped' },
      { date: dayBefore, status: 'skipped' },
    ]);
    const svc = new AnalyticsService(prisma);
    const result = await svc.streak('u1');
    // today: 2/3 = 66% (below 80) → streak stops at 0
    // If today is 2/3 we need >=80 so streak=0
    expect(result.currentStreak).toBe(0);
  });
});
