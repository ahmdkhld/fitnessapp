import '../../../core/api/api_client.dart';

class SupplementPlan {
  const SupplementPlan({
    required this.id,
    required this.name,
    required this.isActive,
    required this.supplements,
  });
  final String id;
  final String name;
  final bool isActive;
  final List<Supplement> supplements;

  factory SupplementPlan.fromJson(Map<String, dynamic> json) => SupplementPlan(
        id: json['id'] as String,
        name: json['name'] as String,
        isActive: json['isActive'] as bool? ?? false,
        supplements: ((json['supplements'] as List?) ?? [])
            .cast<Map<String, dynamic>>()
            .map(Supplement.fromJson)
            .toList(),
      );
}

class Supplement {
  const Supplement({
    required this.id,
    required this.name,
    required this.scheduledTime,
    this.dosage,
    this.stockQuantity,
  });

  final String id;
  final String name;
  final String scheduledTime;
  final String? dosage;
  final int? stockQuantity;

  factory Supplement.fromJson(Map<String, dynamic> json) {
    final time = json['scheduledTime']?.toString() ?? '';
    return Supplement(
      id: json['id'] as String,
      name: json['name'] as String,
      dosage: json['dosage'] as String?,
      scheduledTime: time.contains('T')
          ? time.substring(11, 16)
          : (time.length >= 5 ? time.substring(0, 5) : time),
      stockQuantity: json['stockQuantity'] as int?,
    );
  }
}

class SupplementRepository {
  SupplementRepository(this._api);
  final ApiClient _api;

  Future<List<SupplementPlan>> list() async {
    final res = await _api.dio.get<List<dynamic>>('/supplement-plans');
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(SupplementPlan.fromJson)
        .toList();
  }

  Future<void> createPlan(String name) async {
    await _api.dio.post<void>('/supplement-plans', data: {'name': name});
  }

  Future<void> activate(String id) async {
    await _api.dio.post<void>('/supplement-plans/$id/activate');
  }

  Future<void> addSupplement({
    required String planId,
    required String name,
    required String scheduledTime,
    String? dosage,
    String? form,
    String frequency = 'daily',
    List<int>? frequencyDays,
    int? stockQuantity,
  }) async {
    await _api.dio.post<void>('/supplement-plans/$planId/supplements', data: {
      'name': name,
      'scheduledTime': scheduledTime,
      if (dosage != null) 'dosage': dosage,
      if (form != null) 'form': form,
      'frequency': frequency,
      if (frequencyDays != null) 'frequencyDays': frequencyDays,
      if (stockQuantity != null) 'stockQuantity': stockQuantity,
    });
  }

  Future<void> deleteSupplement({required String planId, required String suppId}) async {
    await _api.dio.delete<void>('/supplement-plans/$planId/supplements/$suppId');
  }
}
