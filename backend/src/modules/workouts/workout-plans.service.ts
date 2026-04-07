import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateDayDto } from './dto/create-day.dto';
import { AddDayExerciseDto } from './dto/add-day-exercise.dto';
import { UpdateDayExerciseDto } from './dto/update-day-exercise.dto';

@Injectable()
export class WorkoutPlansService {
  constructor(private readonly prisma: PrismaService) {}

  // ========== PLANS ==========

  list(userId: string) {
    return this.prisma.workoutPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { days: true } } },
    });
  }

  /** Global read-only templates surfaced to every user. */
  listTemplates() {
    return this.prisma.workoutPlan.findMany({
      where: { isTemplate: true, userId: null },
      orderBy: { daysPerWeek: 'asc' },
      include: {
        days: {
          orderBy: { sortOrder: 'asc' },
          include: {
            exercises: {
              orderBy: { sortOrder: 'asc' },
              include: { exercise: true },
            },
          },
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const plan = await this.prisma.workoutPlan.findUnique({
      where: { id },
      include: {
        days: {
          orderBy: { sortOrder: 'asc' },
          include: {
            exercises: {
              orderBy: { sortOrder: 'asc' },
              include: { exercise: true },
            },
          },
        },
      },
    });
    if (!plan) throw new NotFoundException();
    if (plan.userId && plan.userId !== userId) throw new ForbiddenException();
    return plan;
  }

  create(userId: string, dto: CreatePlanDto) {
    return this.prisma.workoutPlan.create({
      data: { ...dto, userId, isTemplate: false },
    });
  }

  async update(userId: string, id: string, dto: UpdatePlanDto) {
    const existing = await this.findOne(userId, id);
    if (!existing.userId) {
      throw new ForbiddenException('Templates cannot be edited in place');
    }
    return this.prisma.workoutPlan.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    const plan = await this.findOne(userId, id);
    if (!plan.userId) throw new ForbiddenException();
    await this.prisma.workoutPlan.delete({ where: { id } });
    return { success: true };
  }

  async activate(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.$transaction([
      this.prisma.workoutPlan.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      }),
      this.prisma.workoutPlan.update({
        where: { id },
        data: { isActive: true },
      }),
    ]);
  }

  /**
   * Clones a template (or any plan the user has access to) into a new
   * personal plan they can edit freely. Target weights + progression
   * settings carry over verbatim.
   */
  async cloneTemplate(userId: string, templateId: string) {
    const template = await this.prisma.workoutPlan.findUnique({
      where: { id: templateId },
      include: {
        days: {
          orderBy: { sortOrder: 'asc' },
          include: {
            exercises: { orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    });
    if (!template) throw new NotFoundException();
    if (template.userId && template.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.workoutPlan.create({
      data: {
        userId,
        name: `${template.name} (copy)`,
        goal: template.goal,
        splitType: template.splitType,
        daysPerWeek: template.daysPerWeek,
        description: template.description,
        isTemplate: false,
        days: {
          create: template.days.map((d) => ({
            name: d.name,
            dayOfWeek: d.dayOfWeek,
            sortOrder: d.sortOrder,
            estimatedDurationMin: d.estimatedDurationMin,
            notes: d.notes,
            exercises: {
              create: d.exercises.map((e) => ({
                exerciseId: e.exerciseId,
                sortOrder: e.sortOrder,
                targetSets: e.targetSets,
                targetReps: e.targetReps,
                targetWeightKg: e.targetWeightKg,
                targetRpe: e.targetRpe,
                restSeconds: e.restSeconds,
                tempo: e.tempo,
                supersetGroup: e.supersetGroup,
                progressionKg: e.progressionKg,
                notes: e.notes,
              })),
            },
          })),
        },
      },
      include: {
        days: { include: { exercises: { include: { exercise: true } } } },
      },
    });
  }

  // ========== DAYS ==========

  async addDay(userId: string, planId: string, dto: CreateDayDto) {
    await this.findOne(userId, planId);
    return this.prisma.workoutDay.create({
      data: { workoutPlanId: planId, ...dto },
    });
  }

  async updateDay(userId: string, dayId: string, dto: Partial<CreateDayDto>) {
    const day = await this.prisma.workoutDay.findUnique({
      where: { id: dayId },
      include: { plan: true },
    });
    if (!day) throw new NotFoundException();
    if (day.plan.userId !== userId) throw new ForbiddenException();
    return this.prisma.workoutDay.update({ where: { id: dayId }, data: dto });
  }

  async removeDay(userId: string, dayId: string) {
    const day = await this.prisma.workoutDay.findUnique({
      where: { id: dayId },
      include: { plan: true },
    });
    if (!day) throw new NotFoundException();
    if (day.plan.userId !== userId) throw new ForbiddenException();
    await this.prisma.workoutDay.delete({ where: { id: dayId } });
    return { success: true };
  }

  // ========== DAY EXERCISES ==========

  async addDayExercise(userId: string, dayId: string, dto: AddDayExerciseDto) {
    const day = await this.prisma.workoutDay.findUnique({
      where: { id: dayId },
      include: { plan: true },
    });
    if (!day || day.plan.userId !== userId) {
      throw new NotFoundException();
    }
    return this.prisma.workoutDayExercise.create({
      data: { workoutDayId: dayId, ...dto },
    });
  }

  async updateDayExercise(
    userId: string,
    exerciseRowId: string,
    dto: UpdateDayExerciseDto,
  ) {
    const row = await this.prisma.workoutDayExercise.findUnique({
      where: { id: exerciseRowId },
      include: { day: { include: { plan: true } } },
    });
    if (!row || row.day.plan.userId !== userId) {
      throw new NotFoundException();
    }
    return this.prisma.workoutDayExercise.update({
      where: { id: exerciseRowId },
      data: dto,
    });
  }

  async removeDayExercise(userId: string, exerciseRowId: string) {
    const row = await this.prisma.workoutDayExercise.findUnique({
      where: { id: exerciseRowId },
      include: { day: { include: { plan: true } } },
    });
    if (!row || row.day.plan.userId !== userId) {
      throw new NotFoundException();
    }
    await this.prisma.workoutDayExercise.delete({ where: { id: exerciseRowId } });
    return { success: true };
  }
}
