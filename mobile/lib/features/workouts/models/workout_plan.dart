import 'exercise.dart';

class WorkoutPlan {
  const WorkoutPlan({
    required this.id,
    required this.name,
    this.goal,
    this.splitType,
    this.daysPerWeek,
    this.description,
    this.isActive = false,
    this.isTemplate = false,
    this.days = const [],
  });

  final String id;
  final String name;
  final String? goal;
  final String? splitType;
  final int? daysPerWeek;
  final String? description;
  final bool isActive;
  final bool isTemplate;
  final List<WorkoutDay> days;

  factory WorkoutPlan.fromJson(Map<String, dynamic> json) => WorkoutPlan(
        id: json['id'] as String,
        name: json['name'] as String,
        goal: json['goal'] as String?,
        splitType: json['splitType'] as String?,
        daysPerWeek: json['daysPerWeek'] as int?,
        description: json['description'] as String?,
        isActive: json['isActive'] as bool? ?? false,
        isTemplate: json['isTemplate'] as bool? ?? false,
        days: ((json['days'] as List?) ?? const [])
            .cast<Map<String, dynamic>>()
            .map(WorkoutDay.fromJson)
            .toList(),
      );
}

class WorkoutDay {
  const WorkoutDay({
    required this.id,
    required this.name,
    this.dayOfWeek,
    this.estimatedDurationMin,
    this.notes,
    this.exercises = const [],
  });

  final String id;
  final String name;
  final int? dayOfWeek;
  final int? estimatedDurationMin;
  final String? notes;
  final List<WorkoutDayExercise> exercises;

  factory WorkoutDay.fromJson(Map<String, dynamic> json) => WorkoutDay(
        id: json['id'] as String,
        name: json['name'] as String,
        dayOfWeek: json['dayOfWeek'] as int?,
        estimatedDurationMin: json['estimatedDurationMin'] as int?,
        notes: json['notes'] as String?,
        exercises: ((json['exercises'] as List?) ?? const [])
            .cast<Map<String, dynamic>>()
            .map(WorkoutDayExercise.fromJson)
            .toList(),
      );
}

class WorkoutDayExercise {
  const WorkoutDayExercise({
    required this.id,
    required this.exercise,
    required this.targetSets,
    this.targetReps,
    this.targetWeightKg,
    this.targetRpe,
    this.restSeconds,
    this.supersetGroup,
    this.progressionKg = 0,
    this.notes,
  });

  final String id;
  final Exercise exercise;
  final int targetSets;
  final String? targetReps;
  final double? targetWeightKg;
  final double? targetRpe;
  final int? restSeconds;
  final String? supersetGroup;
  final double progressionKg;
  final String? notes;

  factory WorkoutDayExercise.fromJson(Map<String, dynamic> json) =>
      WorkoutDayExercise(
        id: json['id'] as String,
        exercise: Exercise.fromJson(json['exercise'] as Map<String, dynamic>),
        targetSets: json['targetSets'] as int,
        targetReps: json['targetReps'] as String?,
        targetWeightKg: (json['targetWeightKg'] as num?)?.toDouble(),
        targetRpe: (json['targetRpe'] as num?)?.toDouble(),
        restSeconds: json['restSeconds'] as int?,
        supersetGroup: json['supersetGroup'] as String?,
        progressionKg: (json['progressionKg'] as num?)?.toDouble() ?? 0,
        notes: json['notes'] as String?,
      );
}
