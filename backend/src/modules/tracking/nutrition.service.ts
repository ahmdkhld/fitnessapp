import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertNutritionDto } from './dto/upsert-nutrition.dto';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class NutritionService {
  constructor(private readonly prisma: PrismaService) {}

  async getByDate(userId: string, date: Date) {
    const day = startOfDay(date);
    return this.prisma.nutritionLog.findUnique({
      where: { userId_date: { userId, date: day } },
    });
  }

  async getRange(userId: string, from: Date, to: Date) {
    return this.prisma.nutritionLog.findMany({
      where: {
        userId,
        date: { gte: startOfDay(from), lte: startOfDay(to) },
      },
      orderBy: { date: 'asc' },
    });
  }

  async upsert(userId: string, dto: UpsertNutritionDto) {
    const day = startOfDay(new Date(dto.date));
    const data = {
      targetCalories: dto.targetCalories ?? null,
      actualCalories: dto.actualCalories ?? null,
      targetProteinG: dto.targetProteinG ?? null,
      actualProteinG: dto.actualProteinG ?? null,
      targetCarbsG: dto.targetCarbsG ?? null,
      actualCarbsG: dto.actualCarbsG ?? null,
      targetFatG: dto.targetFatG ?? null,
      actualFatG: dto.actualFatG ?? null,
      notes: dto.notes ?? null,
    };

    return this.prisma.nutritionLog.upsert({
      where: { userId_date: { userId, date: day } },
      create: { userId, date: day, ...data },
      update: data,
    });
  }
}
