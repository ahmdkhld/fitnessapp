import '../../../core/api/api_client.dart';
import '../models/workout_session.dart';

class WorkoutSessionsRepository {
  WorkoutSessionsRepository(this._api);
  final ApiClient _api;

  Future<List<WorkoutSession>> list() async {
    final res = await _api.dio.get<List<dynamic>>('/workout-sessions');
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(WorkoutSession.fromJson)
        .toList();
  }

  Future<WorkoutSession> detail(String id) async {
    final res =
        await _api.dio.get<Map<String, dynamic>>('/workout-sessions/$id');
    return WorkoutSession.fromJson(res.data!);
  }

  Future<WorkoutSession> start({
    String? workoutDayId,
    double? bodyweightKg,
  }) async {
    final res = await _api.dio.post<Map<String, dynamic>>(
      '/workout-sessions/start',
      data: {
        if (workoutDayId != null) 'workoutDayId': workoutDayId,
        if (bodyweightKg != null) 'bodyweightKg': bodyweightKg,
      },
    );
    return WorkoutSession.fromJson(res.data!);
  }

  Future<WorkoutSession> complete(
    String id, {
    String? notes,
    int? energyLevel,
  }) async {
    final res = await _api.dio.patch<Map<String, dynamic>>(
      '/workout-sessions/$id/complete',
      data: {
        if (notes != null) 'notes': notes,
        if (energyLevel != null) 'energyLevel': energyLevel,
      },
    );
    return WorkoutSession.fromJson(res.data!);
  }

  Future<WorkoutSet> logSet({
    required String sessionId,
    required String exerciseId,
    required int setNumber,
    int? reps,
    double? weightKg,
    double? rpe,
    int? durationSec,
    double? distanceKm,
    bool isWarmup = false,
  }) async {
    final res = await _api.dio.post<Map<String, dynamic>>(
      '/workout-sessions/$sessionId/sets',
      data: {
        'exerciseId': exerciseId,
        'setNumber': setNumber,
        if (reps != null) 'reps': reps,
        if (weightKg != null) 'weightKg': weightKg,
        if (rpe != null) 'rpe': rpe,
        if (durationSec != null) 'durationSec': durationSec,
        if (distanceKm != null) 'distanceKm': distanceKm,
        'isWarmup': isWarmup,
      },
    );
    return WorkoutSet.fromJson(res.data!);
  }

  Future<void> deleteSet(String setId) async {
    await _api.dio.delete<void>('/workout-sessions/sets/$setId');
  }
}
