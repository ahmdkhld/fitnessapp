import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateScheduleStatusDto } from './dto/update-status.dto';

/**
 * Generates daily_schedule_items by combining a user's active diet plan
 * meals and active supplement plan supplements, filtering by frequency.
 */
@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDay(userId: string, date: Date) {
    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);
    return this.prisma.dailyScheduleItem.findMany({
      where: { userId, date: dayStart },
      orderBy: [{ scheduledTime: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async updateStatus(userId: string, itemId: string, dto: UpdateScheduleStatusDto) {
    const item = await this.prisma.dailyScheduleItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Schedule item not found');
    if (item.userId !== userId) throw new ForbiddenException();

    return this.prisma.dailyScheduleItem.update({
      where: { id: itemId },
      data: {
        status: dto.status,
        notes: dto.notes,
        completedAt: dto.status === 'completed' ? new Date() : null,
      },
    });
  }

  /**
   * Generate schedule items for a single day for one user.
   * Idempotent: deletes any existing items for that day first.
   */
  async generateDay(userId: string, date: Date) {
    const day = new Date(date);
    day.setUTCHours(0, 0, 0, 0);
    const dow = day.getUTCDay() === 0 ? 7 : day.getUTCDay(); // 1..7 (Mon..Sun)

    const [dietPlan, supplementPlan] = await Promise.all([
      this.prisma.dietPlan.findFirst({
        where: { userId, isActive: true },
        include: { meals: { include: { ingredients: true } } },
      }),
      this.prisma.supplementPlan.findFirst({
        where: { userId, isActive: true },
        include: { supplements: true },
      }),
    ]);

    await this.prisma.dailyScheduleItem.deleteMany({
      where: { userId, date: day },
    });

    const items: Array<{
      userId: string;
      date: Date;
      itemType: string;
      referenceId: string;
      title: string;
      subtitle: string | null;
      scheduledTime: Date;
      sortOrder: number;
    }> = [];

    if (dietPlan) {
      for (const meal of dietPlan.meals) {
        const ingredientList = meal.ingredients
          .map((i) => (i.quantity ? `${i.name} (${i.quantity})` : i.name))
          .join(', ');
        items.push({
          userId,
          date: day,
          itemType: 'meal',
          referenceId: meal.id,
          title: meal.name,
          subtitle: ingredientList || (meal.calories ? `${meal.calories} kcal` : null),
          scheduledTime: meal.scheduledTime,
          sortOrder: meal.sortOrder,
        });
      }
    }

    if (supplementPlan) {
      for (const supp of supplementPlan.supplements) {
        if (
          supp.frequency === 'custom' &&
          supp.frequencyDays &&
          supp.frequencyDays.length > 0 &&
          !supp.frequencyDays.includes(dow)
        ) {
          continue;
        }
        if (supp.frequency === 'weekdays' && dow > 5) continue;

        items.push({
          userId,
          date: day,
          itemType: 'supplement',
          referenceId: supp.id,
          title: supp.name,
          subtitle: [supp.dosage, supp.timingNote].filter(Boolean).join(' · ') || null,
          scheduledTime: supp.scheduledTime,
          sortOrder: supp.sortOrder,
        });
      }
    }

    if (items.length > 0) {
      await this.prisma.dailyScheduleItem.createMany({ data: items });
    }

    return { count: items.length };
  }

  async generateForAllUsers(daysAhead = 7) {
    const users = await this.prisma.user.findMany({ select: { id: true } });
    let total = 0;
    for (const u of users) {
      for (let i = 0; i < daysAhead; i++) {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() + i);
        const result = await this.generateDay(u.id, date);
        total += result.count;
      }
    }
    this.logger.log(`Generated ${total} schedule items for ${users.length} users`);
    return { users: users.length, items: total };
  }
}
