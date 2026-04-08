import { DailyNotesService } from './daily-notes.service';

describe('DailyNotesService', () => {
  const makePrisma = () =>
    ({
      dailyNote: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    }) as any;

  let prisma: ReturnType<typeof makePrisma>;
  let svc: DailyNotesService;

  beforeEach(() => {
    prisma = makePrisma();
    svc = new DailyNotesService(prisma);
  });

  it('get returns the daily note for a user and date (start of day)', async () => {
    const note = { id: '1', userId: 'u1', mood: 8, notes: 'Good day' };
    prisma.dailyNote.findFirst.mockResolvedValue(note);

    const result = await svc.get('u1', new Date('2025-06-15T14:30:00Z'));

    expect(result).toEqual(note);
    const where = prisma.dailyNote.findFirst.mock.calls[0][0].where;
    expect(where.userId).toBe('u1');
    expect(where.date.getUTCHours()).toBe(0);
    expect(where.date.getUTCMinutes()).toBe(0);
  });

  it('get returns null when no note exists for the date', async () => {
    prisma.dailyNote.findFirst.mockResolvedValue(null);

    const result = await svc.get('u1', new Date());

    expect(result).toBeNull();
  });

  it('upsert creates a note with start-of-day date normalization', async () => {
    const created = { id: '1', userId: 'u1', mood: 7, notes: 'Okay day' };
    prisma.dailyNote.create.mockResolvedValue(created);

    const result = await svc.upsert('u1', new Date('2025-06-15T22:00:00Z'), {
      mood: 7,
      notes: 'Okay day',
    });

    expect(result).toEqual(created);
    const callData = prisma.dailyNote.create.mock.calls[0][0].data;
    expect(callData.userId).toBe('u1');
    expect(callData.mood).toBe(7);
    expect(callData.date.getUTCHours()).toBe(0);
  });
});
