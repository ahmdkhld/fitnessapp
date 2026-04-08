import { ExportService } from './export.service';

describe('ExportService.report', () => {
  const today = new Date('2026-04-07T00:00:00Z');

  const makePrisma = () =>
    ({
      user: {
        findUnique: jest.fn().mockResolvedValue({
          email: 'a@b.com',
          fullName: 'Alice',
          goal: 'fat_loss',
        }),
      },
      dailyScheduleItem: {
        findMany: jest.fn().mockResolvedValue([
          { date: today, status: 'completed', itemType: 'meal' },
          { date: today, status: 'completed', itemType: 'meal' },
          { date: today, status: 'skipped', itemType: 'supplement' },
        ]),
      },
      waterLog: {
        findMany: jest.fn().mockResolvedValue([
          { date: today, amountMl: 500 },
          { date: today, amountMl: 750 },
        ]),
      },
      bodyLog: {
        findMany: jest.fn().mockResolvedValue([
          { date: today, weightKg: 80, waistCm: 85, bodyFatPct: 18, energyLevel: 4 },
        ]),
      },
      dailyNote: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      workoutSession: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      personalRecord: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    }) as any;

  it('summarises adherence and aggregates water by day', async () => {
    const svc = new ExportService(makePrisma());
    const report = await svc.report('u1', today, today);
    expect(report.summary.totalItems).toBe(3);
    expect(report.summary.completed).toBe(2);
    expect(report.summary.adherencePct).toBe(67);
    expect(report.dailyAdherence).toHaveLength(1);
    expect(report.dailyAdherence[0].percentage).toBe(67);
    expect(report.dailyWaterMl).toEqual([
      { date: today.toISOString().slice(0, 10), amountMl: 1250 },
    ]);
    expect(report.bodyLogs).toHaveLength(1);
  });
});
