import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CoachService } from './coach.service';

describe('CoachService', () => {
  const makeMailer = () =>
    ({
      sendCoachInvite: jest.fn(async () => undefined),
    }) as any;

  const makePrisma = (overrides: Record<string, any> = {}) => {
    const links: any[] = [];
    return {
      user: {
        findUnique: jest.fn(async ({ where }: any) => {
          if (where.id === 'coach') {
            return {
              id: 'coach',
              email: 'coach@x.com',
              fullName: 'Coach Carter',
              role: 'coach',
            };
          }
          if (where.id === 'plain') {
            return { id: 'plain', email: 'p@x.com', fullName: null, role: 'user' };
          }
          if (where.email === 'client@x.com') {
            return { id: 'client', email: 'client@x.com', role: 'user' };
          }
          if (where.id === 'client') {
            return {
              id: 'client',
              email: 'client@x.com',
              fullName: 'Client',
              goal: 'fat_loss',
              unitSystem: 'metric',
            };
          }
          return null;
        }),
      },
      coachLink: {
        findUnique: jest.fn(async ({ where }: any) =>
          links.find((l) => l.id === where.id) ?? null,
        ),
        upsert: jest.fn(async ({ where, create }: any) => {
          const existing = links.find(
            (l) =>
              l.coachId === where.coachId_clientId.coachId &&
              l.clientId === where.coachId_clientId.clientId,
          );
          if (existing) return existing;
          const row = { id: `l${links.length + 1}`, ...create, acceptedAt: null };
          links.push(row);
          return row;
        }),
        update: jest.fn(async ({ where, data }: any) => {
          const row = links.find((l) => l.id === where.id)!;
          Object.assign(row, data);
          return row;
        }),
        findMany: jest.fn(async () =>
          links.filter((l) => l.acceptedAt !== null),
        ),
        findFirst: jest.fn(async ({ where }: any) =>
          links.find(
            (l) =>
              l.coachId === where.coachId &&
              l.clientId === where.clientId &&
              l.acceptedAt !== null,
          ) ?? null,
        ),
      },
      userProfile: {
        findFirst: jest.fn(async () => null),
      },
      dailyScheduleItem: {
        findMany: jest.fn(async () => [
          { date: new Date(), status: 'completed', itemType: 'meal' },
          { date: new Date(), status: 'pending', itemType: 'meal' },
        ]),
      },
      workoutSession: {
        findMany: jest.fn(async () => []),
      },
      personalRecord: {
        findMany: jest.fn(async () => []),
      },
      links,
      ...overrides,
    } as any;
  };

  it('blocks non-coach callers from inviting clients', async () => {
    const prisma = makePrisma();
    const svc = new CoachService(prisma, makeMailer());
    await expect(svc.inviteClient('plain', 'client@x.com')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('refuses self-invite', async () => {
    const prisma = makePrisma();
    // Make the coach lookup return the same user as the email lookup
    prisma.user.findUnique = jest.fn(async ({ where }: any) => {
      if (where.id === 'coach') return { id: 'coach', role: 'coach' };
      if (where.email === 'self@x.com') return { id: 'coach', email: 'self@x.com' };
      return null;
    });
    const svc = new CoachService(prisma, makeMailer());
    await expect(svc.inviteClient('coach', 'self@x.com')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('creates a pending invite for an existing client and sends an email', async () => {
    const prisma = makePrisma();
    const mailer = makeMailer();
    const svc = new CoachService(prisma, mailer);
    const link = await svc.inviteClient('coach', 'client@x.com');
    expect(link.acceptedAt).toBeNull();
    expect(prisma.links).toHaveLength(1);
    expect(mailer.sendCoachInvite).toHaveBeenCalledWith(
      'client@x.com',
      'Coach Carter',
      expect.stringContaining(`/dashboard/coach?accept=${link.id}`),
    );
  });

  it('still returns the link when the invite email blows up', async () => {
    const prisma = makePrisma();
    const mailer = {
      sendCoachInvite: jest.fn(async () => {
        throw new Error('SMTP down');
      }),
    } as any;
    const svc = new CoachService(prisma, mailer);
    const link = await svc.inviteClient('coach', 'client@x.com');
    expect(link).toBeDefined();
    expect(prisma.links).toHaveLength(1);
  });

  it('rejects invites to unknown emails with 404', async () => {
    const prisma = makePrisma();
    prisma.user.findUnique = jest.fn(async ({ where }: any) => {
      if (where.id === 'coach') return { id: 'coach', role: 'coach' };
      return null;
    });
    const svc = new CoachService(prisma, makeMailer());
    await expect(
      svc.inviteClient('coach', 'ghost@x.com'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('client summary refuses unauthorised coaches', async () => {
    const prisma = makePrisma();
    const svc = new CoachService(prisma, makeMailer());
    await expect(
      svc.clientSummary('coach', 'client'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('client summary returns aggregates after the link is accepted', async () => {
    const prisma = makePrisma();
    prisma.links.push({
      id: 'l1',
      coachId: 'coach',
      clientId: 'client',
      acceptedAt: new Date(),
    });
    const svc = new CoachService(prisma, makeMailer());
    const summary = await svc.clientSummary('coach', 'client');
    expect(summary.summary.totalItems).toBe(2);
    expect(summary.summary.completedItems).toBe(1);
    expect(summary.summary.adherencePct).toBe(50);
  });
});
