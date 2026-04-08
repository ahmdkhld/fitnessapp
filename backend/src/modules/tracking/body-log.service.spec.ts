import { BodyLogService } from './body-log.service';

describe('BodyLogService', () => {
  const makePrisma = () =>
    ({
      bodyLog: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    }) as any;

  let prisma: ReturnType<typeof makePrisma>;
  let svc: BodyLogService;

  beforeEach(() => {
    prisma = makePrisma();
    svc = new BodyLogService(prisma);
  });

  it('list returns all body logs for a user ordered by date desc', async () => {
    const logs = [{ id: '1', userId: 'u1', weightKg: 80 }];
    prisma.bodyLog.findMany.mockResolvedValue(logs);

    const result = await svc.list('u1');

    expect(result).toEqual(logs);
    expect(prisma.bodyLog.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      orderBy: { date: 'desc' },
    });
  });

  it('list applies date range filters when from/to are provided', async () => {
    prisma.bodyLog.findMany.mockResolvedValue([]);
    const from = new Date('2025-01-01');
    const to = new Date('2025-06-01');

    await svc.list('u1', from, to);

    const where = prisma.bodyLog.findMany.mock.calls[0][0].where;
    expect(where.date.gte).toEqual(from);
    expect(where.date.lte).toEqual(to);
  });

  it('create persists a body log with all provided fields', async () => {
    const input = {
      weightKg: 82.5,
      waistCm: 85,
      bodyFatPct: 18,
      energyLevel: 7,
      notes: 'Feeling great',
    };
    const created = { id: '1', userId: 'u1', ...input };
    prisma.bodyLog.create.mockResolvedValue(created);

    const result = await svc.create('u1', input);

    expect(result).toEqual(created);
    const callData = prisma.bodyLog.create.mock.calls[0][0].data;
    expect(callData.userId).toBe('u1');
    expect(callData.weightKg).toBe(82.5);
    expect(callData.date).toBeInstanceOf(Date);
  });

  it('create uses the provided date instead of defaulting to now', async () => {
    const specificDate = new Date('2025-03-15');
    prisma.bodyLog.create.mockResolvedValue({ id: '1' });

    await svc.create('u1', { date: specificDate, weightKg: 80 });

    const callData = prisma.bodyLog.create.mock.calls[0][0].data;
    expect(callData.date).toEqual(specificDate);
  });
});
