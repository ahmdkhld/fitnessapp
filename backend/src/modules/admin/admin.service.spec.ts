import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  const makePrisma = (currentRole = 'admin') => ({
    user: {
      findUnique: jest.fn(async ({ where }: any) => ({
        id: where.id,
        role: where.id === 'actor' ? currentRole : 'user',
      })),
      findMany: jest.fn(async () => [
        { id: 'u1', email: 'a@b.com', role: 'user' },
        { id: 'u2', email: 'c@d.com', role: 'coach' },
      ]),
      update: jest.fn(async ({ where, data }: any) => ({
        id: where.id,
        email: 'x@y.com',
        role: data.role,
      })),
      count: jest.fn(async ({ where }: any = {}) =>
        where?.role === 'coach' ? 3 : 25,
      ),
    },
    workoutPlan: { count: jest.fn(async () => 10) },
    workoutSession: { count: jest.fn(async () => 50) },
  });

  it('blocks non-admin callers from listing users', async () => {
    const prisma = makePrisma('user');
    const svc = new AdminService(prisma as any);
    await expect(svc.listUsers('actor')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('allows admin to list and stats', async () => {
    const prisma = makePrisma('admin');
    const svc = new AdminService(prisma as any);
    const users = await svc.listUsers('actor');
    expect(users).toHaveLength(2);
    const stats = await svc.stats('actor');
    expect(stats).toEqual({
      users: 25,
      coaches: 3,
      workoutPlans: 10,
      completedSessions: 50,
    });
  });

  it('refuses self-demotion', async () => {
    const prisma = makePrisma('admin');
    const svc = new AdminService(prisma as any);
    await expect(svc.setRole('actor', 'actor', 'user')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('rejects unknown roles', async () => {
    const prisma = makePrisma('admin');
    const svc = new AdminService(prisma as any);
    await expect(
      svc.setRole('actor', 'someoneElse', 'super_root' as any),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('promotes a user to coach', async () => {
    const prisma = makePrisma('admin');
    const svc = new AdminService(prisma as any);
    const result = await svc.setRole('actor', 'u1', 'coach');
    expect(result.role).toBe('coach');
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { role: 'coach' },
      select: { id: true, email: true, role: true },
    });
  });

  it('throws NotFound when target user is missing', async () => {
    const prisma = makePrisma('admin');
    prisma.user.findUnique = jest.fn(async ({ where }: any) =>
      where.id === 'actor' ? { id: 'actor', role: 'admin' } : null,
    );
    const svc = new AdminService(prisma as any);
    await expect(svc.setRole('actor', 'ghost', 'coach')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
