import '../../../core/api/api_client.dart';
import '../models/workout_plan.dart';

class WorkoutPlansRepository {
  WorkoutPlansRepository(this._api);
  final ApiClient _api;

  Future<List<WorkoutPlan>> list() async {
    final res = await _api.dio.get<List<dynamic>>('/workout-plans');
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(WorkoutPlan.fromJson)
        .toList();
  }

  Future<List<WorkoutPlan>> templates() async {
    final res = await _api.dio.get<List<dynamic>>('/workout-plans/templates');
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(WorkoutPlan.fromJson)
        .toList();
  }

  Future<WorkoutPlan> detail(String id) async {
    final res =
        await _api.dio.get<Map<String, dynamic>>('/workout-plans/$id');
    return WorkoutPlan.fromJson(res.data!);
  }

  Future<WorkoutPlan> create({
    required String name,
    String? goal,
    String? splitType,
    int? daysPerWeek,
    String? description,
  }) async {
    final res = await _api.dio.post<Map<String, dynamic>>(
      '/workout-plans',
      data: {
        'name': name,
        if (goal != null) 'goal': goal,
        if (splitType != null) 'splitType': splitType,
        if (daysPerWeek != null) 'daysPerWeek': daysPerWeek,
        if (description != null) 'description': description,
      },
    );
    return WorkoutPlan.fromJson(res.data!);
  }

  Future<WorkoutPlan> cloneTemplate(String templateId) async {
    final res = await _api.dio.post<Map<String, dynamic>>(
      '/workout-plans/templates/$templateId/clone',
    );
    return WorkoutPlan.fromJson(res.data!);
  }

  Future<void> activate(String id) async {
    await _api.dio.post<void>('/workout-plans/$id/activate');
  }

  Future<void> delete(String id) async {
    await _api.dio.delete<void>('/workout-plans/$id');
  }

  Future<void> addDay({
    required String planId,
    required String name,
    int? dayOfWeek,
    int? sortOrder,
  }) async {
    await _api.dio.post<void>('/workout-plans/$planId/days', data: {
      'name': name,
      if (dayOfWeek != null) 'dayOfWeek': dayOfWeek,
      if (sortOrder != null) 'sortOrder': sortOrder,
    });
  }

  Future<void> addExerciseToDay({
    required String dayId,
    required String exerciseId,
    required int targetSets,
    String? targetReps,
    double? targetWeightKg,
    int? restSeconds,
    double progressionKg = 0,
  }) async {
    await _api.dio.post<void>(
      '/workout-plans/days/$dayId/exercises',
      data: {
        'exerciseId': exerciseId,
        'targetSets': targetSets,
        if (targetReps != null) 'targetReps': targetReps,
        if (targetWeightKg != null) 'targetWeightKg': targetWeightKg,
        if (restSeconds != null) 'restSeconds': restSeconds,
        'progressionKg': progressionKg,
      },
    );
  }

  Future<void> removeDayExercise(String rowId) async {
    await _api.dio.delete<void>('/workout-plans/day-exercises/$rowId');
  }
}
