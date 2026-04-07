import '../../../core/api/api_client.dart';

class BodyLogEntry {
  const BodyLogEntry({
    required this.id,
    required this.date,
    this.weightKg,
    this.waistCm,
    this.bodyFatPct,
    this.energyLevel,
    this.notes,
  });

  final String id;
  final DateTime date;
  final double? weightKg;
  final double? waistCm;
  final double? bodyFatPct;
  final int? energyLevel;
  final String? notes;

  factory BodyLogEntry.fromJson(Map<String, dynamic> json) => BodyLogEntry(
        id: json['id'] as String,
        date: DateTime.parse(json['date'] as String),
        weightKg: (json['weightKg'] as num?)?.toDouble(),
        waistCm: (json['waistCm'] as num?)?.toDouble(),
        bodyFatPct: (json['bodyFatPct'] as num?)?.toDouble(),
        energyLevel: json['energyLevel'] as int?,
        notes: json['notes'] as String?,
      );
}

class BodyLogRepository {
  BodyLogRepository(this._api);
  final ApiClient _api;

  Future<List<BodyLogEntry>> list({DateTime? from, DateTime? to}) async {
    final res = await _api.dio.get<List<dynamic>>(
      '/body-logs',
      queryParameters: {
        if (from != null) 'from': from.toIso8601String(),
        if (to != null) 'to': to.toIso8601String(),
      },
    );
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(BodyLogEntry.fromJson)
        .toList();
  }

  Future<void> create({
    double? weightKg,
    double? waistCm,
    double? bodyFatPct,
    int? energyLevel,
    int? hungerLevel,
    int? sleepQuality,
    String? notes,
    String? photoUrl,
  }) async {
    await _api.dio.post<void>('/body-logs', data: {
      if (weightKg != null) 'weightKg': weightKg,
      if (waistCm != null) 'waistCm': waistCm,
      if (bodyFatPct != null) 'bodyFatPct': bodyFatPct,
      if (energyLevel != null) 'energyLevel': energyLevel,
      if (hungerLevel != null) 'hungerLevel': hungerLevel,
      if (sleepQuality != null) 'sleepQuality': sleepQuality,
      if (notes != null) 'notes': notes,
      if (photoUrl != null) 'photoUrl': photoUrl,
    });
  }
}
