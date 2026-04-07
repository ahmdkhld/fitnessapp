import 'exercise.dart';
import 'workout_plan.dart';

class WorkoutSet {
  const WorkoutSet({
    required this.id,
    required this.exerciseId,
    required this.setNumber,
    this.reps,
    this.weightKg,
    this.rpe,
    this.durationSec,
    this.distanceKm,
    this.isWarmup = false,
    this.isFailure = false,
    this.restSeconds,
    this.notes,
    this.exercise,
  });

  final String id;
  final String exerciseId;
  final int setNumber;
  final int? reps;
  final double? weightKg;
  final double? rpe;
  final int? durationSec;
  final double? distanceKm;
  final bool isWarmup;
  final bool isFailure;
  final int? restSeconds;
  final String? notes;
  final Exercise? exercise;

  factory WorkoutSet.fromJson(Map<String, dynamic> json) => WorkoutSet(
        id: json['id'] as String,
        exerciseId: json['exerciseId'] as String,
        setNumber: json['setNumber'] as int,
        reps: json['reps'] as int?,
        weightKg: (json['weightKg'] as num?)?.toDouble(),
        rpe: (json['rpe'] as num?)?.toDouble(),
        durationSec: json['durationSec'] as int?,
        distanceKm: (json['distanceKm'] as num?)?.toDouble(),
        isWarmup: json['isWarmup'] as bool? ?? false,
        isFailure: json['isFailure'] as bool? ?? false,
        restSeconds: json['restSeconds'] as int?,
        notes: json['notes'] as String?,
        exercise: json['exercise'] != null
            ? Exercise.fromJson(json['exercise'] as Map<String, dynamic>)
            : null,
      );
}

class WorkoutSession {
  const WorkoutSession({
    required this.id,
    required this.date,
    required this.status,
    this.workoutDayId,
    this.startedAt,
    this.completedAt,
    this.durationMin,
    this.energyLevel,
    this.notes,
    this.day,
    this.sets = const [],
  });

  final String id;
  final String? workoutDayId;
  final DateTime date;
  final String status;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final int? durationMin;
  final int? energyLevel;
  final String? notes;
  final WorkoutDay? day;
  final List<WorkoutSet> sets;

  factory WorkoutSession.fromJson(Map<String, dynamic> json) => WorkoutSession(
        id: json['id'] as String,
        workoutDayId: json['workoutDayId'] as String?,
        date: DateTime.parse(json['date'] as String),
        status: json['status'] as String,
        startedAt: json['startedAt'] != null
            ? DateTime.parse(json['startedAt'] as String)
            : null,
        completedAt: json['completedAt'] != null
            ? DateTime.parse(json['completedAt'] as String)
            : null,
        durationMin: json['durationMin'] as int?,
        energyLevel: json['energyLevel'] as int?,
        notes: json['notes'] as String?,
        day: json['day'] != null
            ? WorkoutDay.fromJson(json['day'] as Map<String, dynamic>)
            : null,
        sets: ((json['sets'] as List?) ?? const [])
            .cast<Map<String, dynamic>>()
            .map(WorkoutSet.fromJson)
            .toList(),
      );
}
