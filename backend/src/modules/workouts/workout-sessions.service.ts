import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { StartSessionDto } from './dto/start-session.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';
import { estimate1rm, setVolume } from './calculators';

@Injectable()
export class WorkoutSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ========== SESSIONS ==========

  async start(userId: string, dto: StartSessionDto) {
    // Reject sessions that point at a template day — those exercises
    // are shared and would get corrupted by auto-progression.
    if (dto.workoutDayId) {
      const day = await this.prisma.workoutDay.findUnique({
        where: { id: dto.workoutDayId },
        include: { plan: { select: { userId: true } } },
      });
      if (!day) throw new NotFoundException('Workout day not found');
      if (day.plan.userId === null) {
        throw new ForbiddenException(
          'Clone the template into a personal plan before starting a session',
        );
      }
      if (day.plan.userId !== userId) {
        throw new ForbiddenException();
      }
    }

    // Auto-close any in-progress session older than 12h to avoid zombies
    await this.prisma.workoutSession.updateMany({
      where: {
        userId,
        status: 'in_progress',
        startedAt: { lt: new Date(Date.now() - 12 * 3600_000) },
      },
      data: { status: 'abandoned' },
    });

    return this.prisma.workoutSession.create({
      data: {
        userId,
        workoutDayId: dto.workoutDayId ?? null,
        date: dto.date ? new Date(dto.date) : new Date(),
        startedAt: new Date(),
        bodyweightKg: dto.bodyweightKg,
        energyLevel: dto.energyLevel,
        status: 'in_progress',
      },
      include: this.sessionInclude(),
    });
  }

  list(userId: string, from?: Date, to?: Date) {
    return this.prisma.workoutSession.findMany({
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
      include: this.sessionInclude(),
    });
  }

  async findOne(userId: string, id: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id },
      include: this.sessionInclude(),
    });
    if (!session) throw new NotFoundException();
    if (session.userId !== userId) throw new ForbiddenException();
    return session;
  }

  async complete(userId: string, id: string, dto: CompleteSessionDto) {
    const session = await this.findOne(userId, id);
    if (session.status === 'completed') return session;

    const completedAt = new Date();
    const durationMin = session.startedAt
      ? Math.round(
          (completedAt.getTime() - session.startedAt.getTime()) / 60_000,
        )
      : undefined;

    const updated = await this.prisma.workoutSession.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt,
        durationMin,
        notes: dto.notes,
        energyLevel: dto.energyLevel ?? session.energyLevel,
      },
      include: this.sessionInclude(),
    });

    // Apply auto-progression to the plan (fire-and-forget best effort)
    if (updated.workoutDayId) {
      await this.applyAutoProgression(updated.workoutDayId, updated.id);
    }
    // Mirror completion into the daily schedule item if present
    await this.markScheduleItemCompleted(userId, updated);

    return updated;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.workoutSession.delete({ where: { id } });
    return { success: true };
  }

  // ========== SETS ==========

  async logSet(userId: string, sessionId: string, dto: CreateSetDto) {
    const session = await this.findOne(userId, sessionId);

    // Insert the set and run PR detection inside a single interactive
    // transaction so two simultaneous logSet calls can't observe the
    // same "previous max" and produce duplicate records.
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.workoutSet.create({
        data: {
          sessionId,
          exerciseId: dto.exerciseId,
          setNumber: dto.setNumber,
          reps: dto.reps,
          weightKg: dto.weightKg,
          rpe: dto.rpe,
          durationSec: dto.durationSec,
          distanceKm: dto.distanceKm,
          isWarmup: dto.isWarmup ?? false,
          isFailure: dto.isFailure ?? false,
          restSeconds: dto.restSeconds,
          notes: dto.notes,
        },
      });

      if (!created.isWarmup) {
        await this.detectPRs(tx, session.userId, created);
      }
      return created;
    });
  }

  async updateSet(userId: string, setId: string, dto: UpdateSetDto) {
    const set = await this.prisma.workoutSet.findUnique({
      where: { id: setId },
      include: { session: true },
    });
    if (!set) throw new NotFoundException();
    if (set.session.userId !== userId) throw new ForbiddenException();
    return this.prisma.workoutSet.update({ where: { id: setId }, data: dto });
  }

  async removeSet(userId: string, setId: string) {
    const set = await this.prisma.workoutSet.findUnique({
      where: { id: setId },
      include: { session: true },
    });
    if (!set) throw new NotFoundException();
    if (set.session.userId !== userId) throw new ForbiddenException();
    await this.prisma.workoutSet.delete({ where: { id: setId } });
    return { success: true };
  }

  // ========== INTERNAL ==========

  /**
   * Scans recent PRs for this (user, exercise) tuple and inserts any new
   * records the freshly logged set established. Handles:
   *   - N-rep max by weight (1RM, 3RM, 5RM, 10RM)
   *   - Estimated 1RM (Epley/Brzycki)
   *   - Max volume in a single set
   *   - Fastest distance for cardio
   */
  private async detectPRs(
    tx: Prisma.TransactionClient,
    userId: string,
    set: {
      id: string;
      exerciseId: string;
      reps: number | null;
      weightKg: Prisma.Decimal | null;
      durationSec: number | null;
      distanceKm: Prisma.Decimal | null;
    },
  ) {
    const records: Array<{
      recordType: string;
      value: number;
      unit: string;
    }> = [];

    const weight = set.weightKg ? Number(set.weightKg) : null;
    const reps = set.reps;

    if (weight && reps) {
      // Exact N-RM PRs
      for (const target of [1, 3, 5, 10]) {
        if (reps >= target) {
          const rmType = `${target}rm`;
          const prev = await tx.personalRecord.findFirst({
            where: { userId, exerciseId: set.exerciseId, recordType: rmType },
            orderBy: { value: 'desc' },
          });
          if (!prev || weight > Number(prev.value)) {
            records.push({ recordType: rmType, value: weight, unit: 'kg' });
          }
        }
      }
      // Estimated 1RM
      const est = estimate1rm(weight, reps);
      const prevEst = await tx.personalRecord.findFirst({
        where: {
          userId,
          exerciseId: set.exerciseId,
          recordType: 'estimated_1rm',
        },
        orderBy: { value: 'desc' },
      });
      if (!prevEst || est > Number(prevEst.value)) {
        records.push({ recordType: 'estimated_1rm', value: est, unit: 'kg' });
      }

      // Max single-set volume
      const vol = setVolume(weight, reps);
      const prevVol = await tx.personalRecord.findFirst({
        where: {
          userId,
          exerciseId: set.exerciseId,
          recordType: 'max_volume',
        },
        orderBy: { value: 'desc' },
      });
      if (!prevVol || vol > Number(prevVol.value)) {
        records.push({ recordType: 'max_volume', value: vol, unit: 'kg' });
      }
    }

    // Cardio PRs — furthest distance
    if (set.distanceKm) {
      const distance = Number(set.distanceKm);
      const prevDist = await tx.personalRecord.findFirst({
        where: {
          userId,
          exerciseId: set.exerciseId,
          recordType: 'max_distance',
        },
        orderBy: { value: 'desc' },
      });
      if (!prevDist || distance > Number(prevDist.value)) {
        records.push({ recordType: 'max_distance', value: distance, unit: 'km' });
      }
    }

    if (records.length === 0) return;
    await tx.personalRecord.createMany({
      data: records.map((r) => ({
        userId,
        exerciseId: set.exerciseId,
        recordType: r.recordType,
        value: r.value,
        unit: r.unit,
        setId: set.id,
      })),
    });
  }

  /**
   * Auto-progression: if the user hit every target set for an exercise
   * at or above the prescribed weight, bump the target weight by
   * `progressionKg`. Runs when a session is marked complete.
   */
  private async applyAutoProgression(workoutDayId: string, sessionId: string) {
    // Wrap the read-evaluate-write loop in a transaction so two
    // sessions completing concurrently can't double-bump the same row.
    await this.prisma.$transaction(async (tx) => {
      const dayExercises = await tx.workoutDayExercise.findMany({
        where: { workoutDayId },
        include: { exercise: true, day: { select: { plan: { select: { userId: true } } } } },
      });

      for (const row of dayExercises) {
        // Defence-in-depth: never write to a template's prescription rows.
        if (row.day.plan.userId === null) continue;
        if (Number(row.progressionKg) <= 0) continue;
        if (row.exercise.isCardio) continue;
        if (!row.targetWeightKg) continue;

        const sets = await tx.workoutSet.findMany({
          where: {
            sessionId,
            exerciseId: row.exerciseId,
            isWarmup: false,
          },
        });

        if (sets.length < row.targetSets) continue;

        const target = Number(row.targetWeightKg);
        const allHitTarget = sets.every(
          (s) => s.weightKg != null && Number(s.weightKg) >= target,
        );
        if (!allHitTarget) continue;

        await tx.workoutDayExercise.update({
          where: { id: row.id },
          data: {
            targetWeightKg: target + Number(row.progressionKg),
          },
        });
      }
    });
  }

  private async markScheduleItemCompleted(
    userId: string,
    session: { date: Date; workoutDayId: string | null },
  ) {
    if (!session.workoutDayId) return;
    const day = new Date(session.date);
    day.setUTCHours(0, 0, 0, 0);
    await this.prisma.dailyScheduleItem.updateMany({
      where: {
        userId,
        date: day,
        itemType: 'workout',
        referenceId: session.workoutDayId,
      },
      data: { status: 'completed', completedAt: new Date() },
    });
  }

  private sessionInclude() {
    return {
      sets: {
        orderBy: [{ exerciseId: 'asc' as const }, { setNumber: 'asc' as const }],
        include: { exercise: true },
      },
      day: { include: { plan: true } },
    };
  }
}
