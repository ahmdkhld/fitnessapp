import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateBodyLogInput {
  date?: Date;
  weightKg?: number;
  waistCm?: number;
  bodyFatPct?: number;
  energyLevel?: number;
  hungerLevel?: number;
  sleepQuality?: number;
  notes?: string;
  photoUrl?: string;
}

@Injectable()
export class BodyLogService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, from?: Date, to?: Date) {
    return this.prisma.bodyLog.findMany({
      where: {
        userId,
        ...(from || to
          ? {
              date: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      orderBy: { date: 'desc' },
    });
  }

  create(userId: string, input: CreateBodyLogInput) {
    return this.prisma.bodyLog.create({
      data: {
        userId,
        date: input.date ?? new Date(),
        weightKg: input.weightKg,
        waistCm: input.waistCm,
        bodyFatPct: input.bodyFatPct,
        energyLevel: input.energyLevel,
        hungerLevel: input.hungerLevel,
        sleepQuality: input.sleepQuality,
        notes: input.notes,
        photoUrl: input.photoUrl,
      },
    });
  }
}
