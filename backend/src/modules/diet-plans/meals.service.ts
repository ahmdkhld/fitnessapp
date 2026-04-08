import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

function timeToDate(time: string): Date {
  return new Date(`1970-01-01T${time}Z`);
}

@Injectable()
export class MealsService {
  constructor(private readonly prisma: PrismaService) {}

  list(dietPlanId: string) {
    return this.prisma.meal.findMany({
      where: { dietPlanId },
      include: { ingredients: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  create(dietPlanId: string, dto: CreateMealDto) {
    const { ingredients, scheduledTime, ...rest } = dto;
    return this.prisma.meal.create({
      data: {
        ...rest,
        scheduledTime: timeToDate(scheduledTime),
        dietPlanId,
        ingredients: ingredients
          ? { create: ingredients }
          : undefined,
      },
      include: { ingredients: true },
    });
  }

  update(mealId: string, dto: UpdateMealDto) {
    const { scheduledTime, ingredients, ...rest } = dto;
    return this.prisma.meal.update({
      where: { id: mealId },
      data: {
        ...rest,
        ...(scheduledTime ? { scheduledTime: timeToDate(scheduledTime) } : {}),
        ...(ingredients !== undefined
          ? { ingredients: { deleteMany: {}, create: ingredients } }
          : {}),
      },
      include: { ingredients: true },
    });
  }

  async remove(mealId: string) {
    await this.prisma.meal.delete({ where: { id: mealId } });
    return { success: true };
  }
}
