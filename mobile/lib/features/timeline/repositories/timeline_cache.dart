import 'dart:convert';

import 'package:drift/drift.dart';

import '../../../core/database/app_database.dart';
import '../../../models/schedule_item.dart';

/// Offline-first cache for the daily timeline plus a queue of status
/// updates that couldn't be delivered while the device was offline.
///
/// Backed by Drift (SQLite) via [AppDatabase].  The public API is
/// intentionally unchanged so that `TimelineBloc` continues to work
/// without modifications.
class TimelineCache {
  TimelineCache(this._db);

  final AppDatabase _db;

  // -----------------------------------------------------------------------
  // Schedule items
  // -----------------------------------------------------------------------

  /// Load cached schedule items for [date].
  Future<List<ScheduleItem>> load(DateTime date) async {
    final dateKey = _dateKey(date);
    // userId is not enforced at the cache level yet — pass '*' for
    // backward-compat.  Callers can tighten this later.
    final rows = await _db.scheduleItemsFor('*', dateKey);
    return rows
        .map((r) => ScheduleItem(
              id: r.id,
              itemType: r.itemType,
              title: r.title,
              subtitle: r.subtitle,
              scheduledTime: r.scheduledTime,
              status: r.status,
              referenceId: r.referenceId,
            ))
        .toList();
  }

  /// Persist a full day's worth of schedule items, replacing any existing
  /// rows for that date.
  Future<void> save(DateTime date, List<ScheduleItem> items) async {
    final dateKey = _dateKey(date);
    final companions = items
        .map((i) => CachedScheduleItemsCompanion.insert(
              id: i.id,
              userId: '*',
              date: dateKey,
              itemType: i.itemType,
              title: i.title,
              subtitle: Value(i.subtitle),
              scheduledTime: i.scheduledTime,
              status: i.status,
              referenceId: Value(i.referenceId),
            ))
        .toList();
    await _db.replaceScheduleItems('*', dateKey, companions);
  }

  /// Optimistically update the status of a single item in the local cache.
  Future<void> updateLocalStatus(
    DateTime date,
    String itemId,
    String status,
  ) async {
    await _db.updateScheduleItemStatus(itemId, status);
  }

  // -----------------------------------------------------------------------
  // Offline queue (status updates that failed to POST)
  // -----------------------------------------------------------------------

  /// Enqueue a status-update request so it can be replayed once the device
  /// is back online.
  Future<void> enqueueStatusUpdate(String itemId, String status) async {
    final body = jsonEncode({
      'itemId': itemId,
      'status': status,
      'queuedAt': DateTime.now().toIso8601String(),
    });
    await _db.enqueueOffline(
      endpoint: '/api/v1/timeline/items/$itemId/status',
      method: 'PATCH',
      body: body,
    );
  }

  /// Drain the offline queue, returning the raw payloads in FIFO order
  /// and deleting the corresponding rows.
  Future<List<Map<String, dynamic>>> drainQueue() async {
    final entries = await _db.pendingQueueEntries();
    if (entries.isEmpty) return const [];

    final results = <Map<String, dynamic>>[];
    for (final e in entries) {
      results.add(jsonDecode(e.body) as Map<String, dynamic>);
      await _db.deleteQueueEntry(e.id);
    }
    return results;
  }

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  String _dateKey(DateTime d) => d.toIso8601String().substring(0, 10);
}
