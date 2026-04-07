import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EXERCISE_LIBRARY } from './exercises.seed';
import { PLAN_TEMPLATES } from './plan-templates.seed';

/**
 * Idempotently seeds the global exercise library and plan templates on
 * every application boot. Seeded rows have `userId = null` and
 * `isTemplate = true` so they never collide with user data.
 */
@Injectable()
export class WorkoutSeedService implements OnModuleInit {
  private readonly logger = new Logger(WorkoutSeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (process.env.SKIP_WORKOUT_SEED === 'true') return;
    try {
      await this.seedExercises();
      await this.seedTemplates();
    } catch (err) {
      this.logger.warn(
        `Workout seed skipped: ${(err as Error).message} — run migrations first`,
      );
    }
  }

  private async seedExercises() {
    let created = 0;
    for (const ex of EXERCISE_LIBRARY) {
      const existing = await this.prisma.exercise.findFirst({
        where: { userId: null, name: ex.name },
      });
      if (existing) continue;
      await this.prisma.exercise.create({
        data: {
          name: ex.name,
          category: ex.category,
          primaryMuscle: ex.primaryMuscle,
          secondaryMuscles: ex.secondaryMuscles,
          equipment: ex.equipment,
          isUnilateral: ex.isUnilateral ?? false,
          isCardio: ex.isCardio ?? false,
          instructions: ex.instructions,
        },
      });
      created++;
    }
    if (created > 0) this.logger.log(`Seeded ${created} library exercises`);
  }

  private async seedTemplates() {
    for (const template of PLAN_TEMPLATES) {
      const existing = await this.prisma.workoutPlan.findFirst({
        where: { userId: null, isTemplate: true, name: template.name },
      });
      if (existing) continue;

      const plan = await this.prisma.workoutPlan.create({
        data: {
          name: template.name,
          goal: template.goal,
          splitType: template.splitType,
          daysPerWeek: template.daysPerWeek,
          description: template.description,
          isTemplate: true,
        },
      });

      for (let d = 0; d < template.days.length; d++) {
        const dayT = template.days[d];
        const day = await this.prisma.workoutDay.create({
          data: {
            workoutPlanId: plan.id,
            name: dayT.name,
            dayOfWeek: dayT.dayOfWeek,
            sortOrder: d,
            estimatedDurationMin: dayT.estimatedDurationMin,
            notes: dayT.notes,
          },
        });

        for (let e = 0; e < dayT.exercises.length; e++) {
          const ex = dayT.exercises[e];
          const libraryEx = await this.prisma.exercise.findFirst({
            where: { userId: null, name: ex.exerciseName },
          });
          if (!libraryEx) {
            this.logger.warn(
              `Template "${template.name}" references missing exercise "${ex.exerciseName}"`,
            );
            continue;
          }
          await this.prisma.workoutDayExercise.create({
            data: {
              workoutDayId: day.id,
              exerciseId: libraryEx.id,
              sortOrder: e,
              targetSets: ex.targetSets,
              targetReps: ex.targetReps,
              targetRpe: ex.targetRpe,
              restSeconds: ex.restSeconds,
              progressionKg: ex.progressionKg ?? 0,
              supersetGroup: ex.supersetGroup,
              notes: ex.notes,
            },
          });
        }
      }
      this.logger.log(`Seeded plan template "${template.name}"`);
    }
  }
}
