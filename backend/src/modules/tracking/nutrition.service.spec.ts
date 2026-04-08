import { NutritionService } from './nutrition.service';

describe('NutritionService', () => {
  const makePrisma = () =>
    ({
      nutritionLog: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        upsert: jest.fn(),
      },
    }) as any;

  let prisma: ReturnType<typeof makePrisma>;
  let svc: NutritionService;

  beforeEach(() => {
    prisma = makePrisma();
    svc = new NutritionService(prisma);
  });

  it('getByDate queries by userId+date composite key', async () => {
    const log = { id: '1', targetCalories: 2200, actualCalories: 2050 };
    prisma.nutritionLog.findUnique.mockResolvedValue(log);

    const result = await svc.getByDate('u1', new Date('2026-04-08T14:00:00Z'));

    expect(result).toEqual(log);
    const where = prisma.nutritionLog.findUnique.mock.calls[0][0].where;
    expect(where.userId_date.userId).toBe('u1');
    expect(where.userId_date.date.getUTCHours()).toBe(0);
  });

  it('getByDate returns null when no log exists', async () => {
    prisma.nutritionLog.findUnique.mockResolvedValue(null);

    const result = await svc.getByDate('u1', new Date());

    expect(result).toBeNull();
  });

  it('getRange returns logs ordered by date ascending', async () => {
    const logs = [
      { id: '1', date: new Date('2026-04-01') },
      { id: '2', date: new Date('2026-04-02') },
    ];
    prisma.nutritionLog.findMany.mockResolvedValue(logs);

    const result = await svc.getRange(
      'u1',
      new Date('2026-04-01'),
      new Date('2026-04-08'),
    );

    expect(result).toHaveLength(2);
    const call = prisma.nutritionLog.findMany.mock.calls[0][0];
    expect(call.orderBy.date).toBe('asc');
    expect(call.where.userId).toBe('u1');
  });

  it('upsert calls prisma upsert with correct composite key and data', async () => {
    const upserted = { id: '1', targetCalories: 2200, actualCalories: 2050 };
    prisma.nutritionLog.upsert.mockResolvedValue(upserted);

    const dto = {
      date: '2026-04-08',
      targetCalories: 2200,
      actualCalories: 2050,
      targetProteinG: 150,
    };

    const result = await svc.upsert('u1', dto as any);

    expect(result).toEqual(upserted);
    const call = prisma.nutritionLog.upsert.mock.calls[0][0];
    expect(call.where.userId_date.userId).toBe('u1');
    expect(call.where.userId_date.date.getUTCHours()).toBe(0);
    expect(call.create.userId).toBe('u1');
    expect(call.create.targetCalories).toBe(2200);
    expect(call.update.targetCalories).toBe(2200);
    expect(call.update.targetProteinG).toBe(150);
  });
});
