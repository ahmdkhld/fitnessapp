import '../../../core/api/api_client.dart';

class VolumePoint {
  const VolumePoint({required this.bucket, required this.muscle, required this.volumeKg});
  final String bucket;
  final String muscle;
  final int volumeKg;

  factory VolumePoint.fromJson(Map<String, dynamic> json) => VolumePoint(
        bucket: json['bucket'] as String,
        muscle: json['muscle'] as String,
        volumeKg: json['volumeKg'] as int,
      );
}

class PersonalRecord {
  const PersonalRecord({
    required this.id,
    required this.exerciseName,
    required this.recordType,
    required this.value,
    required this.unit,
    required this.achievedAt,
  });

  final String id;
  final String exerciseName;
  final String recordType;
  final double value;
  final String unit;
  final DateTime achievedAt;

  factory PersonalRecord.fromJson(Map<String, dynamic> json) => PersonalRecord(
        id: json['id'] as String,
        exerciseName: (json['exercise'] as Map<String, dynamic>)['name'] as String,
        recordType: json['recordType'] as String,
        value: (json['value'] as num).toDouble(),
        unit: json['unit'] as String,
        achievedAt: DateTime.parse(json['achievedAt'] as String),
      );
}

class WorkoutAnalyticsRepository {
  WorkoutAnalyticsRepository(this._api);
  final ApiClient _api;

  Future<List<VolumePoint>> volume({DateTime? from, DateTime? to}) async {
    final res = await _api.dio.get<List<dynamic>>(
      '/workout-analytics/volume',
      queryParameters: {
        if (from != null) 'from': from.toIso8601String(),
        if (to != null) 'to': to.toIso8601String(),
      },
    );
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(VolumePoint.fromJson)
        .toList();
  }

  Future<List<PersonalRecord>> prs() async {
    final res = await _api.dio.get<List<dynamic>>('/workout-analytics/prs');
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(PersonalRecord.fromJson)
        .toList();
  }
}
