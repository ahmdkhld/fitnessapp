import '../../../core/api/api_client.dart';

class AdherenceSummary {
  const AdherenceSummary({
    required this.total,
    required this.completed,
    required this.overallPercentage,
    required this.perType,
  });

  final int total;
  final int completed;
  final int overallPercentage;
  final List<Map<String, dynamic>> perType;

  factory AdherenceSummary.fromJson(Map<String, dynamic> json) =>
      AdherenceSummary(
        total: json['total'] as int? ?? 0,
        completed: json['completed'] as int? ?? 0,
        overallPercentage: json['overallPercentage'] as int? ?? 0,
        perType: ((json['perType'] as List?) ?? []).cast<Map<String, dynamic>>(),
      );
}

class AnalyticsRepository {
  AnalyticsRepository(this._api);
  final ApiClient _api;

  Future<AdherenceSummary> adherence({String period = 'week'}) async {
    final res = await _api.dio.get<Map<String, dynamic>>(
      '/analytics/adherence',
      queryParameters: {'period': period},
    );
    return AdherenceSummary.fromJson(res.data!);
  }

  Future<int> streak() async {
    final res = await _api.dio.get<Map<String, dynamic>>('/analytics/streaks');
    return res.data?['currentStreak'] as int? ?? 0;
  }

  Future<List<Map<String, dynamic>>> insights() async {
    final res = await _api.dio.get<List<dynamic>>('/analytics/insights');
    return (res.data ?? []).cast<Map<String, dynamic>>();
  }
}
