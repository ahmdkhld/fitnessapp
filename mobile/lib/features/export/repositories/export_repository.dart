import 'dart:typed_data';

import 'package:dio/dio.dart';

import '../../../core/api/api_client.dart';

class CoachReportSummary {
  const CoachReportSummary({
    required this.totalItems,
    required this.completed,
    required this.adherencePct,
    required this.from,
    required this.to,
    required this.userName,
    required this.userGoal,
    required this.workoutSessionCount,
    required this.workoutTotalDurationMin,
  });

  final int totalItems;
  final int completed;
  final int adherencePct;
  final String from;
  final String to;
  final String userName;
  final String userGoal;
  final int workoutSessionCount;
  final int workoutTotalDurationMin;

  factory CoachReportSummary.fromJson(Map<String, dynamic> json) {
    final summary = json['summary'] as Map<String, dynamic>? ?? {};
    final period = json['period'] as Map<String, dynamic>? ?? {};
    final user = json['user'] as Map<String, dynamic>? ?? {};
    final workouts = json['workouts'] as Map<String, dynamic>? ?? {};

    return CoachReportSummary(
      totalItems: summary['totalItems'] as int? ?? 0,
      completed: summary['completed'] as int? ?? 0,
      adherencePct: summary['adherencePct'] as int? ?? 0,
      from: period['from']?.toString().substring(0, 10) ?? '',
      to: period['to']?.toString().substring(0, 10) ?? '',
      userName: user['fullName']?.toString() ?? '',
      userGoal: user['goal']?.toString() ?? '',
      workoutSessionCount: workouts['sessionCount'] as int? ?? 0,
      workoutTotalDurationMin: workouts['totalDurationMin'] as int? ?? 0,
    );
  }
}

class ExportRepository {
  ExportRepository(this._api);
  final ApiClient _api;

  Future<CoachReportSummary> fetchReport({
    required DateTime from,
    required DateTime to,
  }) async {
    final res = await _api.dio.get<Map<String, dynamic>>(
      '/export/report',
      queryParameters: {
        'from': from.toIso8601String().substring(0, 10),
        'to': to.toIso8601String().substring(0, 10),
      },
    );
    return CoachReportSummary.fromJson(res.data!);
  }

  Future<Uint8List> fetchReportPdf({
    required DateTime from,
    required DateTime to,
  }) async {
    final res = await _api.dio.get<List<int>>(
      '/export/report.pdf',
      queryParameters: {
        'from': from.toIso8601String().substring(0, 10),
        'to': to.toIso8601String().substring(0, 10),
      },
      options: Options(responseType: ResponseType.bytes),
    );
    return Uint8List.fromList(res.data!);
  }
}
