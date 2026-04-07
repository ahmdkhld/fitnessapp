/**
 * Seeded workout plan templates. Users browse these in the "Templates"
 * picker and clone one into their own plans (which then get their own
 * `userId` and can be edited freely).
 */
export interface SeedPlanExercise {
  exerciseName: string;
  targetSets: number;
  targetReps: string;
  targetRpe?: number;
  restSeconds: number;
  progressionKg?: number;
  supersetGroup?: string;
  notes?: string;
}

export interface SeedPlanDay {
  name: string;
  dayOfWeek?: number; // 1..7
  estimatedDurationMin?: number;
  notes?: string;
  exercises: SeedPlanExercise[];
}

export interface SeedPlanTemplate {
  name: string;
  goal: string;
  splitType: string;
  daysPerWeek: number;
  description: string;
  days: SeedPlanDay[];
}

export const PLAN_TEMPLATES: SeedPlanTemplate[] = [
  // ---------- Full Body 3x ----------
  {
    name: 'Full Body 3×/week',
    goal: 'general_strength',
    splitType: 'full_body',
    daysPerWeek: 3,
    description:
      'A classic 3-day full-body routine for beginners and busy lifters. '
      + 'Compound-focused with small accessory blocks.',
    days: [
      {
        name: 'Day A',
        dayOfWeek: 1,
        estimatedDurationMin: 60,
        exercises: [
          { exerciseName: 'Back Squat', targetSets: 3, targetReps: '5', targetRpe: 7.5, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Barbell Bench Press', targetSets: 3, targetReps: '5', targetRpe: 7.5, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Barbell Row', targetSets: 3, targetReps: '8', targetRpe: 7.5, restSeconds: 120, progressionKg: 2.5 },
          { exerciseName: 'Plank', targetSets: 3, targetReps: '45s', restSeconds: 60 },
        ],
      },
      {
        name: 'Day B',
        dayOfWeek: 3,
        estimatedDurationMin: 60,
        exercises: [
          { exerciseName: 'Deadlift', targetSets: 3, targetReps: '5', targetRpe: 7.5, restSeconds: 240, progressionKg: 2.5 },
          { exerciseName: 'Overhead Press', targetSets: 3, targetReps: '5', targetRpe: 7.5, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Pull-Up', targetSets: 3, targetReps: '8', restSeconds: 120 },
          { exerciseName: 'Hanging Leg Raise', targetSets: 3, targetReps: '10', restSeconds: 60 },
        ],
      },
      {
        name: 'Day C',
        dayOfWeek: 5,
        estimatedDurationMin: 60,
        exercises: [
          { exerciseName: 'Front Squat', targetSets: 3, targetReps: '5', targetRpe: 7.5, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Incline Dumbbell Press', targetSets: 3, targetReps: '8', targetRpe: 8, restSeconds: 120, progressionKg: 2.5 },
          { exerciseName: 'Seated Cable Row', targetSets: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 },
          { exerciseName: 'Cable Crunch', targetSets: 3, targetReps: '12', restSeconds: 60 },
        ],
      },
    ],
  },

  // ---------- Push / Pull / Legs 6x ----------
  {
    name: 'Push Pull Legs 6×/week',
    goal: 'hypertrophy',
    splitType: 'ppl',
    daysPerWeek: 6,
    description:
      'High-volume PPL split hit twice a week. Best for intermediate '
      + 'lifters focused on muscle growth.',
    days: [
      {
        name: 'Push A',
        dayOfWeek: 1,
        estimatedDurationMin: 75,
        exercises: [
          { exerciseName: 'Barbell Bench Press', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Seated Dumbbell Press', targetSets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseName: 'Incline Dumbbell Press', targetSets: 3, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseName: 'Lateral Raise', targetSets: 4, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseName: 'Cable Triceps Pushdown', targetSets: 3, targetReps: '10-12', restSeconds: 60 },
          { exerciseName: 'Overhead Cable Extension', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Pull A',
        dayOfWeek: 2,
        estimatedDurationMin: 75,
        exercises: [
          { exerciseName: 'Deadlift', targetSets: 3, targetReps: '5', targetRpe: 8, restSeconds: 240, progressionKg: 2.5 },
          { exerciseName: 'Pull-Up', targetSets: 4, targetReps: '8', restSeconds: 120 },
          { exerciseName: 'Barbell Row', targetSets: 3, targetReps: '8', targetRpe: 8, restSeconds: 120, progressionKg: 2.5 },
          { exerciseName: 'Face Pull', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', targetSets: 3, targetReps: '10', restSeconds: 60 },
          { exerciseName: 'Hammer Curl', targetSets: 3, targetReps: '12', restSeconds: 60 },
        ],
      },
      {
        name: 'Legs A',
        dayOfWeek: 3,
        estimatedDurationMin: 75,
        exercises: [
          { exerciseName: 'Back Squat', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Romanian Deadlift', targetSets: 3, targetReps: '8', targetRpe: 8, restSeconds: 120, progressionKg: 2.5 },
          { exerciseName: 'Leg Press', targetSets: 3, targetReps: '10-12', targetRpe: 8, restSeconds: 120 },
          { exerciseName: 'Lying Leg Curl', targetSets: 3, targetReps: '12', restSeconds: 90 },
          { exerciseName: 'Standing Calf Raise', targetSets: 4, targetReps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Push B',
        dayOfWeek: 4,
        estimatedDurationMin: 75,
        exercises: [
          { exerciseName: 'Overhead Press', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Incline Barbell Bench Press', targetSets: 3, targetReps: '8', targetRpe: 8, restSeconds: 150, progressionKg: 2.5 },
          { exerciseName: 'Dumbbell Fly', targetSets: 3, targetReps: '12', restSeconds: 60 },
          { exerciseName: 'Cable Lateral Raise', targetSets: 4, targetReps: '15', restSeconds: 45 },
          { exerciseName: 'Skullcrusher', targetSets: 3, targetReps: '10', restSeconds: 60 },
          { exerciseName: 'Rope Triceps Pushdown', targetSets: 3, targetReps: '12-15', restSeconds: 45 },
        ],
      },
      {
        name: 'Pull B',
        dayOfWeek: 5,
        estimatedDurationMin: 75,
        exercises: [
          { exerciseName: 'Pendlay Row', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 150, progressionKg: 2.5 },
          { exerciseName: 'Lat Pulldown', targetSets: 3, targetReps: '10', restSeconds: 90 },
          { exerciseName: 'Dumbbell Row', targetSets: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 },
          { exerciseName: 'Reverse Pec Deck', targetSets: 3, targetReps: '15', restSeconds: 60 },
          { exerciseName: 'Preacher Curl', targetSets: 3, targetReps: '10', restSeconds: 60 },
          { exerciseName: 'Cable Curl', targetSets: 3, targetReps: '12-15', restSeconds: 45 },
        ],
      },
      {
        name: 'Legs B',
        dayOfWeek: 6,
        estimatedDurationMin: 75,
        exercises: [
          { exerciseName: 'Front Squat', targetSets: 4, targetReps: '6', targetRpe: 8, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Hip Thrust', targetSets: 3, targetReps: '10', targetRpe: 8, restSeconds: 120, progressionKg: 2.5 },
          { exerciseName: 'Bulgarian Split Squat', targetSets: 3, targetReps: '10', restSeconds: 90 },
          { exerciseName: 'Seated Leg Curl', targetSets: 3, targetReps: '12', restSeconds: 60 },
          { exerciseName: 'Seated Calf Raise', targetSets: 4, targetReps: '15', restSeconds: 60 },
        ],
      },
    ],
  },

  // ---------- Upper / Lower 4x ----------
  {
    name: 'Upper / Lower 4×/week',
    goal: 'strength_hypertrophy',
    splitType: 'upper_lower',
    daysPerWeek: 4,
    description:
      'Balanced 4-day split with one upper/lower strength day and one '
      + 'hypertrophy day. Good frequency-to-recovery ratio.',
    days: [
      {
        name: 'Upper Strength',
        dayOfWeek: 1,
        estimatedDurationMin: 70,
        exercises: [
          { exerciseName: 'Barbell Bench Press', targetSets: 4, targetReps: '4-6', targetRpe: 8, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Barbell Row', targetSets: 4, targetReps: '5', targetRpe: 8, restSeconds: 150, progressionKg: 2.5 },
          { exerciseName: 'Overhead Press', targetSets: 3, targetReps: '6', targetRpe: 8, restSeconds: 120, progressionKg: 2.5 },
          { exerciseName: 'Pull-Up', targetSets: 3, targetReps: '6-8', restSeconds: 120 },
          { exerciseName: 'EZ-Bar Curl', targetSets: 2, targetReps: '10', restSeconds: 60 },
          { exerciseName: 'Close-Grip Bench Press', targetSets: 2, targetReps: '8', restSeconds: 90 },
        ],
      },
      {
        name: 'Lower Strength',
        dayOfWeek: 2,
        estimatedDurationMin: 70,
        exercises: [
          { exerciseName: 'Back Squat', targetSets: 4, targetReps: '4-6', targetRpe: 8, restSeconds: 240, progressionKg: 2.5 },
          { exerciseName: 'Romanian Deadlift', targetSets: 3, targetReps: '6', targetRpe: 8, restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Walking Lunge', targetSets: 3, targetReps: '10', restSeconds: 90 },
          { exerciseName: 'Standing Calf Raise', targetSets: 4, targetReps: '10', restSeconds: 60 },
          { exerciseName: 'Hanging Leg Raise', targetSets: 3, targetReps: '10', restSeconds: 60 },
        ],
      },
      {
        name: 'Upper Hypertrophy',
        dayOfWeek: 4,
        estimatedDurationMin: 70,
        exercises: [
          { exerciseName: 'Incline Dumbbell Press', targetSets: 4, targetReps: '10', targetRpe: 8, restSeconds: 90 },
          { exerciseName: 'Seated Cable Row', targetSets: 4, targetReps: '10', targetRpe: 8, restSeconds: 90 },
          { exerciseName: 'Lateral Raise', targetSets: 4, targetReps: '12-15', restSeconds: 60 },
          { exerciseName: 'Lat Pulldown', targetSets: 3, targetReps: '12', restSeconds: 75 },
          { exerciseName: 'Dumbbell Curl', targetSets: 3, targetReps: '12', restSeconds: 60 },
          { exerciseName: 'Rope Triceps Pushdown', targetSets: 3, targetReps: '12', restSeconds: 60 },
        ],
      },
      {
        name: 'Lower Hypertrophy',
        dayOfWeek: 5,
        estimatedDurationMin: 70,
        exercises: [
          { exerciseName: 'Front Squat', targetSets: 3, targetReps: '8', targetRpe: 8, restSeconds: 150, progressionKg: 2.5 },
          { exerciseName: 'Leg Press', targetSets: 4, targetReps: '12', restSeconds: 120 },
          { exerciseName: 'Hip Thrust', targetSets: 3, targetReps: '10', targetRpe: 8, restSeconds: 90, progressionKg: 2.5 },
          { exerciseName: 'Lying Leg Curl', targetSets: 4, targetReps: '12', restSeconds: 60 },
          { exerciseName: 'Seated Calf Raise', targetSets: 4, targetReps: '15', restSeconds: 45 },
        ],
      },
    ],
  },

  // ---------- Starting Strength ----------
  {
    name: 'Starting Strength (novice)',
    goal: 'strength',
    splitType: 'full_body',
    daysPerWeek: 3,
    description:
      'Mark Rippetoe\'s classic novice linear progression. Two alternating '
      + 'full-body workouts run 3 days/week (A/B/A one week, B/A/B next).',
    days: [
      {
        name: 'Workout A',
        dayOfWeek: 1,
        estimatedDurationMin: 60,
        exercises: [
          { exerciseName: 'Back Squat', targetSets: 3, targetReps: '5', restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Barbell Bench Press', targetSets: 3, targetReps: '5', restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Deadlift', targetSets: 1, targetReps: '5', restSeconds: 240, progressionKg: 5 },
        ],
      },
      {
        name: 'Workout B',
        dayOfWeek: 3,
        estimatedDurationMin: 60,
        exercises: [
          { exerciseName: 'Back Squat', targetSets: 3, targetReps: '5', restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Overhead Press', targetSets: 3, targetReps: '5', restSeconds: 180, progressionKg: 2.5 },
          { exerciseName: 'Deadlift', targetSets: 1, targetReps: '5', restSeconds: 240, progressionKg: 5 },
        ],
      },
    ],
  },

  // ---------- 5/3/1 BBB ----------
  {
    name: '5/3/1 Boring But Big',
    goal: 'strength',
    splitType: 'upper_lower',
    daysPerWeek: 4,
    description:
      'Jim Wendler\'s 5/3/1 with 5×10 "BBB" assistance on the main lift. '
      + 'Percentages are relative to training max — update target weights each cycle.',
    days: [
      {
        name: 'Overhead Press Day',
        dayOfWeek: 1,
        estimatedDurationMin: 60,
        exercises: [
          { exerciseName: 'Overhead Press', targetSets: 3, targetReps: '5/3/1', targetRpe: 8, restSeconds: 180 },
          { exerciseName: 'Overhead Press', targetSets: 5, targetReps: '10', restSeconds: 90, notes: 'BBB @ 50-60% TM' },
          { exerciseName: 'Chin-Up', targetSets: 5, targetReps: '10', restSeconds: 60 },
        ],
      },
      {
        name: 'Deadlift Day',
        dayOfWeek: 2,
        estimatedDurationMin: 60,
        exercises: [
          { exerciseName: 'Deadlift', targetSets: 3, targetReps: '5/3/1', targetRpe: 8, restSeconds: 240 },
          { exerciseName: 'Romanian Deadlift', targetSets: 5, targetReps: '10', restSeconds: 120, notes: 'BBB @ 50-60% TM' },
          { exerciseName: 'Hanging Leg Raise', targetSets: 5, targetReps: '10', restSeconds: 60 },
        ],
      },
      {
        name: 'Bench Day',
        dayOfWeek: 4,
        estimatedDurationMin: 60,
        exercises: [
          { exerciseName: 'Barbell Bench Press', targetSets: 3, targetReps: '5/3/1', targetRpe: 8, restSeconds: 180 },
          { exerciseName: 'Barbell Bench Press', targetSets: 5, targetReps: '10', restSeconds: 90, notes: 'BBB @ 50-60% TM' },
          { exerciseName: 'Dumbbell Row', targetSets: 5, targetReps: '10', restSeconds: 60 },
        ],
      },
      {
        name: 'Squat Day',
        dayOfWeek: 5,
        estimatedDurationMin: 60,
        exercises: [
          { exerciseName: 'Back Squat', targetSets: 3, targetReps: '5/3/1', targetRpe: 8, restSeconds: 240 },
          { exerciseName: 'Back Squat', targetSets: 5, targetReps: '10', restSeconds: 120, notes: 'BBB @ 50-60% TM' },
          { exerciseName: 'Plank', targetSets: 3, targetReps: '60s', restSeconds: 45 },
        ],
      },
    ],
  },

  // ---------- Bodyweight at Home ----------
  {
    name: 'Bodyweight at Home',
    goal: 'general_health',
    splitType: 'full_body',
    daysPerWeek: 3,
    description:
      'Minimal-equipment routine for travel or home. Uses pause reps and '
      + 'tempo to drive progress instead of external load.',
    days: [
      {
        name: 'Day A',
        dayOfWeek: 1,
        estimatedDurationMin: 40,
        exercises: [
          { exerciseName: 'Push-Up', targetSets: 4, targetReps: '15', restSeconds: 60 },
          { exerciseName: 'Pull-Up', targetSets: 4, targetReps: 'AMRAP', restSeconds: 90 },
          { exerciseName: 'Goblet Squat', targetSets: 4, targetReps: '15', restSeconds: 60 },
          { exerciseName: 'Plank', targetSets: 3, targetReps: '45s', restSeconds: 45 },
        ],
      },
      {
        name: 'Day B',
        dayOfWeek: 3,
        estimatedDurationMin: 40,
        exercises: [
          { exerciseName: 'Dip', targetSets: 4, targetReps: '10', restSeconds: 90 },
          { exerciseName: 'Chin-Up', targetSets: 4, targetReps: 'AMRAP', restSeconds: 90 },
          { exerciseName: 'Bulgarian Split Squat', targetSets: 3, targetReps: '12', restSeconds: 60 },
          { exerciseName: 'Hanging Leg Raise', targetSets: 3, targetReps: '12', restSeconds: 45 },
        ],
      },
      {
        name: 'Day C',
        dayOfWeek: 5,
        estimatedDurationMin: 40,
        exercises: [
          { exerciseName: 'Push-Up', targetSets: 5, targetReps: '12', restSeconds: 60 },
          { exerciseName: 'Pull-Up', targetSets: 5, targetReps: 'AMRAP', restSeconds: 90 },
          { exerciseName: 'Walking Lunge', targetSets: 3, targetReps: '20 steps', restSeconds: 60 },
          { exerciseName: 'Ab Wheel Rollout', targetSets: 3, targetReps: '10', restSeconds: 60 },
        ],
      },
    ],
  },
];
