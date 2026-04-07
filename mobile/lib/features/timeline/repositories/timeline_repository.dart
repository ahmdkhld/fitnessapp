import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import '../../../core/api/api_client.dart';
import '../../../models/schedule_item.dart';
import 'timeline_cache.dart';

/// Offline-first timeline repository.
///
/// Reads always start from the local cache so the UI renders instantly,
/// then a network fetch refreshes the cache. Status updates are written
/// to the cache first, attempted against the API, and queued locally if
/// the network call fails so they can be flushed later.
class TimelineRepository {
  TimelineRepository(this._api, this._cache);
  final ApiClient _api;
  final TimelineCache _cache;

  /// Returns a stream of two snapshots: cached → network. The bloc
  /// renders the first immediately and the second when it arrives.
  Stream<List<ScheduleItem>> watchDay(DateTime date) async* {
    final cached = await _cache.load(date);
    if (cached.isNotEmpty) yield cached;
    try {
      final fresh = await _fetchRemote(date);
      await _cache.save(date, fresh);
      yield fresh;
    } catch (_) {
      if (cached.isEmpty) rethrow;
    }
  }

  Future<List<ScheduleItem>> fetchDay(DateTime date) async {
    try {
      final fresh = await _fetchRemote(date);
      await _cache.save(date, fresh);
      return fresh;
    } on DioException {
      return _cache.load(date);
    }
  }

  Future<List<ScheduleItem>> _fetchRemote(DateTime date) async {
    final res = await _api.dio.get<List<dynamic>>(
      '/schedule',
      queryParameters: {'date': DateFormat('yyyy-MM-dd').format(date)},
    );
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(ScheduleItem.fromJson)
        .toList();
  }

  Future<void> updateStatus(
    String itemId,
    String status, {
    DateTime? date,
    String? notes,
  }) async {
    final today = date ?? DateTime.now();
    await _cache.updateLocalStatus(today, itemId, status);
    try {
      await _api.dio.patch<void>(
        '/schedule/$itemId/status',
        data: {'status': status, if (notes != null) 'notes': notes},
      );
    } on DioException {
      await _cache.enqueueStatusUpdate(itemId, status);
    }
  }

  /// Drains any locally queued updates the next time the app comes online.
  /// Returns the number of updates successfully flushed.
  Future<int> flushQueue() async {
    final queue = await _cache.drainQueue();
    int flushed = 0;
    for (final entry in queue) {
      try {
        await _api.dio.patch<void>(
          '/schedule/${entry['itemId']}/status',
          data: {'status': entry['status']},
        );
        flushed++;
      } catch (_) {
        // Re-queue on failure
        await _cache.enqueueStatusUpdate(
          entry['itemId'] as String,
          entry['status'] as String,
        );
      }
    }
    return flushed;
  }
}
