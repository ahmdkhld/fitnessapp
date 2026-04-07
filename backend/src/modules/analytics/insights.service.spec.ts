import { InsightsService } from './insights.service';

describe('InsightsService', () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = (n: number) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - n);
    return d;
  };

  const makePrisma = (overrides: Record<string, any> = {}) =>
    ({
      dailyScheduleItem: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      supplement: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      waterLog: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      userProfile: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      ...overrides,
    }) as any;

  it('flags a frequently missed item', async () => {
    const prisma = makePrisma({
      dailyScheduleItem: {
        findMany: jest.fn().mockResolvedValue(
          Array.from({ length: 6 }, (_, i) => ({
            title: 'Pre-workout shake',
            status: 'skipped',
            date: yesterday(i),
            itemType: 'meal',
          })),
        ),
      },
    });
    const insights = await new InsightsService(prisma).forUser('u1');
    expect(insights.some((i) => i.type === 'missed')).toBe(true);
  });

  it('emits a positive insight at high adherence', async () => {
    const items = Array.from({ length: 30 }, () => ({
      title: 'meal',
      status: 'completed',
      date: today,
      itemType: 'meal',
    }));
    const prisma = makePrisma({
      dailyScheduleItem: { findMany: jest.fn().mockResolvedValue(items) },
    });
    const insights = await new InsightsService(prisma).forUser('u1');
    expect(insights.some((i) => i.type === 'positive')).toBe(true);
  });

  it('flags low stock supplements', async () => {
    const prisma = makePrisma({
      supplement: {
        findMany: jest.fn().mockResolvedValue([
          { name: 'Vitamin D3', stockQuantity: 3, stockAlertAt: 7 },
          { name: 'Magnesium', stockQuantity: 0, stockAlertAt: 7 },
          { name: 'Healthy', stockQuantity: 30, stockAlertAt: 7 },
        ]),
      },
    });
    const insights = await new InsightsService(prisma).forUser('u1');
    const stock = insights.filter((i) => i.type === 'stock');
    expect(stock).toHaveLength(2);
    expect(stock.find((i) => i.title.includes('Magnesium'))?.severity).toBe('critical');
  });

  it('warns about hydration shortfalls', async () => {
    const prisma = makePrisma({
      waterLog: {
        findMany: jest.fn().mockResolvedValue(
          Array.from({ length: 6 }, (_, i) => ({
            date: yesterday(i),
            amountMl: 500,
          })),
        ),
      },
      userProfile: {
        findFirst: jest.fn().mockResolvedValue({ dailyWaterGoalMl: 2500 }),
      },
    });
    const insights = await new InsightsService(prisma).forUser('u1');
    expect(insights.some((i) => i.type === 'hydration')).toBe(true);
  });
});
