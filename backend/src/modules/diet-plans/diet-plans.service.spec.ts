import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DietPlansService } from './diet-plans.service';

describe('DietPlansService', () => {
  const makePrisma = () =>
    ({
      dietPlan: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(async (ops: any[]) => ops),
    }) as any;

  let prisma: ReturnType<typeof makePrisma>;
  let svc: DietPlansService;

  beforeEach(() => {
    prisma = makePrisma();
    svc = new DietPlansService(prisma);
  });

  it('list returns plans for the given user ordered by createdAt desc', async () => {
    const plans = [{ id: 'p1', userId: 'u1' }];
    prisma.dietPlan.findMany.mockResolvedValue(plans);

    const result = await svc.list('u1');

    expect(result).toEqual(plans);
    expect(prisma.dietPlan.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('findOne returns a plan with meals when it belongs to the user', async () => {
    const plan = { id: 'p1', userId: 'u1', meals: [] };
    prisma.dietPlan.findUnique.mockResolvedValue(plan);

    const result = await svc.findOne('u1', 'p1');

    expect(result).toEqual(plan);
    expect(prisma.dietPlan.findUnique).toHaveBeenCalledWith({
      where: { id: 'p1' },
      include: { meals: { include: { ingredients: true }, orderBy: { sortOrder: 'asc' } } },
    });
  });

  it('findOne throws NotFoundException when plan does not exist', async () => {
    prisma.dietPlan.findUnique.mockResolvedValue(null);

    await expect(svc.findOne('u1', 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findOne throws ForbiddenException when plan belongs to another user', async () => {
    prisma.dietPlan.findUnique.mockResolvedValue({
      id: 'p1',
      userId: 'other-user',
    });

    await expect(svc.findOne('u1', 'p1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('create delegates to prisma with userId merged into dto', async () => {
    const dto = { name: 'Cutting Plan', description: 'Low cal' } as any;
    const created = { id: 'p1', userId: 'u1', ...dto };
    prisma.dietPlan.create.mockResolvedValue(created);

    const result = await svc.create('u1', dto);

    expect(result).toEqual(created);
    expect(prisma.dietPlan.create).toHaveBeenCalledWith({
      data: { ...dto, userId: 'u1' },
    });
  });

  it('update verifies ownership then updates the plan', async () => {
    const plan = { id: 'p1', userId: 'u1', meals: [] };
    prisma.dietPlan.findUnique.mockResolvedValue(plan);
    prisma.dietPlan.update.mockResolvedValue({ ...plan, name: 'Renamed' });

    const result = await svc.update('u1', 'p1', { name: 'Renamed' } as any);

    expect(result.name).toBe('Renamed');
    expect(prisma.dietPlan.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { name: 'Renamed' },
    });
  });

  it('remove verifies ownership then deletes the plan', async () => {
    prisma.dietPlan.findUnique.mockResolvedValue({ id: 'p1', userId: 'u1' });
    prisma.dietPlan.delete.mockResolvedValue({});

    const result = await svc.remove('u1', 'p1');

    expect(result).toEqual({ success: true });
    expect(prisma.dietPlan.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
  });

  it('activate deactivates all user plans then activates the target', async () => {
    prisma.dietPlan.findUnique.mockResolvedValue({ id: 'p1', userId: 'u1' });

    await svc.activate('u1', 'p1');

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.dietPlan.updateMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      data: { isActive: false },
    });
    expect(prisma.dietPlan.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { isActive: true },
    });
  });
});
