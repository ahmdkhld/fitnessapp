import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplementPlanDto } from './dto/create-supplement-plan.dto';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';

function timeToDate(time: string): Date {
  return new Date(`1970-01-01T${time}Z`);
}

@Injectable()
export class SupplementsService {
  constructor(private readonly prisma: PrismaService) {}

  listPlans(userId: string) {
    return this.prisma.supplementPlan.findMany({
      where: { userId },
      include: { supplements: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findPlan(userId: string, id: string) {
    const plan = await this.prisma.supplementPlan.findUnique({
      where: { id },
      include: { supplements: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!plan) throw new NotFoundException('Supplement plan not found');
    if (plan.userId !== userId) throw new ForbiddenException();
    return plan;
  }

  createPlan(userId: string, dto: CreateSupplementPlanDto) {
    return this.prisma.supplementPlan.create({ data: { ...dto, userId } });
  }

  async deletePlan(userId: string, id: string) {
    await this.findPlan(userId, id);
    await this.prisma.supplementPlan.delete({ where: { id } });
    return { success: true };
  }

  async activatePlan(userId: string, id: string) {
    await this.findPlan(userId, id);
    return this.prisma.$transaction([
      this.prisma.supplementPlan.updateMany({ where: { userId }, data: { isActive: false } }),
      this.prisma.supplementPlan.update({ where: { id }, data: { isActive: true } }),
    ]);
  }

  addSupplement(planId: string, dto: CreateSupplementDto) {
    const { scheduledTime, ...rest } = dto;
    return this.prisma.supplement.create({
      data: {
        ...rest,
        scheduledTime: timeToDate(scheduledTime),
        supplementPlanId: planId,
      },
    });
  }

  updateSupplement(id: string, dto: UpdateSupplementDto) {
    const { scheduledTime, ...rest } = dto;
    return this.prisma.supplement.update({
      where: { id },
      data: {
        ...rest,
        ...(scheduledTime ? { scheduledTime: timeToDate(scheduledTime) } : {}),
      },
    });
  }

  async removeSupplement(id: string) {
    await this.prisma.supplement.delete({ where: { id } });
    return { success: true };
  }
}
