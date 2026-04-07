import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DailyNotesService {
  constructor(private readonly prisma: PrismaService) {}

  get(userId: string, date: Date) {
    const day = new Date(date);
    day.setUTCHours(0, 0, 0, 0);
    return this.prisma.dailyNote.findFirst({ where: { userId, date: day } });
  }

  upsert(
    userId: string,
    date: Date,
    data: { symptoms?: any; mood?: number; notes?: string },
  ) {
    const day = new Date(date);
    day.setUTCHours(0, 0, 0, 0);
    return this.prisma.dailyNote.create({
      data: { userId, date: day, ...data },
    });
  }
}
