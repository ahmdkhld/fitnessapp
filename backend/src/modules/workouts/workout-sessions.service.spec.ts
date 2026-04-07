import { WorkoutSessionsService } from './workout-sessions.service';

/**
 * Integration-ish tests exercising the private PR detection and
 * auto-progression logic via a fake Prisma. We only mock what the
 * service actually touches — the rest is plain JavaScript.
 */
describe('WorkoutSessionsService — PR detection + auto-progression', () => {
  const dayExerciseId = 'dx1';
  const exerciseId = 'ex1';

  function makePrisma(overrides: Partial<any> = {}) {
    const state = {
      prs: [] as Array<{
        id: string;
        userId: string;
        exerciseId: string;
        recordType: string;
        value: number;
        unit: string;
        setId?: string;
      }>,
      dayExercise: {
        id: dayExerciseId,
        workoutDayId: 'd1',
        exerciseId,
        targetSets: 3,
        targetWeightKg: { toString: () => '100' },
        progressionKg: { toString: () => '2.5' },
        exercise: { isCardio: false },
      } as any,
      updatedWeight: null as number | null,
    };
    return {
      state,
      personalRecord: {
        findFirst: jest.fn(async ({ where, orderBy }: any) => {
          const candidates = state.prs.filter(
            (p) =>
              p.userId === where.userId &&
              p.exerciseId === where.exerciseId &&
              p.recordType === where.recordType,
          );
          if (candidates.length === 0) return null;
          return candidates.sort((a, b) => b.value - a.value)[0];
        }),
        createMany: jest.fn(async ({ data }: { data: any[] }) => {
          for (const d of data) {
            state.prs.push({ id: `pr${state.prs.length + 1}`, ...d });
          }
          return { count: data.length };
        }),
      },
      workoutSet: {
        findMany: jest.fn(async ({ where }: any) =>
          overrides.loggedSets ?? [
            { weightKg: 100, reps: 5 },
            { weightKg: 100, reps: 5 },
            { weightKg: 100, reps: 5 },
          ],
        ),
      },
      workoutDayExercise: {
        findMany: jest.fn(async () => [state.dayExercise]),
        update: jest.fn(async ({ data }: any) => {
          state.updatedWeight = Number(data.targetWeightKg);
          return { ...state.dayExercise, targetWeightKg: data.targetWeightKg };
        }),
      },
      workoutSession: {
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      dailyScheduleItem: {
        updateMany: jest.fn(),
      },
    } as any;
  }

  it('inserts 1RM/3RM/5RM/estimated/max_volume PRs for a fresh user', async () => {
    const prisma = makePrisma();
    const svc = new WorkoutSessionsService(prisma);
    // Private method access via bracket notation
    await (svc as any).detectPRs('u1', {
      id: 's1',
      exerciseId,
      reps: 5,
      weightKg: { toString: () => '100' },
      durationSec: null,
      distanceKm: null,
    });
    const types = prisma.state.prs.map((p) => p.recordType).sort();
    expect(types).toEqual(
      ['1rm', '3rm', '5rm', 'estimated_1rm', 'max_volume'].sort(),
    );
  });

  it('skips N-RM PRs when the new lift is lower than an existing record', async () => {
    const prisma = makePrisma();
    prisma.state.prs.push({
      id: 'pr0',
      userId: 'u1',
      exerciseId,
      recordType: '5rm',
      value: 120,
      unit: 'kg',
    });
    const svc = new WorkoutSessionsService(prisma);
    await (svc as any).detectPRs('u1', {
      id: 's1',
      exerciseId,
      reps: 5,
      weightKg: { toString: () => '100' },
      durationSec: null,
      distanceKm: null,
    });
    const fiveRmPRs = prisma.state.prs.filter((p) => p.recordType === '5rm');
    expect(fiveRmPRs).toHaveLength(1);
    expect(fiveRmPRs[0].value).toBe(120);
  });

  it('records max_distance for a cardio set', async () => {
    const prisma = makePrisma();
    const svc = new WorkoutSessionsService(prisma);
    await (svc as any).detectPRs('u1', {
      id: 's1',
      exerciseId,
      reps: null,
      weightKg: null,
      durationSec: 1800,
      distanceKm: { toString: () => '5.2' },
    });
    const dist = prisma.state.prs.find((p) => p.recordType === 'max_distance');
    expect(dist).toBeDefined();
    expect(dist?.value).toBe(5.2);
  });

  it('auto-progression bumps targetWeightKg when every set hits target', async () => {
    const prisma = makePrisma();
    const svc = new WorkoutSessionsService(prisma);
    await (svc as any).applyAutoProgression('d1', 's1');
    expect(prisma.state.updatedWeight).toBe(102.5);
  });

  it('auto-progression skips when the user missed one rep range', async () => {
    const prisma = makePrisma({
      loggedSets: [
        { weightKg: 100, reps: 5 },
        { weightKg: 95, reps: 5 }, // dropped 5kg
        { weightKg: 100, reps: 5 },
      ],
    });
    const svc = new WorkoutSessionsService(prisma);
    await (svc as any).applyAutoProgression('d1', 's1');
    expect(prisma.state.updatedWeight).toBeNull();
  });
});
