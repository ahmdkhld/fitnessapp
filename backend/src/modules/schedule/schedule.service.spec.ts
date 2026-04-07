import { ScheduleService } from './schedule.service';

describe('ScheduleService.generateDay', () => {
  // Light-weight mock of PrismaService — only the methods this test touches.
  const makePrisma = () => {
    const created: any[] = [];
    return {
      created,
      dietPlan: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'dp1',
          meals: [
            {
              id: 'm1',
              name: 'Breakfast',
              scheduledTime: new Date('1970-01-01T08:00:00Z'),
              sortOrder: 0,
              calories: 500,
              ingredients: [{ name: 'oats', quantity: '40g' }],
            },
          ],
        }),
      },
      supplementPlan: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'sp1',
          supplements: [
            {
              id: 's1',
              name: 'Vitamin D3',
              dosage: '5000 IU',
              timingNote: 'after_food',
              scheduledTime: new Date('1970-01-01T08:30:00Z'),
              frequency: 'daily',
              frequencyDays: [],
              sortOrder: 0,
            },
            {
              id: 's2',
              name: 'Weekend only',
              dosage: null,
              timingNote: null,
              scheduledTime: new Date('1970-01-01T09:00:00Z'),
              frequency: 'custom',
              frequencyDays: [6, 7], // Sat, Sun
              sortOrder: 1,
            },
          ],
        }),
      },
      dailyScheduleItem: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn().mockImplementation(async ({ data }) => {
          created.push(...data);
          return { count: data.length };
        }),
      },
    } as any;
  };

  it('generates meal + daily supplement but skips custom-day supplement on weekdays', async () => {
    const prisma = makePrisma();
    const svc = new ScheduleService(prisma);
    // Wednesday (Unix epoch starting Thursday, pick a known weekday)
    const wednesday = new Date('2026-04-08T00:00:00Z');
    const result = await svc.generateDay('u1', wednesday);

    expect(result.count).toBe(2);
    expect(prisma.created.map((i: any) => i.title)).toEqual([
      'Breakfast',
      'Vitamin D3',
    ]);
  });

  it('includes custom-day supplement on its scheduled day', async () => {
    const prisma = makePrisma();
    const svc = new ScheduleService(prisma);
    const saturday = new Date('2026-04-11T00:00:00Z'); // Saturday
    const result = await svc.generateDay('u1', saturday);
    expect(result.count).toBe(3);
    expect(prisma.created.map((i: any) => i.title)).toContain('Weekend only');
  });
});
