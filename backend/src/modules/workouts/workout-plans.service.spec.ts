import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { WorkoutPlansService } from './workout-plans.service';

/**
 * Pure-logic tests for the new template safety guards. The audit
 * surfaced that activating a template would corrupt a row shared by
 * every user; these tests pin the guards down so a regression can't
 * silently re-open the hole.
 */
describe('WorkoutPlansService template guards', () => {
  function makePrisma(plan: any) {
    return {
      workoutPlan: {
        findUnique: jest.fn(async () => plan),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      workoutDay: {
        findUnique: jest.fn(async ({ where }: any) =>
          where.id === 'd-template'
            ? { id: 'd-template', plan: { userId: null } }
            : where.id === 'd-mine'
              ? { id: 'd-mine', plan: { userId: 'u1' } }
              : null,
        ),
        create: jest.fn(),
      },
      $transaction: jest.fn(async (ops: any[]) => Promise.all(ops)),
    } as any;
  }

  it('activate refuses templates', async () => {
    const prisma = makePrisma({
      id: 'pT',
      userId: null,
      isTemplate: true,
      days: [],
    });
    const svc = new WorkoutPlansService(prisma);
    await expect(svc.activate('u1', 'pT')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(prisma.workoutPlan.update).not.toHaveBeenCalled();
  });

  it('activate runs the swap for personal plans', async () => {
    const prisma = makePrisma({
      id: 'p1',
      userId: 'u1',
      isTemplate: false,
      days: [],
    });
    const svc = new WorkoutPlansService(prisma);
    await svc.activate('u1', 'p1');
    expect(prisma.workoutPlan.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { isActive: true },
    });
  });

  it('addDay refuses templates via the helper guard', async () => {
    const prisma = makePrisma({
      id: 'pT',
      userId: null,
      isTemplate: true,
      days: [],
    });
    const svc = new WorkoutPlansService(prisma);
    await expect(
      svc.addDay('u1', 'pT', { name: 'Push' } as any),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.workoutDay.create).not.toHaveBeenCalled();
  });

  it('addDay accepts personal plans', async () => {
    const prisma = makePrisma({
      id: 'p1',
      userId: 'u1',
      isTemplate: false,
      days: [],
    });
    const svc = new WorkoutPlansService(prisma);
    await svc.addDay('u1', 'p1', { name: 'Push' } as any);
    expect(prisma.workoutDay.create).toHaveBeenCalledTimes(1);
  });

  it('updateDay refuses days under templates', async () => {
    const prisma = makePrisma(null);
    const svc = new WorkoutPlansService(prisma);
    await expect(
      svc.updateDay('u1', 'd-template', { name: 'Push' } as any),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('updateDay throws NotFound for missing day', async () => {
    const prisma = makePrisma(null);
    prisma.workoutDay.findUnique = jest.fn(async () => null);
    const svc = new WorkoutPlansService(prisma);
    await expect(
      svc.updateDay('u1', 'ghost', { name: 'Push' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
