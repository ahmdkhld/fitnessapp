import { WaterService } from './water.service';

describe('WaterService', () => {
  const makePrisma = () =>
    ({
      waterLog: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    }) as any;

  let prisma: ReturnType<typeof makePrisma>;
  let svc: WaterService;

  beforeEach(() => {
    prisma = makePrisma();
    svc = new WaterService(prisma);
  });

  it('getDay returns logs and their total for a given date', async () => {
    const logs = [
      { id: '1', amountMl: 250, loggedAt: new Date() },
      { id: '2', amountMl: 500, loggedAt: new Date() },
    ];
    prisma.waterLog.findMany.mockResolvedValue(logs);

    const result = await svc.getDay('u1', new Date('2025-06-15T14:00:00Z'));

    expect(result.totalMl).toBe(750);
    expect(result.logs).toEqual(logs);
    // Date should be normalized to start of day
    expect(result.date.getUTCHours()).toBe(0);
    expect(result.date.getUTCMinutes()).toBe(0);
  });

  it('getDay returns zero total when no logs exist', async () => {
    prisma.waterLog.findMany.mockResolvedValue([]);

    const result = await svc.getDay('u1', new Date());

    expect(result.totalMl).toBe(0);
    expect(result.logs).toEqual([]);
  });

  it('log creates a water log entry with start-of-day date', async () => {
    const created = { id: '1', userId: 'u1', amountMl: 300 };
    prisma.waterLog.create.mockResolvedValue(created);

    const result = await svc.log('u1', 300, new Date('2025-06-15T18:30:00Z'));

    expect(result).toEqual(created);
    const callData = prisma.waterLog.create.mock.calls[0][0].data;
    expect(callData.userId).toBe('u1');
    expect(callData.amountMl).toBe(300);
    expect(callData.date.getUTCHours()).toBe(0);
  });

  it('log defaults to today when no date is provided', async () => {
    prisma.waterLog.create.mockResolvedValue({ id: '1' });

    await svc.log('u1', 200);

    const callData = prisma.waterLog.create.mock.calls[0][0].data;
    expect(callData.date).toBeInstanceOf(Date);
    expect(callData.date.getUTCHours()).toBe(0);
  });
});
