import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDietPlanDto } from './dto/create-diet-plan.dto';
import { UpdateDietPlanDto } from './dto/update-diet-plan.dto';

@Injectable()
export class DietPlansService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.dietPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const plan = await this.prisma.dietPlan.findUnique({
      where: { id },
      include: { meals: { include: { ingredients: true }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!plan) throw new NotFoundException('Diet plan not found');
    if (plan.userId !== userId) throw new ForbiddenException();
    return plan;
  }

  create(userId: string, dto: CreateDietPlanDto) {
    return this.prisma.dietPlan.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateDietPlanDto) {
    await this.findOne(userId, id);
    return this.prisma.dietPlan.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.dietPlan.delete({ where: { id } });
    return { success: true };
  }

  async activate(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.$transaction([
      this.prisma.dietPlan.updateMany({ where: { userId }, data: { isActive: false } }),
      this.prisma.dietPlan.update({ where: { id }, data: { isActive: true } }),
    ]);
  }
}
