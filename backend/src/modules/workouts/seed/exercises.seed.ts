/**
 * Global exercise library. Every row has `userId = null` so it's
 * visible to all users and not editable by them.
 *
 * Categories: push | pull | legs | core | cardio | mobility | full_body
 * Equipment : barbell | dumbbell | machine | bodyweight | cable |
 *             kettlebell | band | cardio_machine
 */
export interface SeedExercise {
  name: string;
  category: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string;
  isUnilateral?: boolean;
  isCardio?: boolean;
  instructions?: string;
}

export const EXERCISE_LIBRARY: SeedExercise[] = [
  // ===== PUSH — Chest =====
  { name: 'Barbell Bench Press', category: 'push', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'front_delts'], equipment: 'barbell' },
  { name: 'Incline Barbell Bench Press', category: 'push', primaryMuscle: 'upper_chest', secondaryMuscles: ['triceps', 'front_delts'], equipment: 'barbell' },
  { name: 'Decline Barbell Bench Press', category: 'push', primaryMuscle: 'lower_chest', secondaryMuscles: ['triceps'], equipment: 'barbell' },
  { name: 'Dumbbell Bench Press', category: 'push', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'front_delts'], equipment: 'dumbbell' },
  { name: 'Incline Dumbbell Press', category: 'push', primaryMuscle: 'upper_chest', secondaryMuscles: ['triceps', 'front_delts'], equipment: 'dumbbell' },
  { name: 'Dumbbell Fly', category: 'push', primaryMuscle: 'chest', secondaryMuscles: ['front_delts'], equipment: 'dumbbell' },
  { name: 'Cable Crossover', category: 'push', primaryMuscle: 'chest', secondaryMuscles: ['front_delts'], equipment: 'cable' },
  { name: 'Pec Deck', category: 'push', primaryMuscle: 'chest', secondaryMuscles: [], equipment: 'machine' },
  { name: 'Push-Up', category: 'push', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'core'], equipment: 'bodyweight' },
  { name: 'Dip', category: 'push', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'front_delts'], equipment: 'bodyweight' },

  // ===== PUSH — Shoulders =====
  { name: 'Overhead Press', category: 'push', primaryMuscle: 'front_delts', secondaryMuscles: ['triceps', 'upper_chest'], equipment: 'barbell' },
  { name: 'Seated Dumbbell Press', category: 'push', primaryMuscle: 'front_delts', secondaryMuscles: ['triceps'], equipment: 'dumbbell' },
  { name: 'Arnold Press', category: 'push', primaryMuscle: 'front_delts', secondaryMuscles: ['side_delts', 'triceps'], equipment: 'dumbbell' },
  { name: 'Lateral Raise', category: 'push', primaryMuscle: 'side_delts', secondaryMuscles: [], equipment: 'dumbbell' },
  { name: 'Cable Lateral Raise', category: 'push', primaryMuscle: 'side_delts', secondaryMuscles: [], equipment: 'cable' },
  { name: 'Face Pull', category: 'pull', primaryMuscle: 'rear_delts', secondaryMuscles: ['traps', 'rotator_cuff'], equipment: 'cable' },
  { name: 'Reverse Pec Deck', category: 'pull', primaryMuscle: 'rear_delts', secondaryMuscles: ['traps'], equipment: 'machine' },
  { name: 'Upright Row', category: 'pull', primaryMuscle: 'traps', secondaryMuscles: ['side_delts', 'biceps'], equipment: 'barbell' },

  // ===== PUSH — Triceps =====
  { name: 'Close-Grip Bench Press', category: 'push', primaryMuscle: 'triceps', secondaryMuscles: ['chest'], equipment: 'barbell' },
  { name: 'Skullcrusher', category: 'push', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: 'barbell' },
  { name: 'Cable Triceps Pushdown', category: 'push', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: 'cable' },
  { name: 'Rope Triceps Pushdown', category: 'push', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: 'cable' },
  { name: 'Overhead Cable Extension', category: 'push', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: 'cable' },
  { name: 'Dumbbell Kickback', category: 'push', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: 'dumbbell', isUnilateral: true },

  // ===== PULL — Back =====
  { name: 'Deadlift', category: 'pull', primaryMuscle: 'lower_back', secondaryMuscles: ['glutes', 'hamstrings', 'traps', 'lats'], equipment: 'barbell' },
  { name: 'Romanian Deadlift', category: 'legs', primaryMuscle: 'hamstrings', secondaryMuscles: ['glutes', 'lower_back'], equipment: 'barbell' },
  { name: 'Pull-Up', category: 'pull', primaryMuscle: 'lats', secondaryMuscles: ['biceps', 'rear_delts'], equipment: 'bodyweight' },
  { name: 'Chin-Up', category: 'pull', primaryMuscle: 'lats', secondaryMuscles: ['biceps'], equipment: 'bodyweight' },
  { name: 'Lat Pulldown', category: 'pull', primaryMuscle: 'lats', secondaryMuscles: ['biceps', 'rear_delts'], equipment: 'cable' },
  { name: 'Barbell Row', category: 'pull', primaryMuscle: 'mid_back', secondaryMuscles: ['lats', 'biceps', 'rear_delts'], equipment: 'barbell' },
  { name: 'Pendlay Row', category: 'pull', primaryMuscle: 'mid_back', secondaryMuscles: ['lats', 'biceps'], equipment: 'barbell' },
  { name: 'Dumbbell Row', category: 'pull', primaryMuscle: 'lats', secondaryMuscles: ['biceps', 'rear_delts'], equipment: 'dumbbell', isUnilateral: true },
  { name: 'Seated Cable Row', category: 'pull', primaryMuscle: 'mid_back', secondaryMuscles: ['lats', 'biceps'], equipment: 'cable' },
  { name: 'T-Bar Row', category: 'pull', primaryMuscle: 'mid_back', secondaryMuscles: ['lats', 'biceps'], equipment: 'machine' },
  { name: 'Straight-Arm Pulldown', category: 'pull', primaryMuscle: 'lats', secondaryMuscles: [], equipment: 'cable' },
  { name: 'Shrug', category: 'pull', primaryMuscle: 'traps', secondaryMuscles: [], equipment: 'dumbbell' },

  // ===== PULL — Biceps =====
  { name: 'Barbell Curl', category: 'pull', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell' },
  { name: 'EZ-Bar Curl', category: 'pull', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell' },
  { name: 'Dumbbell Curl', category: 'pull', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell' },
  { name: 'Hammer Curl', category: 'pull', primaryMuscle: 'biceps', secondaryMuscles: ['forearms', 'brachialis'], equipment: 'dumbbell' },
  { name: 'Incline Dumbbell Curl', category: 'pull', primaryMuscle: 'biceps', secondaryMuscles: [], equipment: 'dumbbell' },
  { name: 'Preacher Curl', category: 'pull', primaryMuscle: 'biceps', secondaryMuscles: [], equipment: 'barbell' },
  { name: 'Cable Curl', category: 'pull', primaryMuscle: 'biceps', secondaryMuscles: [], equipment: 'cable' },
  { name: 'Concentration Curl', category: 'pull', primaryMuscle: 'biceps', secondaryMuscles: [], equipment: 'dumbbell', isUnilateral: true },

  // ===== LEGS — Quads =====
  { name: 'Back Squat', category: 'legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings', 'core'], equipment: 'barbell' },
  { name: 'Front Squat', category: 'legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'core'], equipment: 'barbell' },
  { name: 'Goblet Squat', category: 'legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'core'], equipment: 'dumbbell' },
  { name: 'Bulgarian Split Squat', category: 'legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'dumbbell', isUnilateral: true },
  { name: 'Walking Lunge', category: 'legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'dumbbell', isUnilateral: true },
  { name: 'Leg Press', category: 'legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'machine' },
  { name: 'Hack Squat', category: 'legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes'], equipment: 'machine' },
  { name: 'Leg Extension', category: 'legs', primaryMuscle: 'quads', secondaryMuscles: [], equipment: 'machine' },
  { name: 'Step-Up', category: 'legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes'], equipment: 'dumbbell', isUnilateral: true },

  // ===== LEGS — Hamstrings / Glutes =====
  { name: 'Lying Leg Curl', category: 'legs', primaryMuscle: 'hamstrings', secondaryMuscles: [], equipment: 'machine' },
  { name: 'Seated Leg Curl', category: 'legs', primaryMuscle: 'hamstrings', secondaryMuscles: [], equipment: 'machine' },
  { name: 'Good Morning', category: 'legs', primaryMuscle: 'hamstrings', secondaryMuscles: ['lower_back', 'glutes'], equipment: 'barbell' },
  { name: 'Hip Thrust', category: 'legs', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], equipment: 'barbell' },
  { name: 'Glute Bridge', category: 'legs', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], equipment: 'bodyweight' },
  { name: 'Cable Kickback', category: 'legs', primaryMuscle: 'glutes', secondaryMuscles: [], equipment: 'cable', isUnilateral: true },
  { name: 'Sumo Deadlift', category: 'pull', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings', 'quads', 'lower_back'], equipment: 'barbell' },

  // ===== LEGS — Calves =====
  { name: 'Standing Calf Raise', category: 'legs', primaryMuscle: 'calves', secondaryMuscles: [], equipment: 'machine' },
  { name: 'Seated Calf Raise', category: 'legs', primaryMuscle: 'calves', secondaryMuscles: [], equipment: 'machine' },
  { name: 'Donkey Calf Raise', category: 'legs', primaryMuscle: 'calves', secondaryMuscles: [], equipment: 'machine' },

  // ===== CORE =====
  { name: 'Plank', category: 'core', primaryMuscle: 'core', secondaryMuscles: ['glutes'], equipment: 'bodyweight' },
  { name: 'Side Plank', category: 'core', primaryMuscle: 'obliques', secondaryMuscles: ['core'], equipment: 'bodyweight', isUnilateral: true },
  { name: 'Hanging Leg Raise', category: 'core', primaryMuscle: 'core', secondaryMuscles: ['hip_flexors'], equipment: 'bodyweight' },
  { name: 'Cable Crunch', category: 'core', primaryMuscle: 'core', secondaryMuscles: [], equipment: 'cable' },
  { name: 'Ab Wheel Rollout', category: 'core', primaryMuscle: 'core', secondaryMuscles: ['lats'], equipment: 'bodyweight' },
  { name: 'Russian Twist', category: 'core', primaryMuscle: 'obliques', secondaryMuscles: ['core'], equipment: 'dumbbell' },
  { name: 'Dead Bug', category: 'core', primaryMuscle: 'core', secondaryMuscles: [], equipment: 'bodyweight' },
  { name: 'Pallof Press', category: 'core', primaryMuscle: 'core', secondaryMuscles: ['obliques'], equipment: 'cable' },
  { name: 'Bird Dog', category: 'core', primaryMuscle: 'core', secondaryMuscles: ['glutes', 'lower_back'], equipment: 'bodyweight' },

  // ===== FULL BODY / POWER =====
  { name: 'Power Clean', category: 'full_body', primaryMuscle: 'full_body', secondaryMuscles: ['traps', 'quads', 'hamstrings'], equipment: 'barbell' },
  { name: 'Clean & Press', category: 'full_body', primaryMuscle: 'full_body', secondaryMuscles: [], equipment: 'barbell' },
  { name: 'Snatch', category: 'full_body', primaryMuscle: 'full_body', secondaryMuscles: [], equipment: 'barbell' },
  { name: 'Kettlebell Swing', category: 'full_body', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings', 'core', 'lats'], equipment: 'kettlebell' },
  { name: 'Turkish Get-Up', category: 'full_body', primaryMuscle: 'full_body', secondaryMuscles: [], equipment: 'kettlebell', isUnilateral: true },
  { name: 'Farmer Carry', category: 'full_body', primaryMuscle: 'traps', secondaryMuscles: ['forearms', 'core'], equipment: 'dumbbell' },
  { name: 'Burpee', category: 'full_body', primaryMuscle: 'full_body', secondaryMuscles: [], equipment: 'bodyweight' },
  { name: 'Thruster', category: 'full_body', primaryMuscle: 'quads', secondaryMuscles: ['front_delts', 'triceps', 'glutes'], equipment: 'barbell' },

  // ===== CARDIO =====
  { name: 'Running', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: [], equipment: 'cardio_machine', isCardio: true },
  { name: 'Treadmill Walk', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: [], equipment: 'cardio_machine', isCardio: true },
  { name: 'Cycling', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: ['quads'], equipment: 'cardio_machine', isCardio: true },
  { name: 'Rowing Machine', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: ['lats', 'hamstrings'], equipment: 'cardio_machine', isCardio: true },
  { name: 'Elliptical', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: [], equipment: 'cardio_machine', isCardio: true },
  { name: 'StairMaster', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: ['glutes', 'calves'], equipment: 'cardio_machine', isCardio: true },
  { name: 'Jump Rope', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: ['calves'], equipment: 'bodyweight', isCardio: true },
  { name: 'Swimming', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: ['lats', 'core'], equipment: 'bodyweight', isCardio: true },
  { name: 'Incline Treadmill', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: ['glutes'], equipment: 'cardio_machine', isCardio: true },
  { name: 'Assault Bike', category: 'cardio', primaryMuscle: 'cardio', secondaryMuscles: [], equipment: 'cardio_machine', isCardio: true },

  // ===== MOBILITY / WARM-UP =====
  { name: "World's Greatest Stretch", category: 'mobility', primaryMuscle: 'full_body', secondaryMuscles: [], equipment: 'bodyweight' },
  { name: 'Cat-Cow', category: 'mobility', primaryMuscle: 'spine', secondaryMuscles: [], equipment: 'bodyweight' },
  { name: 'Hip Flexor Stretch', category: 'mobility', primaryMuscle: 'hip_flexors', secondaryMuscles: [], equipment: 'bodyweight' },
  { name: 'Thoracic Rotation', category: 'mobility', primaryMuscle: 'spine', secondaryMuscles: [], equipment: 'bodyweight' },
  { name: 'Band Pull-Apart', category: 'mobility', primaryMuscle: 'rear_delts', secondaryMuscles: ['rotator_cuff'], equipment: 'band' },
  { name: '90/90 Stretch', category: 'mobility', primaryMuscle: 'hips', secondaryMuscles: [], equipment: 'bodyweight' },
];
