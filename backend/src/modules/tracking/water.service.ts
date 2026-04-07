import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class WaterService {
  constructor(private readonly prisma: PrismaService) {}

  async getDay(userId: string, date: Date) {
    const day = startOfDay(date);
    const logs = await this.prisma.waterLog.findMany({
      where: { userId, date: day },
      orderBy: { loggedAt: 'asc' },
    });
    const total = logs.reduce((sum, l) => sum + l.amountMl, 0);
    return { date: day, totalMl: total, logs };
  }

  log(userId: string, amountMl: number, date?: Date) {
    return this.prisma.waterLog.create({
      data: {
        userId,
        amountMl,
        date: startOfDay(date ?? new Date()),
      },
    });
  }
}
